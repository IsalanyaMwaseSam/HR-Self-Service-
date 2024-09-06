const prisma = require('../prismaClient');

// Save a job with evaluation criteria to the database
const saveJobWithCriteria = async (jobData) => {
  console.log('Received jobData:', jobData);

  const {
    jobTitle,
    jobRoleId,
    SystemId,
    positionCode,
    orgDepartment,
    dutyStation,
    contractType,
    duration,
    applicationPeriod,
    evaluationCriteria,
  } = jobData;

  const vacancyCode = jobData.vacancyCode || jobRoleId;

  console.log('Processing job with vacancyCode:', vacancyCode);

  try {
    if (
      !jobTitle ||
      !vacancyCode ||
      !SystemId ||
      !positionCode ||
      !orgDepartment ||
      !dutyStation ||
      !contractType ||
      !duration ||
      !applicationPeriod
    ) {
      throw new Error('Missing required fields in jobData');
    }

    let evaluationCriteriaId = null;
    if (evaluationCriteria) {
      console.log('Creating evaluation criteria...');
      const createdCriteria = await prisma.evaluationCriteria.create({
        data: {
          jobRoleId: vacancyCode,
          createdByEmail: evaluationCriteria.createdByEmail,
          criteria: {
            create: evaluationCriteria.criteria.map(criterion => ({
              label: criterion.label,
              weight: criterion.weight,
              options: {
                create: criterion.options.map(option => ({
                  label: option.label,
                  points: option.points,
                })),
              },
            })),
          },
        },
      });
      evaluationCriteriaId = createdCriteria.id;
      console.log('Evaluation criteria created with ID:', evaluationCriteriaId);
    }

    console.log('Saving job with criteria...');
    const savedJob = await prisma.postedJob.create({
      data: {
        jobTitle,
        vacancyCode,
        SystemId,
        positionCode,
        orgDepartment,
        dutyStation,
        contractType,
        duration,
        applicationPeriod,
        evaluationCriteriaId,
        isPosted: false,
      },
    });

    console.log('Job saved successfully:', savedJob);
    return savedJob;
  } catch (error) {
    console.error('Error saving job with criteria to the database:', error);
    throw error;
  }
};



// Fetch jobs from the external API using fetch
const fetchJobsFromExternalAPI = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10-second timeout

  try {
    const response = await fetch('http://20.87.21.82:9048/HRSuite/api/hrsuite/hrmodule/v2.0/vacancies', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Error fetching jobs from external API: ${response.statusText}`);
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request to external API timed out');
    } else {
      console.error('Error fetching jobs from external API:', error);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

// Fetch evaluation criteria from the database
const fetchEvaluationCriteria = async (jobRoleId, vacancyCode) => {
  try {
    const evaluationCriteria = await prisma.evaluationCriteria.findUnique({
      where: { jobRoleId, vacancyCode },
      include: {
        criteria: {
          include: {
            options: true,
          },
        },
      },
    });
    return evaluationCriteria;
  } catch (error) {
    console.error('Error fetching evaluation criteria from the database:', error);
    throw error;
  }
};

// Combine jobs with evaluation criteria and return the result
const getPostedJobsWithCriteria = async () => {
  try {
    // Fetch jobs and include their evaluation criteria
    const jobs = await prisma.postedJob.findMany({
      include: {
        evaluationCriteria: {
          include: {
            criteria: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });
    return jobs; // Return the fetched jobs
  } catch (error) {
    console.error('Error fetching posted jobs with criteria:', error);
    throw new Error('Failed to fetch posted jobs with criteria');
  }
};


module.exports = {
  fetchJobsFromExternalAPI,
  fetchEvaluationCriteria,
  saveJobWithCriteria,
  getPostedJobsWithCriteria,
};
