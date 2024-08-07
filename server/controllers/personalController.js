const Personal = require('../models/personalModel');

exports.updatePersonalInfo = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      dob,
      nationality,
      gender: rawGender,
      street,
      houseNumber,
      town,
      city,
      postalCode,
      country,
      phoneNumber,
      alternativePhoneNumber,
      email,
      alternativeEmail,
      availability
    } = req.body;

    const validGenders = ['Male', 'Female'];
    const gender = rawGender ? rawGender : '';

    if (!validGenders.includes(gender)) {
      return res.status(400).json({ error: 'Invalid gender value' });
    }

    const availabilityAsInt = parseInt(availability, 10);

    const applicant = await Personal.findApplicantByEmail(email);

    if (!applicant) {
      return res.status(404).json({ error: 'User not found' });
    }

    const personalInfo = {
      firstName,
      middleName,
      lastName,
      dob: new Date(dob),
      nationality,
      gender,
      street,
      houseNumber,
      town,
      city,
      postalCode,
      country,
      phoneNumber,
      alternativePhoneNumber,
      alternativeEmail,
      availability: availabilityAsInt
    };

    await Personal.upsertPersonalInfo(applicant.id, personalInfo);

    res.status(200).json({ message: 'Your personal information has been successfully updated' });
  } catch (error) {
    console.error('Error updating personal information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
