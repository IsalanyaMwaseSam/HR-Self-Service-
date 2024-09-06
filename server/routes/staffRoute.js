const express = require('express');
const { createStaff } = require('../controllers/staffController');

const router = express.Router();

router.post('/create-staff', createStaff);


module.exports = router;
