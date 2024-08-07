const prisma = require('../prismaClient'); 
const nodemailer = require('nodemailer');

// Function to create or update SMTP settings
async function saveSMTPSettings(smtpServer, smtpServerPort, username, password) {
  try {
    return await prisma.SMTP_Setup.create({
      data: { smtpServer, smtpServerPort, username, password },
    });
  } catch (error) {
    throw new Error(`Error saving SMTP settings: ${error.message}`);
  }
}

// Function to get the latest SMTP settings
async function getSMTPSettings() {
  try {
    return await prisma.SMTP_Setup.findFirst({
      orderBy: { id: 'desc' },
    });
  } catch (error) {
    throw new Error(`Error fetching SMTP settings: ${error.message}`);
  }
}

// Function to test SMTP settings by sending a test email
async function testSMTPSettings(to, subject, text) {
  try {
    const setup = await getSMTPSettings();
    if (!setup) throw new Error('SMTP settings not found');

    const transporter = nodemailer.createTransport({
      host: setup.smtpServer,
      port: setup.smtpServerPort,
      secure: false,
      auth: {
        user: setup.username,
        pass: setup.password,
      },
    });

    const mailOptions = {
      from: setup.username,
      to,
      subject,
      text,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(new Error(`Error sending test email: ${error.message}`));
        } else {
          resolve(info);
        }
      });
    });
  } catch (error) {
    throw new Error(`Error testing SMTP settings: ${error.message}`);
  }
}

module.exports = {
  saveSMTPSettings,
  getSMTPSettings,
  testSMTPSettings,
};
