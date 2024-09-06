const prisma = require('../prismaClient'); 

// Function to get profile data for an applicant
async function getProfileById(applicantID, email) {
  try {
    // If applicantID is provided, search by ID; otherwise, search by email
    const whereClause = applicantID
      ? { id: applicantID }
      : { email: email };

    return await prisma.applicant.findUnique({
      where: whereClause,
      include: {
        education: true,
        skills: true,
        experience: true,
        certificate: true,
        languages: true,
        attachments: true,
        personal: true
      }
    });
  } catch (error) {
    throw new Error("Error fetching profile data: " + error.message);
  }
}



module.exports = {
  getProfileById,
};
