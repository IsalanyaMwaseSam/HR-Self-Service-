const profileModel = require('../models/profileModel'); 

exports.getProfile = async (req, res) => {
  try {
    const applicant = await profileModel.getProfileById(req.user.id);
    if (!applicant) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(applicant);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
