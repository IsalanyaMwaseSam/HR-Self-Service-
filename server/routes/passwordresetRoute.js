const express = require('express');
const router = express.Router();
const passwordresetController = require('../controllers/passwordresetController');
const { checkPasswordChange } = require('../utils/utils')

router.post('/forgot-password', passwordresetController.forgotPassword);
router.post('/verify-otp', passwordresetController.verifyOTP);
router.post('/reset-password', checkPasswordChange, passwordresetController.resetPassword);

module.exports = router;
