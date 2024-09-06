const express = require('express');
const router = express.Router();
const verifyToken = require('../middlweware/verifyToken'); 
const userdataController = require('../controllers/userdataController');
const {checkPasswordChange} = require('../utils/utils') 

// Define the route for fetching user data
router.get('/user-data', verifyToken, checkPasswordChange, userdataController.getUserData);

module.exports = router;
