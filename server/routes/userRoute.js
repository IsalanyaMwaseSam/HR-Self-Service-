const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlweware/verifyToken'); 

router.get('/user', verifyToken, userController.getUserData);

module.exports = router;
