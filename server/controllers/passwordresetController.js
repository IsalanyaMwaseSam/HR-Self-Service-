const bcrypt = require('bcrypt');
const Applicant = require('../models/passwordresetModel');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = generateOTP();

    await Applicant.updateOTP(email, otp, new Date(Date.now() + 10 * 60 * 1000));

    await sendOTPByEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ error: 'Failed to request OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const applicant = await Applicant.findByEmail(email);

    if (!applicant) {
      return res.status(404).json({ error: 'User Not Found' });
    }

    const validOTP = await Applicant.findValidOTP(email, otp);

    if (!validOTP) {
      return res.status(404).json({ error: 'Expired or invalid OTP' });
    }

    await Applicant.clearOTP(email);

    res.status(200).json({ message: 'OTP verified successfully', email });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!req.user || !req.user.email) {
    return res.status(400).json({ error: 'User not authenticated or email missing' });
  }

  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required' });
  }

  try {
    await prisma.applicant.update({
      where: { email: req.user.email },
      data: { email: email, password: newPassword, mustChangePassword: false },
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

function generateOTP() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function sendOTPByEmail(email, otp) {
  const msg = {
    to: email,
    from: 's.isalanya@teslaitsolutions.co.ug',
    subject: 'Your One-Time Password (OTP)',
    text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
    html: `<p>Your OTP for password reset is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
  };

  await sgMail.send(msg);
}
