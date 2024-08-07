const smtpModel = require('../models/smtpModel'); 

// Controller function to save SMTP settings
exports.saveSMTPSettings = async (req, res) => {
  const { smtpServer, smtpServerPort, username, password } = req.body;

  const port = parseInt(smtpServerPort, 10);

  if (isNaN(port)) {
    return res.status(400).json({ error: 'Invalid SMTP server port. Must be a number.' });
  }

  try {
    const setup = await smtpModel.saveSMTPSettings(smtpServer, port, username, password);
    res.json(setup);
  } catch (error) {
    console.error('Error saving SMTP settings:', error.message);
    res.status(500).json({ error: 'Error saving SMTP settings' });
  }
};

// Controller function to get SMTP settings
exports.getSMTPSettings = async (req, res) => {
  try {
    const setup = await smtpModel.getSMTPSettings();
    res.json(setup);
  } catch (error) {
    console.error('Error fetching SMTP settings:', error.message);
    res.status(500).json({ error: 'Error fetching SMTP settings' });
  }
};

// Controller function to test SMTP settings
exports.testSMTPSettings = async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const info = await smtpModel.testSMTPSettings(to, subject, text);
    res.json({ message: 'Test email sent', info });
  } catch (error) {
    console.error('Error testing SMTP settings:', error.message);
    res.status(500).json({ error: 'Error testing SMTP settings' });
  }
};
