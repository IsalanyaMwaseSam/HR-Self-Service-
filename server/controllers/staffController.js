const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const prisma = require('../prismaClient');
const Staff = require('../models/staffModel')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.createStaff = async (req, res) => {
  const { email } = req.body;

  try {
    console.log('The creation of staff process has started');
    
    const existingStaff = await Staff.findByEmail(email);
    if (existingStaff) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

    const staffProfile = await prisma.profile.findUnique({ where: { name: 'Staff' } });
    if (!staffProfile) {
      return res.status(404).json({ error: 'Staff profile not found.' });
    }

    // Create the staff member with the verification token
    const newStaff = await Staff.createStaff(email, staffProfile.id, verificationToken, verificationTokenExpiry);

    // Send verification email with the link
    const verificationLink = `${process.env.FRONTEND_URL}/set-password/${verificationToken}`;
    const msg = {
      from: 's.isalanya@teslaitsolutions.co.ug',
      to: email,
      subject: 'Staff Account Verification',
      html: `
        <p>You have been registered as a staff member on the Staff Portal. Please use the following link to set up your password:</p>
        <p><a href="${verificationLink}">Set your password</a></p>
      `,
    };

    await sgMail.send(msg);
    console.log(`Verification email sent to ${email}`);

    res.status(201).json({ message: 'Staff user created and verification email sent.', staff: newStaff });
  } catch (error) {
    console.error('Staff creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
