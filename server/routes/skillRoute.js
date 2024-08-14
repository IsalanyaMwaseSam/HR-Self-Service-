const express = require('express');
const skillController = require('../controllers/skillController');
const verifyToken = require('../middlweware/verifyToken');

const router = express.Router();

router.post('/skills', verifyToken, skillController.addOrUpdateSkill);
router.put('/skills/:id', verifyToken, skillController.addOrUpdateSkill);
router.get('/skills', verifyToken, skillController.getSkills);
router.delete('/skills', verifyToken, skillController.deleteSkill)

module.exports = router;
