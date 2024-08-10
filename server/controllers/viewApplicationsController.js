const { fetchApplicationById } = require('../models/viewApplicationsModel');

// Controller to get a specific application by ID
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params; 
    const applicantID = req.user.id; 

    const application = await fetchApplicationById(parseInt(id), applicantID);
    
    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getApplicationById }


