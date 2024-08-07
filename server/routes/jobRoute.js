const express = require('express');
const { fetchJobDetails } = require('../controllers/jobController');

const router = express.Router();

router.get('/jobDetails/:vacancyCode', fetchJobDetails);

module.exports = router;
