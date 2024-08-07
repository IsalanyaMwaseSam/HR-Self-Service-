const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const verifyToken = require('../middlweware/verifyToken'); // Middleware for verifying token

router.post('/experience', verifyToken, experienceController.updateExperienceInfo);
router.get('/experience', verifyToken, experienceController.getExperienceInfo);

module.exports = router;
