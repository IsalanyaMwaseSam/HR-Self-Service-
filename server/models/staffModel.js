const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');

class Staff {
    static async findByEmail(email) {
      return await prisma.staff.findUnique({ where: { email } });
    }
  
    static async createStaff(email, profileId, verificationToken, verificationTokenExpiry) {
      return await prisma.staff.create({
        data: {
          email,
          password: '',
          verificationToken,
          verificationTokenExpiry,
          profile: { connect: { id: profileId } },
        },
      });
    }
  
    static async findByVerificationToken(token) {
      return await prisma.staff.findFirst({
        where: {
          verificationToken: token,
          verificationTokenExpiry: { gte: new Date() }, // Ensure token is not expired
        },
      });
    }
  
    static async updateStaff(id, data) {
      return await prisma.staff.update({
        where: { id },
        data,
      });
    }

    static async deleteStaffByEmail(email) {
        return await prisma.staff.delete({ where: { email } });
      }
  }
  

module.exports = Staff;
