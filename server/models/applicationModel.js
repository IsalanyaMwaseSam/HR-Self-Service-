const prisma = require('../prismaClient');

const createApplication = async (data) => {
  return await prisma.application.create({
    data: {
      vacancyCode: data.vacancyCode,
      selectedValue: data.selectedValue,
      coverLetterFiles: {
        create: data.coverLetterFiles.map(file => ({
          url: file.url,
          fileName: file.fileName,
          fileType: file.fileType,
        })),
      },
      resumeFiles: {
        create: data.resumeFiles.map(file => ({
          url: file.url,
          fileName: file.fileName,
          fileType: file.fileType,
        })),
      },
      otherFiles: {
        create: data.otherFiles.map(file => ({
          url: file.url,
          fileName: file.fileName,
          fileType: file.fileType,
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
