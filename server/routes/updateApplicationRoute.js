const express = require('express');
const {updateApplicationHandler} = require('../controllers/updateApplicationController')
const verifyToken = require('../middlweware/verifyToken')
const router = express.Router();

router.put('/my-applications/update/:id', verifyToken, updateApplicationHandler);

module.exports = router;
