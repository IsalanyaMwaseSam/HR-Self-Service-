const prisma = require('../prismaClient'); 

class User {
  static async findByEmail(email) {
    return await prisma.applicant.findUnique({ where: { email } });
  }
}

module.exports = User;
