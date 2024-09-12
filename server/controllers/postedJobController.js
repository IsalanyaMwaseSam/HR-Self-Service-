const JobModel = require('../models/postedJobModel');

// Controller to handle fetching posted jobs with evaluation criteria
exports.getPostedJobsWithCriteria = async (req, res) => {
  try {
    const jobs = await JobModel.getPostedJobsWithCriteria();
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching posted jobs with criteria:', error);
    res.status(500).json({ error: 'Failed to fetch posted jobs with criteria' });
  }
};

exports.createPostedJob = async (req, res) => {
  try {
    console.log('Received request to create job with data:', req.body);
    const jobData = req.body;

    const savedJob = await JobModel.saveJobWithCriteria(jobData); // Save job and criteria to DB

    console.log('Job created successfully, returning response...');
    res.status(201).json(savedJob); // Return the saved job
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job.' });
  }
};

