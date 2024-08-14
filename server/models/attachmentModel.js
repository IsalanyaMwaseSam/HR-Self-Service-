const prisma = require('../prismaClient');


async function upsertAttachment(applicantID, attachmentData) {
  try {
    const lastUpdatedISO = new Date(attachmentData.lastUpdated).toISOString();

    return await prisma.attachment.upsert({
      where: { applicantID: applicantID },
      update: {
        fileType: attachmentData.fileType,
        fileName: attachmentData.fileName,
        fileSize: parseInt(attachmentData.fileSize, 10),
        lastUpdated: lastUpdatedISO,
      },
      create: {
        applicantID,
        fileType: attachmentData.fileType,
        fileName: attachmentData.fileName,
        fileSize: parseInt(attachmentData.fileSize, 10),
        lastUpdated: lastUpdatedISO,
      }
    });
  } catch (error) {
    throw new Error(`Error upserting attachment: ${error.message}`);
  }
}

module.exports = {
  upsertAttachment
};
