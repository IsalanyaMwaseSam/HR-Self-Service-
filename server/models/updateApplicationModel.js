const prisma = require('../prismaClient');

async function updateApplication(id, data) {
  try {
    return await prisma.application.update({
      where: { id },
      data: {
        vacancyCode: data.vacancyCode,
        department: data.department,
        applicantFirstName: data.applicantFirstName,
        applicantMiddleName: data.applicantMiddleName, 
        applicantLastName: data.applicantLastName,
        applicantLocation: data.applicantLocation,
        applicantAvailability: parseInt(data.applicantAvailability, 10), 
        applicantGender: data.applicantGender,
        applicantAlternativeEmail: data.applicantAlternativeEmail, 
        vacancyDeadline: new Date(data.vacancyDeadline),
        selectedValue: data.selectedValue,
        coverLetterFiles: {
          deleteMany: {},
          create: data.coverLetterFiles.map(file => ({
            url: file.url,
            fileName: file.fileName,
            fileType: file.fileType,
          })),
        },
        resumeFiles: {
          deleteMany: {},
          create: data.resumeFiles.map(file => ({
            url: file.url,
            fileName: file.fileName,
            fileType: file.fileType,
          })),
        },
        otherFiles: {
          deleteMany: {},
          create: data.otherFiles.map(file => ({
            url: file.url,
            fileName: file.fileName,
            fileType: file.fileType,
          })),
        },
      },
    });
  } catch (error) {
    throw new Error(`Error updating application: ${error.message}`);
  }
}

module.exports = { updateApplication };