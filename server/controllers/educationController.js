const Education = require('../models/educationModel');

exports.updateEducationInfo = async (req, res) => {
  try {
    const { educationEntries, certificateEntries } = req.body;

    if (!educationEntries || !educationEntries.length) {
      return res.status(400).json({ error: 'Education entries are required' });
    }

    if (!certificateEntries || !certificateEntries.length) {
      return res.status(400).json({ error: 'Certificate entries are required' });
    }

    const {
      institution,
      degree,
      country,
      title,
      startDate,
      endDate,
      level,
      subject,
    } = educationEntries[0];

    const {
      certificateName,
      issuingInstitution,
      registrationNumber,
      yearOfIssue,
    } = certificateEntries[0];

    const availabilityAsInt = parseInt(yearOfIssue, 10);

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    if (isNaN(formattedStartDate) || isNaN(formattedEndDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const applicant = await Education.findApplicantById(req.user.id);

    if (!applicant) {
      return res.status(404).json({ error: 'User not found' });
    }

    const educationInfo = {
      institution,
      degree,
      country,
      title,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      level,
      subject,
      certificateName,
      issuingInstitution,
      registrationNumber,
      yearOfIssue: availabilityAsInt,
    };

    await Education.upsertEducationInfo(applicant.id, educationInfo);

    res.status(200).json({ message: 'Your Education information has been successfully updated' });
  } catch (error) {
    console.error('Error updating Education information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getEducationInfo = async (req, res) => {
    try {
      const educations = await Education.getEducationsByApplicantId(req.user.id);
      res.status(200).json(educations);
    } catch (error) {
      console.error('Error fetching education information:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
