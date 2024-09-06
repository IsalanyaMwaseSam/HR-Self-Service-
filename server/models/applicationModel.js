const prisma = require('../prismaClient');

const createApplication = async (data) => {
  // Find the corresponding PostedJob by vacancyCode
  const postedJob = await prisma.postedJob.findUnique({
    where: { vacancyCode: data.vacancyCode },
  });

  if (!postedJob) {
    throw new Error(`No PostedJob found with vacancyCode: ${data.vacancyCode}`);
  }

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
      applicationScore: data.applicationScore,
      applicationStatus: 'Applied',
      postedJob: {
        connect: { id: postedJob.id },
      },
    },
  });
};


module.exports = { createApplication };
