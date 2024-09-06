const { fetchApplicationsByJobRole, fetchApplicationsByJobRoleAndLonglisted } = require('../models/staffApplicationsModel');


const getApplicationsByJobRoleHandler = async (req, res) => {
  const { jobRoleId, status } = req.query;

  if (!jobRoleId) {
    return res.status(400).json({ error: 'Job role ID is required' });
  }

  try {
    const applications = await fetchApplicationsByJobRole(jobRoleId, status);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications by job role:', error.message);
    res.status(500).json({ error: `Error fetching applications: ${error.message}` });
  }
};


const getApplicationsByJobRoleHandlerAndLonglisted = async (req, res) => {
  const { jobRoleId } = req.query; 

  if (!jobRoleId) {
    return res.status(400).json({ error: 'Job role ID is required' });
  }

  try {
    const applications = await fetchApplicationsByJobRoleAndLonglisted(jobRoleId);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications by job role:', error.message);
    res.status(500).json({ error: `Error fetching applications: ${error.message}` });
  }
};

const checkLonglistStatus = async (req, res) => {
  const { jobRoleId } = req.query;

  try {
    // Check if any applications for the job role are longlisted (applicationStatus = 'Longlisted')
    const longlistedApplications = await fetchApplicationsByJobRoleAndLonglisted(jobRoleId);

    // Return true if any longlisted applications exist, false otherwise
    if (longlistedApplications.length > 0) {
      return res.status(200).json({ isLonglisted: true });
    } else {
      return res.status(200).json({ isLonglisted: false });
    }
  } catch (error) {
    console.error('Error checking longlist status:', error);
    res.status(500).json({ message: 'Failed to check longlist status' });
  }
};

module.exports = { getApplicationsByJobRoleHandler, getApplicationsByJobRoleHandlerAndLonglisted, checkLonglistStatus };
