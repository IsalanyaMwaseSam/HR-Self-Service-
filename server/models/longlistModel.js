const prisma = require('../prismaClient');

const applications = prisma.application;

module.exports = {
    applications,
};
