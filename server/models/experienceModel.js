const prisma = require('../prismaClient'); 

class Experience {
  static async findApplicantById(id) {
    return await prisma.applicant.findUnique({ where: { id } });
  }

  static async upsertExperienceInfo(applicantID, experienceInfo) {
    return await prisma.experience.upsert({
      where: { applicantID },
      update: experienceInfo,
      create: { ...experienceInfo, applicantID }
    });
  }

  static async getExperiencesByApplicantId(applicantID) {
    return await prisma.experience.findMany({ where: { applicantID } });
  }
}

module.exports = Experience;
