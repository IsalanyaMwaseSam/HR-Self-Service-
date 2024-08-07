const prisma = require('../prismaClient'); 
const bcrypt = require('bcrypt');


class Applicant {
  static async findByEmail(email) {
    return await prisma.applicant.findUnique({ where: { email } });
  }

  static async createApplicant(email, password, token, tokenExpiry) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.applicant.create({
      data: {
        email,
        password: hashedPassword,
        verified: false,
        verificationToken: token,
        tokenExpiry
      }
    });
  }

  static async findByToken(token) {
    return await prisma.applicant.findFirst({ where: { verificationToken: token } });
  }

  static async deleteApplicantByEmail(email) {
    return await prisma.applicant.delete({ where: { email } });
  }

  static async updateApplicant(id, data) {
    return await prisma.applicant.update({
      where: { id },
      data
    });
  }
}

module.exports = Applicant;
