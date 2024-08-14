const prisma = require('../prismaClient');

const createApplication = async (data) => {
  return await prisma.application.create({
    data: {
      vacancyCode: data.vacancyCode,
      department: data.department,
      vacancyDeadline: new Date(data.vacancyDeadline), 
      vacancyStatus: data.vacancyStatus,
      selectedValue: data.selectedValue,
      applicantFirstName: data.applicantFirstName,
      applicantMiddleName: data.applicantMiddleName, 
      applicantLastName: data.applicantLastName,
      applicantLocation: data.applicantLocation,
      applicantAvailability: parseInt(data.applicantAvailability, 10), 
      applicantGender: data.applicantGender,
      applicantAlternativeEmail: data.applicantAlternativeEmail, 
      coverLetterFiles: {
        create: data.coverLetterFiles.map(file => ({
          url: file.url,
          fileName: file.fileName,
          fileType: file.fileType,
          category: 'COVER_LETTER',
        })),
      },
      resumeFiles: {
        create: data.resumeFiles.map(file => ({
          url: file.url,
          fileName: file.fileName,
          fileType: file.fileType,
          category: 'RESUME',
        })),
      },
      otherFiles: {
        create: data.otherFiles.map(file => ({
          url: file.url,
          fileName: file.fileName,
          fileType: file.fileType,
          category: 'OTHER',
        })),
      },
      applicant: {
        connect: { id: data.applicantID },
      },
      applicationStatus: 'Applied', 
    },
  });
};


module.exports = { createApplication };
