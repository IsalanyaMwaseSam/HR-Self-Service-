const prisma = require('../prismaClient');

// Function to create an application
async function createApplication(data) {
  try {
    return await prisma.application.create({
      data: {
        vacancyCode: data.vacancyCode,
        department: data.department,
        vacancyDeadline: new Date(data.vacancyDeadline),
        vacancyStatus: data.vacancyStatus,
        selectedValue: data.selectedValue,
        applicantID: data.applicantID,
        applicantFirstName: data.firstName,
        applicantMiddleName: data.middleName,
        applicantLastName: data.lastName,
        applicantLocation: data.location,
        applicantAvailability: data.availability,
        applicantGender: data.gender,
        applicantAlternativeEmail: data.alternativeEmail,
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
      },
    });
  } catch (error) {
    throw new Error(`Error creating application: ${error.message}`);
  }
}

// Function to fetch applications by applicant's email
async function fetchApplicationsByEmail(userEmail) {
  try {
    const applications = await prisma.application.findMany({
      where: {
        applicant: {
          email: userEmail,
        },
      },
      include: {
        coverLetterFiles: true,
        resumeFiles: true,
        otherFiles: true,
        applicant: true,
      },
    });

    const currentDate = new Date();

    return applications.map(app => ({
      ...app,
      canEditOrWithdraw: app.applicationStatus !== 'Longlisted' && new Date(app.vacancyDeadline) > currentDate,
    }));
  } catch (error) {
    throw new Error(`Error fetching applications for ${userEmail}: ${error.message}`);
  }
}

// Function to update the status of an application
async function updateApplicationStatus(id, status) {
  try {
    return await prisma.application.update({
      where: { id: parseInt(id) },
      data: { applicationStatus: status },
    });
  } catch (error) {
    throw new Error(`Error updating application status: ${error.message}`);
  }
}

module.exports = {
  createApplication,
  fetchApplicationsByEmail,
  updateApplicationStatus
};
