const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/illustration', imageController.getIllustration);
router.post('/illustration', imageController.updateIllustration);

module.exports = router;
