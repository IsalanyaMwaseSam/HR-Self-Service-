const express = require('express');
const router = express.Router();
const passport = require('passport');
const googleController = require('../controllers/googleController'); 


// Route to initiate Google OAuth
router.get('/auth/google', googleController.googleAuth);

// Route to handle Google OAuth callback
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleController.googleAuthCallback
);

module.exports = router;
