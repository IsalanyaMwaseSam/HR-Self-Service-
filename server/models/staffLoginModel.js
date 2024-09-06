const prisma = require('../prismaClient'); 

class StaffLogin {
  static async findByEmail(email) {
    return await prisma.staff.findUnique({ where: { email } });
  }

  static async createSessionToken(email, sessionToken) {
    return await prisma.staff.update({
      where: { email },
      data: { sessionToken }
    });
  }


  static async updateFailedLoginAttempts(email, attempts) {
    return await prisma.staff.update({
      where: { email },
      data: { failedLoginAttempts: attempts }
    });
  }
}

module.exports = StaffLogin;
