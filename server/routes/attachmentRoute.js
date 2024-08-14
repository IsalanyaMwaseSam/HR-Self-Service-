const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachmentController');
const verifyToken = require('../middlweware/verifyToken'); // Middleware for verifying token

router.post('/attachments', verifyToken, attachmentController.addOrUpdateAttachment);


module.exports = router;
