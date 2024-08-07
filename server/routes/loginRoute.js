const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.post('/login', loginController.login);
router.post('/verify/login-otp', loginController.verifyLoginOTP);

module.exports = router;
