const Image = require('../models/imageModel');

exports.getIllustration = (req, res) => {
  const illustrationURL = Image.getillustrationURL();
  res.json({ illustrationURL });
};

exports.updateIllustration = (req, res) => {
  const { newIllustrationURL } = req.body;

  if (newIllustrationURL) {
    Logo.setIllustrationURL(newIllustrationURL);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid URL' });
  }
};