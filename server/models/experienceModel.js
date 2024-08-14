const prisma = require('../prismaClient');

class Experience {
  static async findApplicantById(id) {
    return await prisma.applicant.findUnique({ where: { id } });
  }

  static async upsertExperienceInfo(applicantID, experienceInfo) {
    const { id, employerName, startDate } = experienceInfo;
  
    // If `id` exists, use it directly to update the record
    const whereClause = id
      ? { id }
      : {
          applicantID_employerName_startDate: {
            applicantID,
            employerName,
            startDate,
          },
        };
  
    return await prisma.experience.upsert({
      where: whereClause,
      update: experienceInfo, // Update with new data
      create: { ...experienceInfo, applicantID }, // Create new if it doesn't exist
    });
  }
  
  
  static async getExperiencesByApplicantId(applicantID) {
    return await prisma.experience.findMany({ where: { applicantID } });
  }

  // Delete experience by ID
  static async deleteExperience(applicantID, employerName, startDate) {
    try {
      return await prisma.experience.delete({
        where: {
          applicantID_employerName_startDate: { 
            applicantID,
            employerName,
            startDate,
          },
        },
      });
    } catch (error) {
      console.error(`Error deleting experience: ${error.message}`);
      throw new Error(`Error deleting experience: ${error.message}`);
    }
  }
}


module.exports = Experience;
