const express = require('express');
const router = express.Router();
// const { verifyToken } = require('../middlweware/verifyToken');
const { addToLonglist, getLonglistedCandidates } = require('../controllers/longlistController'); 

// Route to add applications to the longlist
router.post('/longlist', addToLonglist);

router.get('/longlist', getLonglistedCandidates)



module.exports = router;
