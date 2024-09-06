const {getProfileById} = require('../models/profileModel'); 

exports.getProfile = async (req, res) => {
  try {
    const { id, email } = req.user; // Extract id and email from the decoded token in middleware
    const profileData = await getProfileById(id, email); // Pass either id or email
    res.json(profileData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

exports.getProfileByIdForStaff = async (req, res) => {
  try {
    const applicantID = parseInt(req.params.id);  
    if (!applicantID) {
      return res.status(400).json({ message: "Applicant ID is required." });
    }

    // Fetch the applicant profile by their ID
    const profileData = await getProfileById(applicantID);

    if (!profileData) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json(profileData);
  } catch (error) {
    console.error("Error fetching applicant profile:", error);
    res.status(500).json({ message: "Error fetching applicant profile" });
  }
};

