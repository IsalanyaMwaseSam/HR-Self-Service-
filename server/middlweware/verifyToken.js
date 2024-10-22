const jwt = require('jsonwebtoken');
const { jwtSecretKey } = process.env;

module.exports = (req, res, next) => {
  // Log request headers for debugging
  console.log('Request Headers:', req.headers);

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Your session has expired. Please log back in.' });
      }
      console.error('Failed to authenticate token:', err.message);
      return res.status(500).send('Failed to authenticate token.');
    }

    console.log('Decoded Token:', decoded); // Log the decoded token for debugging
    req.user = decoded;
    console.log('Middleware User:', req.user); // Check if this is set correctly
    next();
  });
};
