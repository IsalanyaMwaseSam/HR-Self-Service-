const prisma = require('../prismaClient'); 

// Function to find or create a skill record
async function upsertSkill(applicantID, skillData) {
  try {
    const { skillDescription, yearsOfExperience } = skillData;

    // Upsert the skill information
    return await prisma.skill.upsert({
      where: { applicantID: applicantID },
      update: {
        skillDescription,
        yearsOfExperience,
      },
      create: {
        applicantID,
        skillDescription,
        yearsOfExperience,
      }
    });
  } catch (error) {
    console.error(`Error upserting skill: ${error.message}`);
    throw new Error(`Error upserting skill: ${error.message}`);
  }
}

// Function to get all skills for a specific applicant
async function getSkillsByApplicantID(applicantID) {
  try {
    return await prisma.skill.findMany({
      where: { applicantID }
    });
  } catch (error) {
    throw new Error(`Error fetching skills: ${error.message}`);
  }
}

module.exports = {
  upsertSkill,
  getSkillsByApplicantID
};
