const Experience = require('../models/experienceModel');

exports.updateExperienceInfo = async (req, res) => {
  const { experienceEntries } = req.body;

  if (!experienceEntries || !experienceEntries.length) {
    return res.status(400).json({ error: 'Experience entries are required' });
  }
  
  try {
    const applicant = await Experience.findApplicantById(req.user.id);

    if (!applicant) {
      return res.status(404).json({ error: 'User not found' });
    }

    for (const entry of experienceEntries) {
      const {
        employerName,
        workArea,
        country,
        functionalTitle,
        startDate,
        endDate,
        noOfEmployeesSupervised,
        descriptionOfDuties,
        majorAchievements,
        leavingReasons,
      } = entry;

      if (!employerName || !workArea || !country || !functionalTitle || !startDate || !endDate) {
        return res.status(400).json({ error: 'All fields are required for each experience entry.' });
      }

      const formattedStartDate = new Date(startDate);
      const formattedEndDate = new Date(endDate);

      if (isNaN(formattedStartDate) || isNaN(formattedEndDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const experienceInfo = {
        employerName,
        workArea,
        country,
        functionalTitle,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        noOfEmployeesSupervised,
        descriptionOfDuties,
        majorAchievements,
        leavingReasons,
      };

      await Experience.upsertExperienceInfo(applicant.id, experienceInfo);
    }

    res.status(200).json({ message: 'Your Experience information has been successfully updated' });
  } catch (error) {
    console.error('Error updating Experience information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getExperienceInfo = async (req, res) => {
  try {
    const experiences = await Experience.getExperiencesByApplicantId(req.user.id);
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching experience information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteExperience = async (req, res) => {
  const { employerName, startDate } = req.body;

  try {
    await Experience.deleteExperience(req.user.id, employerName, new Date(startDate));
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
