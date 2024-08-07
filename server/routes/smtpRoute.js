const express = require('express');
const router = express.Router();
const smtpController = require('../controllers/smtpController'); 


router.post('/smtp-settings', smtpController.saveSMTPSettings);
router.get('/smtp-settings', smtpController.getSMTPSettings);
router.post('/test-smtp', smtpController.testSMTPSettings);

module.exports = router;
