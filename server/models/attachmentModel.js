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
        url: attachmentData.url,
        lastUpdated: lastUpdatedISO,
      },
      create: {
        // applicantID,
        fileType: attachmentData.fileType,
        fileName: attachmentData.fileName,
        fileSize: parseInt(attachmentData.fileSize, 10),
        url: attachmentData.url,
        lastUpdated: lastUpdatedISO,
        applicant: {
          connect: { id: applicantID }  // Explicitly connecting the relationship
        }
      }
    });
  } catch (error) {
    throw new Error(`Error upserting attachment: ${error.message}`);
  }
}

async function getAttachmentsByApplicantID(applicantID) {
  try {
    return await prisma.attachment.findMany({
      where: { applicantID: applicantID },
    });
  } catch (error) {
    throw new Error(`Error fetching attachments: ${error.message}`);
  }
}

module.exports = {
  upsertAttachment,
  getAttachmentsByApplicantID
};
