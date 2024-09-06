const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachmentController');
const verifyToken = require('../middlweware/verifyToken'); // Middleware for verifying token
const { upload } = require('../utils/utils'); // Importing the multer upload configuration

router.post('/attachments', verifyToken, upload.single('file'), attachmentController.addOrUpdateAttachment);
router.get('/attachments', verifyToken, attachmentController.getApplicantAttachments);


module.exports = router;
