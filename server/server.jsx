const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport'); 
const jobRoutes = require('./routes/jobRoute');
const logoRoutes = require('./routes/logoRoute');
const illustrationRoutes = require('./routes/imageRoute');
const authRoutes =  require('./routes/authRoute')
const loginRoutes = require('./routes/loginRoute')
const userRoutes = require('./routes/userRoute');
const passwordresetRoutes = require('./routes/passwordresetRoute');
const personalRoutes = require('./routes/personalRoute')
const educationRoutes = require('./routes/educationRoute')
const experienceRoutes = require('./routes/experienceRoute')
const languageRoutes = require('./routes/languageRoute')
const skillRoutes = require('./routes/skillRoute')
const attachmentRoutes = require('./routes/attachmentRoute')
const profileRoutes = require('./routes/profileRoute')
const vacancyRoutes = require('./routes/vacancyRoute')
const userdataRoutes = require('./routes/userdataRoute')
const smtpRoutes = require('./routes/smtpRoute')
const googleRoute = require('./routes/googleRoute')
const applicationRoutes = require('./routes/applicationRoute')
const myApplicationRoutes = require('./routes/myApplicationRoute')
const updateApplicationRoutes = require('./routes/updateApplicationRoute')
const app = express();
const path = require('path'); 


app.use(cors());

app.use('/api',  bodyParser.json(), logoRoutes)

app.use('/api',  bodyParser.json(), illustrationRoutes)

app.use('/api',  bodyParser.json(), authRoutes)

app.use('/api',  bodyParser.json(), loginRoutes)

app.use('/api',  bodyParser.json(), userRoutes)

app.use('/api',  bodyParser.json(), passwordresetRoutes)

app.use('/api',  bodyParser.json(), personalRoutes)

app.use('/api',  bodyParser.json(), educationRoutes)

app.use('/api',  bodyParser.json(), experienceRoutes)

app.use('/api',  bodyParser.json(), languageRoutes)

app.use('/api',  bodyParser.json(), skillRoutes)

app.use('/api',  bodyParser.json(), attachmentRoutes)

app.use('/api',  bodyParser.json(), profileRoutes)

app.use('/api',  bodyParser.json(), vacancyRoutes)

app.use('/api',  bodyParser.json(), userdataRoutes)

app.use('/api',  bodyParser.json(), smtpRoutes)

app.use('/api',  bodyParser.json(), googleRoute)

app.use('/api',  bodyParser.json(), jobRoutes);

app.use('/api', applicationRoutes);

app.use('/api', myApplicationRoutes);

app.use('/api', updateApplicationRoutes);

// Configure session
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


app.get('/success', (req, res) => res.send(userProfile));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID,
//   clientSecret: process.env.FACEBOOK_APP_SECRET,
//   callbackURL: `${backendUrl}/auth/facebook/callback`
// }, (token, tokenSecret, profile, done) => {
//   return done(null, profile);
// }));

// // Route to initiate Facebook OAuth
// app.get('/auth/facebook',
//   passport.authenticate('facebook')
// );

// // Route to handle Facebook OAuth callback
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   (req, res) => {
//     // Successful authentication, redirect to frontend dashboard
//     res.redirect(`${frontendUrl}`);
//   }
// );


// // Configure Twitter authentication strategy
// passport.use(new Strategy({
//   authorizationURL: "https://twitter.com/i/oauth2/authorize?code_challenge=challenge&code_challenge_method=plain",
//   clientID: process.env.X_CLIENT_ID,
//   clientSecret: process.env.X_CLIENT_SECRET,
//   callbackURL: 'http://192.168.83.23:5000/auth/twitter/callback',
//   state: "state",
//   code_challenge: "challenge",
//   code_challenge_method: "plain",
//   scope: ['tweet.read'] 
// }, (accessToken, refreshToken, profile, done) => {
//   console.log('Twitter OAuth Callback - Access Token:', accessToken);
//   console.log('Twitter OAuth Callback - Refresh Token:', refreshToken);
//   console.log('Twitter OAuth Callback - Profile:', profile);
  

//   return done(null, profile);
// }));

// app.get('/auth/twitter',
//   passport.authenticate('twitter', {
//     scope: ['tweet.read'] 
//   })
// );

// app.get('/auth/twitter/callback', (req, res, next) => {
//   passport.authenticate('twitter', (err, user, info) => {
//     console.log('OAuth Callback Request Query:', req.query);
//     console.log('OAuth Callback Request User:', user);
//     console.log('OAuth Callback Request Auth Info:', info);

//     if (err) {
//       console.error('Authentication error:', err);
//       return res.redirect('http://localhost:3000/login');
//     }

//     if (!user) {
//       console.error('User not authenticated:', info);
//       return res.redirect('http://localhost:3000/login');
//     }

//     req.logIn(user, (err) => {
//       if (err) {
//         console.error('Login error:', err);
//         return res.redirect('http://localhost:3000/login');
//       }

//       console.log('Authentication successful:', user);
//       return res.redirect('http://localhost:3000');
//     });
//   })(req, res, next);
// });




// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


const PORT = process.env.PORT || 5000;
// Start the server using app.listen()
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling for server startup
server.on('error', (error) => {
  console.error('Server startup error:', error);
});
