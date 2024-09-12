const { createApplication } = require('../models/applicationModel');
const { uploadFile } = require('../utils/utils');
const { getJobDetails } = require('../models/jobModel');
const { getApplicantData, calculateScore } = require('../models/scoreSystemModel');

const handleFileUpload = async (files) => {
  if (!files) return [];
  const filePromises = files.map(file => uploadFile(file));
  const fileData = await Promise.all(filePromises);
  console.log('Uploaded File Data:', fileData);
  return fileData;
};

const submitApplication = async (req, res) => {
  try {
    const { vacancyCode, selectedValue, department, vacancyDeadline, vacancyStatus, firstName, middleName, lastName, location, availability, gender, alternativeEmail } = req.body;
    const { coverLetterFiles, resumeFiles, otherFiles } = req.files;

    const coverLetterData = coverLetterFiles ? await handleFileUpload(coverLetterFiles) : [];
    const resumeData = resumeFiles ? await handleFileUpload(resumeFiles) : [];
    const otherData = otherFiles ? await handleFileUpload(otherFiles) : [];

    const applicantId = req.user.id;
    const jobRoleId = vacancyCode; 

    console.log("The job role id is:", jobRoleId);

    const applicantData = await getApplicantData(applicantId);
    if (!applicantData) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    const scoreBreakdown = await calculateScore(applicantData, jobRoleId);

    console.log("Application Score Breakdown for applicant:", applicantId, scoreBreakdown);

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
      applicantID: applicantId,
      applicationScore: scoreBreakdown.total, // Store the calculated total score
      scoreBreakdown, // Optionally store the breakdown if you want to persist it
    };

    await createApplication(applicationData);
    res.status(201).json({ message: 'Application submitted successfully' });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};


module.exports = { submitApplication };
