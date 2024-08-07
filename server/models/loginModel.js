const prisma = require('../prismaClient'); 

class Login {
  static async findByEmail(email) {
    return await prisma.applicant.findUnique({ where: { email } });
  }

  static async createSessionToken(email, sessionToken) {
    return await prisma.applicant.update({
      where: { email },
      data: { sessionToken }
    });
  }

  static async updateOTP(email, otp, expiry) {
    return await prisma.applicant.update({
      where: { email },
      data: {
        loginOTP: otp,
        loginOTPExpiry: expiry
      }
    });
  }

  static async clearOTP(email) {
    return await prisma.applicant.update({
      where: { email },
      data: {
        loginOTP: null,
        loginOTPExpiry: null
      }
    });
  }

  static async updateLastOtpValidation(email, lastOtpValidation) {
    return await prisma.applicant.update({
      where: { email },
      data: { lastOtpValidation }
    });
  }

  static async updateFailedLoginAttempts(email, attempts) {
    return await prisma.applicant.update({
      where: { email },
      data: { failedLoginAttempts: attempts }
    });
  }
}

module.exports = Login;
