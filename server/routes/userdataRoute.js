const express = require('express');
const router = express.Router();
const verifyToken = require('../middlweware/verifyToken'); 
const userdataController = require('../controllers/userdataController'); 

// Define the route for fetching user data
router.get('/user-data', verifyToken, userdataController.getUserData);

module.exports = router;
