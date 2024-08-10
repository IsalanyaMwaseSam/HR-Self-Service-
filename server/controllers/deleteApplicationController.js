const { deleteApplication } = require('../models/deleteApplicationModel');

const deleteApplicationHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedApplication = await deleteApplication(id);
    res.json(deletedApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { deleteApplicationHandler };
