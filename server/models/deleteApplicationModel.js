const prisma = require('../prismaClient');

async function deleteApplication(id) {
  try {
    // Ensure id is treated as an integer
    const applicationId = parseInt(id, 10);

    if (isNaN(applicationId)) {
      throw new Error('Invalid application ID');
    }

    // Delete all files associated with the application
    await prisma.file.deleteMany({
      where: {
        applicationID: applicationId, // Ensure this is an integer
      },
    });

    // Delete the application itself
    return await prisma.application.delete({
      where: { id: applicationId },
    });
  } catch (error) {
    throw new Error(`Error deleting application: ${error.message}`);
  }
}

module.exports = { deleteApplication };
