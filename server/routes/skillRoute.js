const express = require('express');
const skillController = require('../controllers/skillController');
const verifyToken = require('../middlweware/verifyToken');

const router = express.Router();

router.post('/skills', verifyToken, skillController.addOrUpdateSkill);
router.get('/skills', verifyToken, skillController.getSkills);

module.exports = router;
