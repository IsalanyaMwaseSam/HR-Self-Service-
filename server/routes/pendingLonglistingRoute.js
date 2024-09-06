const express = require('express');
const { getPendingLonglistCounts } = require('../controllers/pendingLonglistingCount');

const router = express.Router();

router.get('/pending-longlist-counts', getPendingLonglistCounts);

module.exports = router;
