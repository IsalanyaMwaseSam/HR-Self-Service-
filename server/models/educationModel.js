const prisma = require('../prismaClient');

class Education {
  static async findApplicantById(id) {
    return await prisma.applicant.findUnique({ where: { id } });
  }

  static async upsertEducationEntry(applicantID, educationEntry) {
    return await prisma.education.upsert({
      where: {
        applicantID_title: {
          applicantID,  // Use the provided applicantID
          title: educationEntry.title,  // Ensure this matches the entry's title
        }
      },
      update: {
        institution: educationEntry.institution,
        degree: educationEntry.degree,
        country: educationEntry.country,
        title: educationEntry.title,
        startDate: educationEntry.startDate,
        endDate: educationEntry.endDate,
        level: educationEntry.level,
        subject: educationEntry.subject,
      },
      create: {
        institution: educationEntry.institution,
        degree: educationEntry.degree,
        country: educationEntry.country,
        title: educationEntry.title,
        startDate: educationEntry.startDate,
        endDate: educationEntry.endDate,
        level: educationEntry.level,
        subject: educationEntry.subject,
        applicantID,  // This should link the education entry to the applicant
        // Remove the applicant field entirely
      }
    });
  }
  
  
  static async upsertCertificateEntry(applicantID, certificateEntry) {
    return await prisma.certificate.upsert({
      where: {
        applicantID_certificateName: {
          applicantID, // Use the provided applicantID
          certificateName: certificateEntry.certificateName, // Ensure this matches the entry's certificate name
        }
      },
      update: {
        certificateName: certificateEntry.certificateName,
        issuingInstitution: certificateEntry.issuingInstitution,
        registrationNumber: certificateEntry.registrationNumber,
        yearOfIssue: certificateEntry.yearOfIssue,
      },
      create: {
        certificateName: certificateEntry.certificateName,
        issuingInstitution: certificateEntry.issuingInstitution,
        registrationNumber: certificateEntry.registrationNumber,
        yearOfIssue: certificateEntry.yearOfIssue,
        applicantID,  // Link the certificate to the applicant using applicantID
        // Remove any reference to 'applicant' here
      }
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
