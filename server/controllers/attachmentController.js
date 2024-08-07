const attachmentModel = require('../models/attachmentModel'); 

exports.addOrUpdateAttachment = async (req, res) => {
  try {
    const { fileType, fileName, fileSize, lastUpdated } = req.body;

    // Use the attachment model to upsert attachment data
    await attachmentModel.upsertAttachment(req.user.id, {
      fileType,
      fileName,
      fileSize,
      lastUpdated,
    });

    res.status(200).json({ message: 'Your Attachments information has been successfully updated' });

  } catch (error) {
    console.error('Error updating Attachments information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
