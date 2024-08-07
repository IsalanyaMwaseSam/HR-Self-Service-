import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../shared/NavBar';
import { useAuth } from '../AuthContext';
import { loadConfig, getBackendUrl } from '../config';

const VerifyLoginOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOTP] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const [error, setError] = useState('');
  const { completeOtpVerification, login } = useAuth();
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    console.log('Email passed to VerifyLoginOTP:', email);
    if (!email) {
      setError('Email is required for OTP verification');
      navigate('/login'); // Redirect to login if email is not provided
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/verify/login-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        login(data.token);  // Complete the authentication process
        completeOtpVerification();  // Complete OTP verification process
        navigate('/');
      } else {
        setError(data.error || 'Failed to verify login OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Internal server error');
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <form className="space-y-6" onSubmit={handleVerify}>
            <label className="block text-sm font-medium leading-6 text-gray-900">Enter OTP</label>
            <input
              id="loginotp"
              name="loginotp"
              type="text"
              required
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p>{error}</p>
              </div>
            )}
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyLoginOTP;
