const express = require('express');
const router = express.Router();
const { submitApplication } = require('../controllers/applicationController');
const upload = require('../utils/multerConfig');
const verifyToken = require('../middlweware/verifyToken');

router.post('/apply/:vacancyCode', verifyToken,
  upload.fields([
    { name: 'coverLetterFiles', maxCount: 1 },
    { name: 'resumeFiles', maxCount: 1 },
    { name: 'otherFiles', maxCount: 3 },
  ]),
  submitApplication
);

module.exports = router;
