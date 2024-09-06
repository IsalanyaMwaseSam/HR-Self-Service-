const express = require('express');
const router = express.Router();
const verifyToken = require('../middlweware/verifyToken');
const { saveEvaluationCriteriaAndCreateJob, getAllEvaluationCriteriaHandler } = require('../controllers/saveEvaluationCriteriaController');

// Route to save or update evaluation criteria and create a job
router.post('/save-evaluation-criteria', verifyToken, saveEvaluationCriteriaAndCreateJob);

// Route to get all saved evaluation criteria
router.get('/get-all-evaluation-criteria', verifyToken, getAllEvaluationCriteriaHandler);

module.exports = router;

