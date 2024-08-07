import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../shared/NavBar';
import { loadConfig, getBackendUrl } from '../config';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOTP] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        navigate('/reset-password', { state: { email } });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Internal server error');
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess('OTP has been resent successfully.');
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to resend OTP');
        setSuccess('');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('Internal server error');
      setSuccess('');
    }
  };


  return (
    <>
    <div>
      <NavBar />
    </div>
    <div  className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md md:max-w-lg lg:max-w-xl -mt-40">
            <form className="space-y-6" onSubmit={handleVerify}>
                <label className="block text-sm font-medium leading-6 text-gray-900">Enter OTP</label>
                <input   id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOTP(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
                <div className="flex justify-between items-center">

                {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p>{error}</p>
                </div>
                )}
              <button
                type="submit"
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Resend OTP
              </button>
            </div>
            </form>
        </div>
    </div>
    </>
  )
}

export default VerifyOTP
