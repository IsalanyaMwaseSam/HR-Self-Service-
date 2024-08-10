const { updateApplication } = require('../models/updateApplicationModel');

const updateApplicationHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedApplication = await updateApplication(id, req.body);
    res.json(updatedApplication);
    console.log('the body:', updatedApplication)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { updateApplicationHandler };