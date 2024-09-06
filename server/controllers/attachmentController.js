const attachmentModel = require('../models/attachmentModel'); 
const {uploadFile} = require('../utils/utils')

exports.addOrUpdateAttachment = async (req, res) => {
  try {
    const { lastUpdated } = req.body; // Only destructuring lastUpdated from req.body
    const { file } = req; // Access the uploaded file

    // Save the file using the uploadFile function
    const fileMetadata = await uploadFile(file);

    // Use the attachment model to upsert attachment data
    const savedAttachment = await attachmentModel.upsertAttachment(req.user.id, {
      fileType: fileMetadata.fileType, // From fileMetadata
      fileName: fileMetadata.fileName, // From fileMetadata
      fileSize: parseInt(fileMetadata.fileSize, 10), // From fileMetadata
      lastUpdated, // From req.body
      url: fileMetadata.url  // From fileMetadata
    });

    res.status(200).json(savedAttachment);

  } catch (error) {
    console.error('Error updating Attachments information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getApplicantAttachments = async (req, res) => {
  try {
    const attachments = await attachmentModel.getAttachmentsByApplicantID(req.user.id);

    if (attachments.length === 0) {
      return res.status(404).json({ message: 'No attachments found for this applicant.' });
    }

    res.status(200).json(attachments);
  } catch (error) {
    console.error('Error fetching attachments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
