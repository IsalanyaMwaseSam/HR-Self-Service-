const { getJobDetails } = require('../models/jobModel');

const fetchJobDetails = async (req, res) => {
  const { vacancyCode } = req.params;
  const authHeaders = {
    'Authorization': 'Basic ' + Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64')
  };

  console.log('Vacancy Code:', vacancyCode);
  console.log('Auth Headers:', authHeaders);

  try {
    const jobDetail = await getJobDetails(vacancyCode, authHeaders);
    res.json(jobDetail);
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  fetchJobDetails
};
