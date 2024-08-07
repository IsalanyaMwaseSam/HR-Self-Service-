const applicantModel = require('../models/userdataModel'); 

// Controller function to fetch user data
exports.getUserData = async (req, res) => {
  try {
    const email = req.user.email; 

    if (!email) {
      throw new Error('Email is undefined');
    }

    const userData = await applicantModel.getUserByEmail(email);

    if (!userData) {
      return res.status(404).json({ error: 'User data not found' });
    }

    res.status(200).json({ userData });
  } catch (error) {
    console.error('Fetch user data error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
