const Logo = require('../models/logoModel');

exports.getLogo = (req, res) => {
  const logoURL = Logo.getLogoURL();
  res.json({ logoURL });
};

exports.updateLogo = (req, res) => {
  const { newLogoURL } = req.body;

  if (newLogoURL) {
    Logo.setLogoURL(newLogoURL);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid URL' });
  }
};
