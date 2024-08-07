import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FaEye } from 'react-icons/fa';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { loadConfig, getBackendUrl } from '../config';

const LoginPage = () => {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const messages = sessionStorage.getItem('successMessage');
    if (messages) {
      setSuccessMessage(messages);
      sessionStorage.removeItem('successMessage');
    }
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get('message');
    

    console.log('Location Search:', location.search);
    console.log('Message:', message);


    if (message) {
      setSuccessMessage(message);
      setShowSuccessAlert(true); 
    }

    const storedMessage = sessionStorage.getItem('successMessage');
    if (storedMessage) {
      setSuccessMessage(storedMessage);
      sessionStorage.removeItem('successMessage');
    }
  }, [location.search]);

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
      {showSuccessAlert && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert variant="filled" severity="success">
            Your account has been successfully verified. You can now log in.
          </Alert>
        </Stack>
      )}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      <LoginForm />
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { login, startOtpVerification } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const message = query.get('message');

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = getBackendUrl();

    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === 'OTP sent to your email') {
          console.log('Navigating to OTP verification page with email:', email);
          startOtpVerification();  
          navigate('/verify/login-otp', { state: { email } });
        } else {
          const { token } = data;
          localStorage.setItem('token', token); 
          login(data.token);
          console.log('Login successful');
          navigate('/');
        }
      } else {
        setError(data.error || 'Failed to login');
        console.log('error found while trying to log in:', error)
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Internal server error');
    }
  };
  
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async () => {
    const backendUrl = getBackendUrl();

    const response = await fetch(`${backendUrl}/api/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setOtpSent(true);
      alert(data.message); 
      navigate('/verify-otp', { state: { email } });
    } else {
      setError(data.error || 'Failed to send reset password OTP');
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
       {message === 'sessionExpired' && (
        <div className="alert alert-warning">
          Your session has expired due to inactivity. Please log in again.
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
          </div>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <FaEye className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3">
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox" id="rememberMe" name="rememberMe" />
            <span className="ml-2">Remember me</span>
          </label>
          <div className="text-left mt-3">
            <button onClick={handleForgotPassword} className="text-blue-500" disabled={!email || otpSent}>Reset Password</button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-52 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Login
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="text-left mt-3">
          <p>Don't have an account? <a href="/register" className="text-blue-500">Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
