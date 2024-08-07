const jwt = require('jsonwebtoken');
const { jwtSecretKey } = process.env;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); 
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const uploadFile = async (file) => {
  const filename = `${uuidv4()}${path.extname(file.originalname)}`;
  const uploadPath = path.join(__dirname, '..', 'uploads', filename);

  await new Promise((resolve, reject) => {
    fs.writeFile(uploadPath, file.buffer, (err) => {
      if (err) reject(err);
      resolve();
    });
  });

  return {
    url: `/uploads/${filename}`,
    fileName: file.originalname,
    fileType: file.mimetype,
  };
};


async function sendLoginOTPByEmail(email, otp) {
  
    const msg = {
      to: email,
      from: 's.isalanya@teslaitsolutions.co.ug',
      subject: 'Your Login OTP',
      html: `
        <p>Your OTP for login is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>
      `,
    };
  
    try {
      await sgMail.send(msg);
      console.log(`OTP sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send OTP to ${email}:`, error);
      throw new Error('Failed to send OTP');
    }
  }


// Function to generate JWT
const generateJWT = (payload, options) => {
    try {
        return jwt.sign(payload, jwtSecretKey, options);
    } catch (error) {
        console.error('Error generating JWT:', error);
        throw error;
    }
};

const validator = require('email-validator');
const deepEmailValidator = require('deep-email-validator');


// Validate email format
const isValidEmail = (email) => validator.validate(email);




console.log('JWT Secret Key:', jwtSecretKey); 
// Function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



module.exports = {
  generateJWT,
  generateOTP,
  isValidEmail,
  sendLoginOTPByEmail,
  uploadFile
};
