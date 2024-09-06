const prisma = require('../prismaClient');
const { createEvaluationCriteria, deleteCriteriaByEvaluationCriteriaId, updateEvaluationCriteria, getAllEvaluationCriteria, updatePostedStatus } = require('../models/saveEvaluationCriteriaModel');

// Save new or update existing evaluation criteria and create a job
const saveEvaluationCriteriaAndCreateJob = async (req, res) => {
  const {
    jobRoleId, jobTitle, criteria, SystemId, positionCode, orgDepartment,
    dutyStation, contractType, duration, applicationPeriod
  } = req.body;

  console.log("Job role id:", jobRoleId)
  console.log("job title:", jobTitle)
  console.log("criteria:", criteria)
  console.log("system id:", SystemId)
  console.log("position code:", positionCode)
  console.log("org department:", orgDepartment)
  console.log("duty station:", dutyStation)
  console.log("contract type:", contractType)
  console.log("duration:", duration)
  console.log("application period:", applicationPeriod)

  const { email } = req.user;

  try {
    // Validate required fields
    if (!jobRoleId || !jobTitle || !SystemId || !positionCode || !orgDepartment || !dutyStation || !contractType || !duration || !applicationPeriod) {
      throw new Error('Missing required fields for job creation');
    }

    // Find existing evaluation criteria by jobRoleId
    let evaluationCriteria = await prisma.evaluationCriteria.findFirst({
      where: { jobRoleId },
      include: { criteria: true },  // Fetch existing criteria for this evaluation
    });

    // Update existing criteria or create new ones
    if (evaluationCriteria) {
      // Iterate through each new criterion from the request
      for (const criterion of criteria) {
        // Find the existing criterion by label
        const existingCriterion = evaluationCriteria.criteria.find(c => c.label === criterion.label);

        await prisma.criterion.upsert({
          where: { id: existingCriterion ? existingCriterion.id : undefined },  // Use id if criterion exists
          update: {
            weight: criterion.weight,
            options: {
              upsert: criterion.options.map(option => ({
                where: { id: option.id || -1 },  // Use the unique option id
                update: {
                  label: option.label,
                  points: option.points,
                },
                create: {
                  label: option.label,
                  points: option.points,
                },
              })),
            },
          },
          create: {
            evaluationCriteriaId: evaluationCriteria.id,
            label: criterion.label,
            weight: criterion.weight,
            options: {
              create: criterion.options.map(option => ({
                label: option.label,
                points: option.points,
              })),
            },
          },
        });
      }

      // Optionally remove any criteria that no longer exist in the update
      await prisma.criterion.deleteMany({
        where: {
          evaluationCriteriaId: evaluationCriteria.id,
          label: { notIn: criteria.map(c => c.label) },  // Keep only the labels from the current update
        },
      });

    } else {
      // Create new criteria if they don't exist
      evaluationCriteria = await createEvaluationCriteria(jobRoleId, criteria, email);
    }

    // Update or create the job posting with the new evaluation criteria
    const job = await prisma.postedJob.upsert({
      where: { vacancyCode: jobRoleId },
      update: {
        jobTitle,
        SystemId,
        positionCode,
        orgDepartment,
        dutyStation,
        contractType,
        duration,
        applicationPeriod,
        evaluationCriteriaId: evaluationCriteria.id,
      },
      create: {
        jobTitle,
        vacancyCode: jobRoleId,
        SystemId,
        positionCode,
        orgDepartment,
        dutyStation,
        contractType,
        duration,
        applicationPeriod,
        evaluationCriteriaId: evaluationCriteria.id,
        isPosted: false,
      },
    });

    res.status(201).json({ message: 'Evaluation criteria and job saved successfully!', data: { evaluationCriteria, job } });
  } catch (error) {
    console.error('Error saving evaluation criteria and creating job:', error);
    res.status(500).json({ error: 'Failed to save evaluation criteria and create job' });
  }
};

// Fetch all saved evaluation criteria for all job roles
const getAllEvaluationCriteriaHandler = async (req, res) => {
  try {
    const { vacancyCode } = req.query;

    if (!vacancyCode) {
      return res.status(400).json({ error: 'vacancyCode query parameter is required' });
    }

    // Fetch the evaluation criteria for the given jobRoleId (vacancyCode)
    const evaluationCriteria = await prisma.evaluationCriteria.findFirst({
      where: { jobRoleId: vacancyCode },  // Assuming jobRoleId is the vacancyCode
      include: {
        criteria: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!evaluationCriteria) {
      return res.status(404).json({ error: 'No criteria found for this vacancy code' });
    }

    // Fetch job details from the postedJob table using the same vacancyCode
    const jobDetails = await prisma.postedJob.findUnique({
      where: { vacancyCode },
    });

    if (!jobDetails) {
      return res.status(404).json({ error: 'No job details found for this vacancy code' });
    }

    // Send both evaluation criteria and job details to the front-end
    res.status(200).json({
      evaluationCriteria,
      jobDetails,  // Include job-related details such as systemId, positionCode, etc.
    });
  } catch (error) {
    console.error("Error fetching evaluation criteria:", error);
    res.status(500).json({ error: 'Failed to fetch evaluation criteria' });
  }
};



module.exports = {
  saveEvaluationCriteriaAndCreateJob,
  getAllEvaluationCriteriaHandler,
};

