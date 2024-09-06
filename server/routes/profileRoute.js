const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyToken = require('../middlweware/verifyToken'); // Middleware for verifying token

router.get('/staff/applicant-profile/:id', verifyToken, profileController.getProfileByIdForStaff);
router.get('/profile', verifyToken, profileController.getProfile);

module.exports = router;
