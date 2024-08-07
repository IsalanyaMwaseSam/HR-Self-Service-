import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register';
import Login from './components/Login'
import Dashboard from './components/Dashboard';
import Verify from './components/Verify';
import VerifyOTP from './components/VerifyOTP';
import ChangePassword from './components/ChangePassword';
import { AuthProvider } from './AuthContext';
import SMTPForm from './components/SMTPForm';
import Personal from './components/Personal';
import Education from './components/Education';
import Skills from './components/Skills';
import Languages from './components/Languages';
import Experience from './components/Experience';
import Attachments from './components/Attachments';
import ProfileDisplay from './components/ProfileDisplay';
import JobDetails from './components/JobDetails';
import VerifyLoginOTP from './components/VerifyLoginOTP';
import Application from './components/Application';
import MyApplications from './components/MyApplications';
import ProtectedRoute from './ProtectedRoute';




function App() {


  return (
    <div className="App">
       <div className="App">
      <Router>
        <Routes>
            <Route path='/' element={<ProtectedRoute element={<Dashboard />} />}/>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path="/verify/:token" element={<Verify />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ChangePassword />} />
            <Route path='/smtp-settings' element={< SMTPForm/>} />
            <Route path='/profile/personal' element={< ProtectedRoute element={< Personal />} />} />
            <Route path='/profile/education' element={< ProtectedRoute element={< Education/>} />} />
            <Route path='/profile/experience' element={< ProtectedRoute element={< Experience/>} />} />
            <Route path='/profile/languages' element={< ProtectedRoute element={< Languages/>} />} />
            <Route path='/profile/skills' element={< ProtectedRoute element={< Skills/>} />} />
            <Route path='/profile/attachments' element={< ProtectedRoute element={< Attachments/>} />} />
            <Route path='/profile/view' element={< ProtectedRoute element={< ProfileDisplay/>} />} />
            <Route path='/job/:vacancyCode' element={< JobDetails/>} />
            <Route path="/verify/login-otp" element={<VerifyLoginOTP />}></Route>
            <Route path="/apply/:vacancyCode" element={< ProtectedRoute element={<Application />} />} />
            <Route path="/my-applications" element={<MyApplications />} />
        </Routes>
      </Router>
    </div>
     
    </div>
  );
}

export default App;
