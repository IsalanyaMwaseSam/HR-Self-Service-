const prisma = require('../prismaClient'); 

class PasswordReset {
  static async updateOTP(email, otp, otpExpiry) {
    return await prisma.applicant.update({
      where: { email },
      data: { otp, otpExpiry }
    });
  }

  static async findByEmail(email) {
    return await prisma.applicant.findUnique({ where: { email } });
  }

  static async findValidOTP(email, otp) {
    return await prisma.applicant.findFirst({
      where: {
        email,
        otp,
        otpExpiry: {
          gte: new Date() // Check if OTP expiry is greater than or equal to current date
        }
      }
    });
  }

  static async clearOTP(email) {
    return await prisma.applicant.update({
      where: { email },
      data: { otp: null, otpExpiry: null }
    });
  }

  static async updatePassword(email, hashedPassword) {
    return await prisma.applicant.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiry: null,
      }
    });
  }
}

module.exports = PasswordReset;
