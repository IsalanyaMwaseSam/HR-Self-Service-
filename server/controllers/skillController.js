const skillModel = require('../models/skillModel'); 

exports.addOrUpdateSkill = async (req, res) => {
    try {
      const { skillDescription, yearsOfExperience } = req.body;
  
      const availabilityAsInt = parseInt(yearsOfExperience, 10);
  
      // Check if yearsOfExperience is a valid integer
      if (isNaN(availabilityAsInt)) {
        return res.status(400).json({ error: 'Invalid years of experience value' });
      }
  
      // Use the skill model to upsert skill data
      await skillModel.upsertSkill(req.user.id, {
        skillDescription,
        yearsOfExperience: availabilityAsInt,
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
