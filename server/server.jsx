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
const staffRoutes = require('./routes/staffRoute')
const staffPasswordSetRoutes = require('./routes/staffPasswordSetRoute')
const staffLoginRoutes = require('./routes/staffLoginRoute')
const saveEvaluationCriteriaRoutes = require('./routes/saveEvaluationCriteriaRoute')
const savePostedJobRoutes = require('./routes/postJobRoute')
const staffApplicationRoutes = require('./routes/StaffApplicationsRoute')
const longlistRoutes = require('./routes/longlistRoute')
const pendingLonglistCountRoutes = require('./routes/pendingLonglistingRoute')
const pendingShortlistCountRoutes = require('./routes/pendingShortlistCountRoute')

const app = express();
const path = require('path'); 


app.use(cors());

// Configure session
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());



app.get('/success', (req, res) => res.send(userProfile));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.use('/api', staffRoutes);

app.use('/api', staffPasswordSetRoutes)

app.use('/api', staffLoginRoutes)

app.use('/api', saveEvaluationCriteriaRoutes)

app.use('/api', savePostedJobRoutes)

app.use('/api', staffApplicationRoutes)

app.use('/api', longlistRoutes)

app.use('/api', pendingLonglistCountRoutes)

app.use('/api', pendingShortlistCountRoutes)



// Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../client/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });


const PORT = process.env.PORT || 5000;
// Start the server using app.listen()
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling for server startup
server.on('error', (error) => {
  console.error('Server startup error:', error);
});
