const express = require('express');
const router = express.Router();
const { evaluateApplicant } = require('../controllers/scoreSystemController');

// Route to evaluate an applicant
router.get('/evaluate/:applicantId/:jobRoleId', evaluateApplicant);

module.exports = router;
