const express = require('express');
const router = express.Router();
const logoController = require('../controllers/logoController');

router.get('/logo', logoController.getLogo);
router.post('/logo', logoController.updateLogo);

module.exports = router;
