const { createApplication } = require('../models/applicationModel');
const { uploadFile } = require('../utils/utils');
const { getJobDetails } = require('../models/jobModel');

const handleFileUpload = async (files) => {
  if (!files) return [];
  const filePromises = files.map(file => uploadFile(file));
  const fileData = await Promise.all(filePromises);
  return fileData;
};

const submitApplication = async (req, res) => {
  try {
    const { vacancyCode, selectedValue, department, vacancyDeadline, vacancyStatus, firstName, middleName, lastName, location, availability, gender, alternativeEmail } = req.body;
    const { coverLetterFiles, resumeFiles, otherFiles } = req.files;

    const coverLetterData = await handleFileUpload(coverLetterFiles || []);
    const resumeData = await handleFileUpload(resumeFiles || []);
    const otherData = await handleFileUpload(otherFiles || []);


    const applicationData = {
      vacancyCode,
      selectedValue,
      department,
      vacancyDeadline,
      vacancyStatus,
      applicantFirstName: firstName,
      applicantMiddleName: middleName,
      applicantLastName: lastName,
      applicantLocation: location,
      applicantAvailability: availability, 
      applicantGender: gender,
      applicantAlternativeEmail: alternativeEmail,
      coverLetterFiles: coverLetterData,
      resumeFiles: resumeData,
      otherFiles: otherData,
      applicantID: req.user.id,
    };

    await createApplication(applicationData);
    res.status(201).json({ message: 'Application submitted successfully' });
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);
    console.log('Vacancy Deadline:', vacancyDeadline);
    console.log('Vacancy Status:', vacancyStatus);
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

module.exports = { submitApplication };
