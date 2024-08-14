const prisma = require('../prismaClient'); 

// Function to find or create a skill record
async function upsertSkill(applicantID, skillData) {
  try {
    const { skillDescription, yearsOfExperience } = skillData;

    // Upsert the skill information based on applicantID and skillDescription
    return await prisma.skill.upsert({
      where: {
        applicantID_skillDescription: {
          applicantID,
          skillDescription,
        }
      },
      update: {
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

// Function to delete a skill record
async function deleteSkill(applicantID, skillDescription) {
  try {
    return await prisma.skill.delete({
      where: {
        applicantID_skillDescription: {  
          applicantID,
          skillDescription,
        }
      }
    });
  } catch (error) {
    console.error(`Error deleting skill: ${error.message}`);
    throw new Error(`Error deleting skill: ${error.message}`);
  }
}


module.exports = {
  upsertSkill,
  getSkillsByApplicantID,
  deleteSkill 
};
