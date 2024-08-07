const prisma = require('../prismaClient'); 

class Personal {
  static async findApplicantByEmail(email) {
    return await prisma.applicant.findUnique({ where: { email } });
  }

  static async upsertPersonalInfo(applicantID, personalInfo) {
    return await prisma.personal.upsert({
      where: { applicantID },
      update: personalInfo,
      create: { ...personalInfo, applicantID }
    });
  }
}

module.exports = Personal;
