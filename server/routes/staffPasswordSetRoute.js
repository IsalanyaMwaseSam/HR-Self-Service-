const express = require('express');
const { setPassword } = require('../controllers/staffPasswordSetController');

const router = express.Router();

router.post('/set-password/:token', setPassword);


module.exports = router;
