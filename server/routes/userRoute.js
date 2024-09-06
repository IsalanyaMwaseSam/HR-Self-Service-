const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlweware/verifyToken'); 
const { checkPasswordChange } = require('../utils/utils')

router.get('/user', verifyToken, checkPasswordChange, userController.getUserData);

module.exports = router;
