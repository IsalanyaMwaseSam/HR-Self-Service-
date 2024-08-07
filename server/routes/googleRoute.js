const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/googleController'); 

// Route to initiate Google OAuth
router.get('/auth/google', authController.googleAuth);

// Route to handle Google OAuth callback
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleAuthCallback
);

module.exports = router;
