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

    // Filter files based on their category to ensure they are in the correct section
    const coverLetterFiles = application.coverLetterFiles.filter(file => file.category === 'COVER_LETTER');
    const resumeFiles = application.resumeFiles.filter(file => file.category === 'RESUME');
    const otherFiles = application.otherFiles.filter(file => file.category === 'OTHER');

    // Log for debugging
    console.log('Cover Letter Files:', coverLetterFiles);
    console.log('Resume Files:', resumeFiles);
    console.log('Other Files:', otherFiles);

    // Return the application with the filtered files
    return {
      ...application,
      coverLetterFiles,
      resumeFiles,
      otherFiles,
    };

  } catch (error) {
    throw new Error(`Error fetching application: ${error.message}`);
  }
}

module.exports = {
  fetchApplicationById,
};
