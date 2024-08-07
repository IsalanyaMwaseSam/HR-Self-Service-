const Applicant = require('../models/authModel');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const { isValidEmail } = require('../utils/utils');
const { error } = require('console');
const frontendPort = process.env.Frontend_Port || 3000;
const frontendUrl = `http://localhost:${frontendPort}`;

sgMail.setApiKey(process.env.SENDGRID_API_KEY); 

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const existingApplicant = await Applicant.findByEmail(email);

    if (existingApplicant) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    const newApplicant = await Applicant.createApplicant(email, password, token, tokenExpiry);

    const msg = {
      from: 's.isalanya@teslaitsolutions.co.ug',
      to: email,
      subject: 'Account Verification',
      html: `
        <p>Thank you for registering on the HR Self Service Portal. Please click the following link to verify your account:</p>
        <p><a href="${frontendUrl}/verify/${encodeURIComponent(token)}">Verify Account</a></p>
      `
    };

    await sgMail.send(msg);
    res.status(201).json({ message: 'User registered successfully. Please check your email and click on the link to verify your account before you can log in.', applicant: newApplicant });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.verifyToken = async (req, res) => {
  const { token } = req.params;

  try {
    const applicant = await Applicant.findByToken(token);

    if (!applicant) {
      return res.status(404).json({ message: 'Invalid verification token', error });
    }

    console.log('applicant:', applicant)

    const currentTime = new Date();
    const tokenExpiryTime = new Date(applicant.tokenExpiry);

    if (currentTime > tokenExpiryTime) {
      await Applicant.deleteApplicantByEmail(applicant.email);
      return res.status(410).json({ message: 'Verification token has expired. Please register again.' });
    }

    if (applicant.verified) {
      return res.status(200).json({ message: 'Already verified. Please log in.' });
    }

    await Applicant.updateApplicant(applicant.id, {
      verified: true,
      verificationToken: null,
      tokenExpiry: null
    });

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
