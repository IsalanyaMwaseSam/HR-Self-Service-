const prisma = require('../prismaClient'); 
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// const { generateOTP } = require('../utils/otpUtils'); 
const jwtSecretKey = process.env.JWT_SECRET_KEY; 

// Google authentication callback handler
exports.googleAuthCallback = async (req, res) => {
  const sessionToken = crypto.randomBytes(20).toString('hex');
  const token = jwt.sign({ email: req.user.email, sessionToken }, jwtSecretKey, { expiresIn: '1h' });
  if (token) {
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
  } else {
    res.redirect('/login');
  }
};

// Google authentication handler
exports.googleAuth = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// Google authentication strategy
exports.googleStrategyCallback = async (token, tokenSecret, profile, done) => {
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

    if (!email) {
      return done(new Error('No email found in Google profile'));
    }

    let user = await prisma.applicant.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.applicant.create({
        data: {
          email,
          password: process.env.GOOGLE_AUTH_PASSWORD,
          verified: true
        }
      });
    }

    const sessionToken = crypto.randomBytes(20).toString('hex');
    const jwtPayload = { email, sessionToken };
    const jwtToken = jwt.sign(jwtPayload, jwtSecretKey, { expiresIn: '1h' });

    await prisma.applicant.update({
      where: { email },
      data: { sessionToken }
    });

    return done(null, user, { token: jwtToken });
  } catch (error) {
    return done(error);
  }
};
