const prisma = require('../prismaClient');

class Education {
  static async findApplicantById(id) {
    return await prisma.applicant.findUnique({ where: { id } });
  }

  static async upsertEducationEntry(applicantID, educationEntry) {
    return await prisma.education.upsert({
      where: {
        applicantID_title: {
          applicantID,
          title: educationEntry.title,
        }
      },
      update: educationEntry,
      create: { ...educationEntry, applicantID }
    });
  }

  static async upsertCertificateEntry(applicantID, certificateEntry) {
    return await prisma.certificate.upsert({
      where: {
        applicantID_certificateName: {
          applicantID,
          certificateName: certificateEntry.certificateName,
        }
      },
      update: certificateEntry,
      create: { ...certificateEntry, applicantID }
    });
  }

  static async getEducationsByApplicantId(applicantID) {
    return await prisma.education.findMany({
      where: { applicantID },
    });
  }

  static async getCertificatesByApplicantId(applicantID) {
    return await prisma.certificate.findMany({
      where: { applicantID },
    });
  }
}

module.exports = Education;
