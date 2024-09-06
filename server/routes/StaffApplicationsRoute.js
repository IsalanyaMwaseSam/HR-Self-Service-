const express = require('express');
const { getApplicationsByJobRoleHandler, getApplicationsByJobRoleHandlerAndLonglisted, checkLonglistStatus } = require('../controllers/StaffApplicationsController'); // New controller
const verifyToken = require('../middlweware/verifyToken');
const router = express.Router();


// New route for staff to fetch applications by job role
router.get('/applications/by-job-role', verifyToken, getApplicationsByJobRoleHandler);
router.get('/applications/by-job-role/check', verifyToken, checkLonglistStatus);
router.get('/applications/by-job-role/longlisted', verifyToken, getApplicationsByJobRoleHandlerAndLonglisted);

module.exports = router;
