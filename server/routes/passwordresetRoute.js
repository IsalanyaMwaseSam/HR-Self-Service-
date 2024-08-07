const express = require('express');
const router = express.Router();
const passwordresetController = require('../controllers/passwordresetController');

router.post('/forgot-password', passwordresetController.forgotPassword);
router.post('/verify-otp', passwordresetController.verifyOTP);
router.post('/reset-password', passwordresetController.resetPassword);

module.exports = router;
