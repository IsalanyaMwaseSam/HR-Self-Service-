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

    const applicant = await Education.findApplicantById(req.user.id);

    if (!applicant) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Upsert each education entry
    for (const educationEntry of educationEntries) {
      const formattedStartDate = new Date(educationEntry.startDate);
      const formattedEndDate = new Date(educationEntry.endDate);

      if (isNaN(formattedStartDate) || isNaN(formattedEndDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const educationInfo = {
        ...educationEntry,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      await Education.upsertEducationEntry(applicant.id, educationInfo);
    }

    // Upsert each certificate entry
    for (const certificateEntry of certificateEntries) {
      const yearOfIssue = parseInt(certificateEntry.yearOfIssue, 10);

      const certificateInfo = {
        ...certificateEntry,
        yearOfIssue,
      };

      await Education.upsertCertificateEntry(applicant.id, certificateInfo);
    }

    res.status(200).json({ message: 'Your Education information has been successfully updated' });
  } catch (error) {
    console.error('Error updating Education information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getEducationInfo = async (req, res) => {
  try {
    const educations = await Education.getEducationsByApplicantId(req.user.id);
    const certificates = await Education.getCertificatesByApplicantId(req.user.id);
    
    res.status(200).json({ educations, certificates });
  } catch (error) {
    console.error('Error fetching education information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
