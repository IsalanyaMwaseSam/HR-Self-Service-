const prisma = require('../prismaClient'); 

// Function to get profile data for an applicant
async function getProfileById(applicantID) {
  try {
    return await prisma.applicant.findUnique({
      where: { id: applicantID },
      include: {
        education: true,
        skills: true,
        experience: true,
        languages: true,
        attachments: true,
        personal: true,
      }
    });
  } catch (error) {
    throw new Error(`Error fetching profile data: ${error.message}`);
  }
}

module.exports = {
  getProfileById
};
