const express = require('express');
const {updateApplicationHandler} = require('../controllers/updateApplicationController')
const verifyToken = require('../middlweware/verifyToken')
const router = express.Router();
const { upload } = require('../utils/utils');

router.put('/my-applications/update/:id', upload.fields([
    { name: 'coverLetterFiles', maxCount: 10 },
    { name: 'resumeFiles', maxCount: 10 },
    { name: 'otherFiles', maxCount: 10 }
  ]), verifyToken, updateApplicationHandler);

module.exports = router;
