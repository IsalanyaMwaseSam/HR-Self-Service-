const User = require('../models/userModel');

exports.getUserData = async (req, res) => {
  const { email } = req.user;

  if (!email) {
    return res.status(400).json({ error: 'Email is not provided' });
  }

  try {
    const userData = await User.findByEmail(email);

    if (!userData) {
      return res.status(404).json({ error: 'User data not found' });
    }

    res.status(200).json({ userData });
    console.log(userData);
  } catch (error) {
    console.error('Fetch user data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
