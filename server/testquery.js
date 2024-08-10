const prisma = require('../server/prismaClient')

async function testGetApplications() {
  try {
    const applications = await prisma.application.findMany({
      include: {
        coverLetterFiles: true,
        resumeFiles: true,
        otherFiles: true,
        applicant: true,
      },
    });
    console.log('Fetched applications:', applications);
    console.log('Cover Letter Files:', JSON.stringify(applications[0].coverLetterFiles, null, 2));
    console.log('Resume Files:', JSON.stringify(applications[0].resumeFiles, null, 2));
    console.log('Other Files:', JSON.stringify(applications[0].otherFiles, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testGetApplications();
