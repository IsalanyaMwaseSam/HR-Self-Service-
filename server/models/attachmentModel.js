const prisma = require('../prismaClient'); 

// Function to upsert an attachment record
async function upsertAttachment(applicantID, attachmentData) {
  try {
    const { fileType, fileName, fileSize, lastUpdated } = attachmentData;

    return await prisma.attachment.upsert({
      where: { applicantID: applicantID },
      update: {
        fileType,
        fileName,
        fileSize,
        lastUpdated,
      },
      create: {
        applicantID,
        fileType,
        fileName,
        fileSize,
        lastUpdated,
      }
    });
  } catch (error) {
    throw new Error(`Error upserting attachment: ${error.message}`);
  }
}

module.exports = {
  upsertAttachment
};
