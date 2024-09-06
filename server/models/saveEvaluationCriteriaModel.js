const prisma = require('../prismaClient');


// Create new evaluation criteria
const createEvaluationCriteria = async (jobRoleId, criteria, createdByEmail) => {
  try {
    // Ensure the Staff record exists
    const staffRecord = await prisma.staff.findUnique({
      where: { email: createdByEmail },  
    });

    if (!staffRecord) {
      throw new Error(`No Staff record found with email: ${createdByEmail}`);
    }

    // Proceed with creating the evaluation criteria
    const createdCriteria = await prisma.evaluationCriteria.create({
      data: {
        jobRoleId,
        criteria: {
          create: criteria.map(criterion => ({
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
        createdBy: {
          connect: { email: createdByEmail },  // Connect to the Staff record using the email
        },
      },
      include: {
        criteria: {
          include: {
            options: true,
          },
        },
      },
    });
    return createdCriteria;
  } catch (error) {
    console.error('Error creating evaluation criteria in model:', error);
    throw error; // Re-throw the error to be handled in the controller
  }
};

// Fetch all evaluation criteria
const getAllEvaluationCriteria = async (vacancyCode) => {
  try {
    console.log("Vacancy code extracted from query:", vacancyCode);

    if (!vacancyCode) {
      throw new Error("vacancyCode parameter is required");
    }

    const criteriaList = await prisma.evaluationCriteria.findMany({
      where: {
        jobRoleId: vacancyCode,
      },
      include: {
        criteria: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!criteriaList || criteriaList.length === 0) {
      return { status: 404, message: 'No criteria found for this vacancy code' };
    }

    return { status: 200, data: criteriaList[0] };
  } catch (error) {
    console.error("Error fetching evaluation criteria:", error);
    return { status: 500, message: 'Failed to fetch evaluation criteria' };
  }
};


// Delete existing criteria by EvaluationCriteria ID
const deleteCriteriaByEvaluationCriteriaId = async (evaluationCriteriaId) => {
  try {
    // Delete all options associated with the criteria
    await prisma.option.deleteMany({
      where: {
        criterion: {
          evaluationCriteriaId: evaluationCriteriaId,
        },
      },
    });

    // Delete the criteria after the options are removed
    await prisma.criterion.deleteMany({
      where: { evaluationCriteriaId },
    });
  } catch (error) {
    console.error('Error deleting criteria in model:', error);
    throw error; // Re-throw the error to be handled in the controller
  }
};


// Update existing evaluation criteria
const updateEvaluationCriteria = async (id, jobRoleId, criteria) => {
  try {
    for (const criterion of criteria) {
      const existingCriterion = await prisma.criterion.findFirst({
        where: {
          evaluationCriteriaId: id,
          label: criterion.label, // This assumes the label is unique. If not, use a unique ID.
        },
      });

      if (existingCriterion) {
        // Update the existing criterion
        await prisma.criterion.update({
          where: { id: existingCriterion.id }, // Match by unique ID
          data: {
            weight: criterion.weight,
            options: {
              // Update options individually instead of deleting them all
              upsert: criterion.options.map(option => ({
                where: { id: option.id || -1 }, // Use the option's unique ID
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
        });
      } else {
        // Create a new criterion if it doesn't exist
        await prisma.criterion.create({
          data: {
            evaluationCriteriaId: id,
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
    }

    // Optionally, remove any criteria that no longer exist in the update data
    await prisma.criterion.deleteMany({
      where: {
        evaluationCriteriaId: id,
        label: { notIn: criteria.map(criterion => criterion.label) }, // Keep existing criteria
      },
    });

    // Update the job role title if necessary
    await prisma.evaluationCriteria.update({
      where: { id },
      data: { jobRoleId },
    });

    return true;
  } catch (error) {
    console.error('Error updating evaluation criteria:', error);
    throw error;
  }
};

const updatePostedStatus = async (jobRoleId) => {
  try {
    await prisma.postedJob.update({
      where: {
        vacancyCode: jobRoleId,
      },
      data: {
        isPosted: true,
      },
    });
  } catch (error) {
    console.error('Error updating isPosted status:', error);
    throw error;
  }
};


module.exports = {
  createEvaluationCriteria,
  getAllEvaluationCriteria,
  deleteCriteriaByEvaluationCriteriaId,
  updateEvaluationCriteria,
  updatePostedStatus
};
