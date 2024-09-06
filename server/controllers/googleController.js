const prisma = require('../prismaClient'); 
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { generateJWT } = require('../utils/utils'); 

// Use environment variables for configuration
const backendPort = process.env.PORT || 5000;
const backendUrl = `http://localhost:${backendPort}/api`;
const frontendPort = process.env.Frontend_Port || 3000;
const frontendUrl = `http://localhost:${frontendPort}`;

// Initialize Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${backendUrl}/auth/google/callback`
}, async (token, tokenSecret, profile, done) => {
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

    if (!email) {
      return done(new Error('No email found in Google profile'));
    }

    // Find or create the user in the database
    let user = await prisma.applicant.findUnique({ where: { email } });
    console.log('Retrieved User:', user);
    

    if (!user) {
      // Create a new user if not found
      user = await prisma.applicant.create({
        data: {
          email,
          password: process.env.google_auth_password, 
          verified: true,
          mustChangePassword: true // User must change password on first login
        }
      });
    }

    // Generate a session token and JWT
    const sessionToken = crypto.randomBytes(20).toString('hex');
    const jwtPayload = { email, sessionToken };
    const jwtToken = generateJWT(jwtPayload, { expiresIn: '1h' });
    console.log('Generated JWT Token for existing user:', jwtToken);

    

    // Update sessionToken in the database
    await prisma.applicant.update({
      where: { email },
      data: { sessionToken }
    });
    

    return done(null, user, { token: jwtToken });
    
  } catch (error) {
    return done(error);
  }
}));

// Google authentication callback handler
exports.googleAuthCallback = async (req, res) => {
  try {
    const { email, mustChangePassword } = req.user;

    const sessionToken = crypto.randomBytes(20).toString('hex');
    const jwtPayload = { email, sessionToken };
    const jwtToken = generateJWT(jwtPayload, { expiresIn: '1h' });

    // Update sessionToken in the database
    await prisma.applicant.update({
      where: { email },
      data: { sessionToken }
    });

    // Redirect to reset-password page if user must change password
    if (mustChangePassword) {
      return res.redirect(`${frontendUrl}/reset-password?token=${jwtToken}`);
    }

    // If no password change is required, redirect to dashboard
    return res.redirect(`${frontendUrl}?token=${jwtToken}`);
  } catch (error) {
    console.error('Error in Google Auth Callback:', error);
    return res.redirect('/login');
  }
};


// Google authentication handler
exports.googleAuth = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};
