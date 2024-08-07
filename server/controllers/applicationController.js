const { createApplication } = require('../models/applicationModel');
const { uploadFile } = require('../utils/utils');

const handleFileUpload = async (files) => {
  if (!files) return [];
  const filePromises = files.map(file => uploadFile(file));
  const fileData = await Promise.all(filePromises);
  return fileData;
};

const submitApplication = async (req, res) => {
  try {
    const { vacancyCode, selectedValue } = req.body;
    const { coverLetterFiles, resumeFiles, otherFiles } = req.files;

    const coverLetterData = await handleFileUpload(coverLetterFiles || []);
    const resumeData = await handleFileUpload(resumeFiles || []);
    const otherData = await handleFileUpload(otherFiles || []);

    const applicationData = {
      vacancyCode,
      selectedValue,
      coverLetterFiles: coverLetterData,
      resumeFiles: resumeData,
      otherFiles: otherData,
      applicantID: req.user.id,
    };

    await createApplication(applicationData);
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

module.exports = { submitApplication };
