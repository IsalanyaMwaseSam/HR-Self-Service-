const { getApplicantData, calculateScore } = require('../models/scoreSystemModel');

// Controller function to evaluate an applicant
const evaluateApplicant = async (req, res) => {
  const { applicantId, jobRoleId } = req.params;

  try {
    // Fetch applicant data
    const applicantData = await getApplicantData(applicantId);
    if (!applicantData) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    // Calculate score
    const score = await calculateScore(applicantData, jobRoleId);

    // Return the score in the response
    res.status(200).json({ score });
  } catch (error) {
    console.error('Error evaluating applicant:', error);
    res.status(500).json({ error: 'Failed to calculate score' });
  }
};

module.exports = {
  evaluateApplicant
};
