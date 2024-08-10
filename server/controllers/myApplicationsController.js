const { createApplication, fetchApplicationsByEmail, updateApplicationStatus } = require('../models/myApplicationsModel');

const createApplicationHandler = async (req, res) => {
  const data = req.body;
  try {
    const application = await createApplication(data);
    res.status(201).json({ message: 'Application successfully made' });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: error.message });
  }
};

const getApplicationsHandler = async(req, res) => {
    const userEmail = req.user?.email;
  
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is missing' });
    }
  
    try {
      const applications = await fetchApplicationsByEmail(userEmail);
      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications:', error.message);
      res.status(500).json({ error: `Error fetching applications: ${error.message}` });
    }
  }
  

const updateApplicationStatusHandler = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedApplication = await updateApplicationStatus(id, status);
    res.status(200).json({ message: 'Successfully updated your application' });
  } catch (error) {
    console.error('Error updating application status:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createApplicationHandler, getApplicationsHandler, updateApplicationStatusHandler };
