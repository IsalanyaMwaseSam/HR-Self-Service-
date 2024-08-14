const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');
const verifyToken = require('../middlweware/verifyToken'); 

// Route to add or update language
router.post('/language', verifyToken, languageController.addOrUpdateLanguage);
router.put('/language', verifyToken, languageController.addOrUpdateLanguage);
// Route to get languages
router.get('/language', verifyToken, languageController.getLanguages);
router.delete('/language/:languageName', verifyToken, languageController.deleteLanguage)

module.exports = router;
