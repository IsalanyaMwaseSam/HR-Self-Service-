const Staff = require('../models/staffModel')
const bcrypt = require('bcrypt');

exports.setPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      const staff = await Staff.findByVerificationToken(token);
  
      if (!staff) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update staff's password, mark them as verified, and clear the token
      await Staff.updateStaff(staff.id, {
        password: hashedPassword,
        verified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      });
  
      res.status(200).json({ message: 'Password set successfully. You can now log in.' });
    } catch (error) {
      console.error('Set password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  