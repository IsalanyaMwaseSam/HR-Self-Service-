const Applicant = require('../models/loginModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateJWT, generateOTP, sendLoginOTPByEmail } = require('../utils/utils'); 
const prisma = require('../prismaClient');
const loginAttempts = new Map(); 

exports.login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    console.log(`Login attempt for email: ${email}`);
    const applicant = await Applicant.findByEmail(email);

    if (!applicant) {
      console.log('Invalid email');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (loginAttempts.has(email) && loginAttempts.get(email) >= 5) {
      console.log('Maximum login attempts exceeded');
      return res.status(403).json({ error: 'Maximum login attempts exceeded. Please reset your password.' });
    }

    const passwordMatch = await bcrypt.compare(password, applicant.password);

    if (!passwordMatch) {
      const attempts = loginAttempts.get(email) || 0;
      loginAttempts.set(email, attempts + 1);
      console.log(`Incorrect password. Attempt ${attempts + 1}`);

      if (loginAttempts.get(email) >= 5) {
        return res.status(403).json({ error: 'Maximum login attempts exceeded. Please reset your password.' });
      }

      return res.status(401).json({ error: 'Incorrect password or email' });
    }

    // Reset login attempts on successful password match
    loginAttempts.delete(email);

    // Check if OTP is required based on weekly policy
    const now = new Date();
    const lastOtpValidation = applicant.lastOtpValidation || new Date(0);
    const daysSinceLastOtp = Math.floor((now - lastOtpValidation) / (1000 * 60 * 60 * 24));

    if (daysSinceLastOtp <= 7) {
      console.log('OTP not required, generating JWT token');
      const sessionToken = crypto.randomBytes(20).toString('hex');

      const payload = {
        id: applicant.id,
        email: applicant.email,
        sessionToken,
      };

      console.log('Generating JWT with payload:', payload);
      const token = generateJWT(payload, { expiresIn: rememberMe ? '7d' : '1h' });
      console.log('Generated Token:', token);
      

      await Applicant.createSessionToken(email, sessionToken);

      return res.status(200).json({ token, message: 'Login successful' });
    }

    // Generate OTP for MFA
    const otp = generateOTP();
    console.log(`Generated OTP: ${otp} for email: ${email}`);

    await Applicant.updateOTP(email, otp, new Date(Date.now() + 10 * 60 * 1000)); // 10 minutes expiry
    await sendLoginOTPByEmail(email, otp);

    console.log(`OTP sent to email: ${email}`);
    return res.status(200).json({ message: 'OTP sent to your email' });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    console.log(`OTP verification attempt for email: ${email}, OTP: ${otp}`);
    const applicant = await Applicant.findByEmail(email);

    if (!applicant) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const validOtp = await prisma.applicant.findFirst({
      where: {
        email,
        loginOTP: otp,
        loginOTPExpiry: {
          gte: new Date(), // Check if OTP expiry is greater than or equal to current date
        },
      },
    });

    if (!validOtp) {
      console.log('Expired or invalid OTP');
      return res.status(404).json({ error: 'Expired or invalid OTP' });
    }

    // Clear OTP from database after successful verification
    const sessionToken = crypto.randomBytes(20).toString('hex');

    await Applicant.clearOTP(email);
    await Applicant.updateLastOtpValidation(email, new Date());

    const payload = {
      id: applicant.id,
      email: applicant.email,
      sessionToken,
    };

    const token = generateJWT(payload, { expiresIn: '1h' });

    console.log('OTP verified successfully');
    return res.status(200).json({ token, message: 'OTP verified successfully' });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
