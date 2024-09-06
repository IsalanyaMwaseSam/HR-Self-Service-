const prisma = require('../prismaClient');

const fetchApplicationsByJobRole = async (jobRoleId, status) => {
  return await prisma.application.findMany({
    where: {
      vacancyCode: jobRoleId,
      ...(status && { applicationStatus: status }) 
    },
    include: {
      applicant: {
        include: {
          personal: true,    
          education: true,
          certificate: true,
          experience: true,
          skills: true,
          languages: true,
          attachments: true,
        },
      },
    },
  });
};

const fetchApplicationsByJobRoleAndLonglisted = async (jobRoleId) => {
  return await prisma.application.findMany({
    where: {
      vacancyCode: jobRoleId,
      applicationStatus: 'Longlisted'
    },
    include: {
      applicant: {
        include: {
          personal: true,    
          education: true,
          certificate: true,
          experience: true,
          skills: true,
          languages: true,
          attachments: true,
        },
      },
    },
  });
};

module.exports = { fetchApplicationsByJobRole, fetchApplicationsByJobRoleAndLonglisted };
