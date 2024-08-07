const prisma = require('../prismaClient'); 

class Education {
  static async findApplicantById(id) {
    return await prisma.applicant.findUnique({ where: { id } });
  }

  static async upsertEducationInfo(applicantID, educationInfo) {
    return await prisma.education.upsert({
      where: { applicantID },
      update: educationInfo,
      create: { ...educationInfo, applicantID }
    });
  }

  static async getEducationsByApplicantId(applicantID) {
    return await prisma.education.findMany({
      where: { applicantID },
    });
  }
}

module.exports = Education;
