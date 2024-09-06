const express = require('express');
const { getPendingShortlistCounts } = require('../controllers/pendingShortlistCountController');

const router = express.Router();

router.get('/pending/shortlist-counts', getPendingShortlistCounts);

module.exports = router;
