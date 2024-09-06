const prisma = require('../prismaClient');

async function updateApplication(id, data) {
  try {
    console.log('updateApplication function called');
    console.log('Cover Letter Files:', data.coverLetterFiles);
    console.log('Resume Files:', data.resumeFiles);
    console.log('Other Files:', data.otherFiles);
    console.log('data:', data)

    return await prisma.application.update({
      where: { id: parseInt(id, 10) },
      data: {
        vacancyCode: data.vacancyCode,
        department: data.department,
        applicantFirstName: data.applicantFirstName,
        applicantMiddleName: data.applicantMiddleName, 
        applicantLastName: data.applicantLastName,
        applicantLocation: data.applicantLocation,
        applicantAvailability: parseInt(data.applicantAvailability, 10), 
        applicantGender: data.applicantGender,
        applicantAlternativeEmail: data.applicantAlternativeEmail, 
        vacancyDeadline: new Date(data.vacancyDeadline),
        selectedValue: data.selectedValue,
        coverLetterFiles: {
          deleteMany: {},
          create: data.coverLetterFiles.map(file => ({
            url: file.url,
            fileName: file.fileName,
            fileType: file.fileType,
            category: 'COVER_LETTER',
          })),
        },
        resumeFiles: {
          deleteMany: {},
          create: data.resumeFiles.map(file => ({
            url: file.url,
            fileName: file.fileName,
            fileType: file.fileType,
            category: 'RESUME',
          })),
        },
        otherFiles: {
          deleteMany: {},
          create: data.otherFiles.map(file => ({
            url: file.url,
            fileName: file.fileName,
            fileType: file.fileType,
            category: 'OTHER',
            
          }) ),
        },
      },
      
    });

  } catch (error) {
    throw new Error(`Error updating application: ${error.message}`);
  }
}


module.exports = { updateApplication };