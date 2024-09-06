const express = require('express');
const router = express.Router();
const {stafflogin} = require('../controllers/staffLoginController');

router.post('/staff/login', stafflogin);


module.exports = router;
