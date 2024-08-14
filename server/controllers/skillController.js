const skillModel = require('../models/skillModel'); 

exports.addOrUpdateSkill = async (req, res) => {
  try {
    const { skillDescription, yearsOfExperience } = req.body;
    const yearsAsInt = parseInt(yearsOfExperience, 10);
    console.log("Years of experience",yearsOfExperience)

    // Check if yearsOfExperience is a valid integer
    if (isNaN(yearsAsInt)) {
      return res.status(400).json({ error: `Invalid years of experience value: ${yearsOfExperience}` });
    }

    // Use the skill model to upsert skill data
    await skillModel.upsertSkill(req.user.id, {
      skillDescription,
      yearsOfExperience,
    });

    res.status(200).json({ message: 'Your Skills information has been successfully updated' });

  } catch (error) {
    console.error('Error updating Skills information:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

exports.getSkills = async (req, res) => {
  try {
    const skills = await skillModel.getSkillsByApplicantID(req.user.id);
    res.status(200).json(skills);
  } catch (error) {
    console.error('Error fetching skills information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteSkill = async (req, res) => {
  try {
    const { skillDescription } = req.body;  
    const applicantID = req.user.id;  

    await skillModel.deleteSkill(applicantID, skillDescription);  

    res.status(200).json({ message: 'Skill entry successfully deleted' });
  } catch (error) {
    console.error('Error deleting skill information:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};







