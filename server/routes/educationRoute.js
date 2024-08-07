const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const verifyToken = require('../middlweware/verifyToken'); // Middleware for verifying token

router.post('/education', verifyToken, educationController.updateEducationInfo);
router.get('/education', verifyToken, educationController.getEducationInfo);

module.exports = router;
