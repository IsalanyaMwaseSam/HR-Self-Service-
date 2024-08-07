const prisma = require('../prismaClient'); 

// Function to get user data by email
async function getUserByEmail(email) {
  try {
    return await prisma.applicant.findUnique({
      where: { email }
    });
  } catch (error) {
    throw new Error(`Error fetching user by email: ${error.message}`);
  }
}

module.exports = {
  getUserByEmail
};
