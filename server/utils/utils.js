const jwt = require('jsonwebtoken');
const { jwtSecretKey } = process.env;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../prismaClient');
const crypto = require('crypto');


// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFile = async (file) => {
  // Use the original filename directly
  const filename = file.originalname;
  
  // Define the path to save the file
  const uploadPath = path.join(__dirname, '..', 'uploads', filename);

  // Write the file buffer to the specified path
  await new Promise((resolve, reject) => {
    fs.writeFile(uploadPath, file.buffer, (err) => {
      if (err) return reject(err); // Reject on error
      resolve(); // Resolve on success
    });
  });

  // Return metadata including the URL for access
  return {
    url: `/uploads/${filename}`,  // The URL where the file can be accessed
    fileName: file.originalname,  // Original filename
    fileType: file.mimetype,      // MIME type of the file
    fileSize: file.size
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

// Middleware or route after user login
const checkPasswordChange = async (req, res, next) => {
  if (!req.user || !req.user.email) {
    return res.status(400).json({ error: 'User not authenticated' });
  }
  const { email } = req.user;
  
  console.log("The email is:", email)
  const user = await prisma.applicant.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.mustChangePassword) {
    // If the user must change their password, generate a new JWT
    const sessionToken = crypto.randomBytes(20).toString('hex');
    const jwtPayload = { email, sessionToken };
    const jwtToken = generateJWT(jwtPayload, { expiresIn: '1h' });

    // Redirect to password change page
    return res.redirect(`/api/reset-password?token=${jwtToken}`);
  }

  // Continue to the next middleware if no password change is needed
  next();
};




module.exports = {
  generateJWT,
  generateOTP,
  isValidEmail,
  sendLoginOTPByEmail,
  upload,
  uploadFile,
  checkPasswordChange
};
