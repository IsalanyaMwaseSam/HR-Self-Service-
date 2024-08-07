const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personalController');
const verifyToken = require('../middlweware/verifyToken'); // Middleware for verifying token

router.post('/personal', verifyToken, personalController.updatePersonalInfo);

module.exports = router;
