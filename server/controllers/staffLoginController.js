const Staff = require('../models/staffLoginModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const prisma = require('../prismaClient');
const { generateJWT } = require('../utils/utils'); 
const loginAttempts = new Map(); 

exports.stafflogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt for email: ${email}`);
    const applicant = await Staff.findByEmail(email);

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

    const sessionToken = crypto.randomBytes(20).toString('hex');

    const payload = {
      id: applicant.id,
      email: applicant.email,
      sessionToken,
    };

    console.log('Generating JWT with payload:', payload);
    const token = generateJWT(payload, { expiresIn: '1h' });
    console.log('Generated Token:', token);

    await Staff.createSessionToken(email, sessionToken);

      return res.status(200).json({ token, message: 'Login successful' });
    }

   catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




