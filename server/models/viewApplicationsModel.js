const prisma = require('../prismaClient');

async function fetchApplicationById(applicationId, applicantID) {
    try {
      const application = await prisma.application.findUnique({
        where: {
          id: applicationId,
          applicantID: applicantID,
        },
        include: {
          coverLetterFiles: true,
          resumeFiles: true,
          otherFiles: true,
        },
      });
  
      if (!application) {
        throw new Error('Application not found or you do not have access to this application.');
      }
  
      return application;
    } catch (error) {
      throw new Error(`Error fetching application: ${error.message}`);
    }
  }

module.exports = {
    fetchApplicationById
}
  