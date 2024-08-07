import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../shared/NavBar';
import { loadConfig, getBackendUrl } from '../config';

const ChangePassword = ({ onSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const backendUrl = getBackendUrl();
  useEffect(() => {
      const fetchConfig = async () => {
        await loadConfig();
      };
      fetchConfig();
    }, []);

  const validatePassword = (newPassword) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasDigit = /[0-9]/.test(newPassword)
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    return newPassword.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialCharacter;
  };

  const checkPasswordStrength = (newPassword) => {
    if (newPassword.length < 8) {
      setPasswordStrength('Password is too short');
    } else if (!/[A-Z]/.test(newPassword)) {
      setPasswordStrength('Password must contain upper case letter');
    } else if (!/[a-z]/.test(newPassword)) {
      setPasswordStrength('Password must contain lower case letter');
    }  else if (!/[0-9]/.test(newPassword)) {
      setPasswordStrength('Password must contain a digit');
    }  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setPasswordStrength('Password must contain a special character');
    } 
    else {
      setPasswordStrength('Password is strong');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    checkPasswordStrength(newPassword);
    setPasswordMatch(newPassword === confirmPassword ? '' : 'Passwords do not match');
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatch(newPassword === newConfirmPassword ? '' : 'Passwords do not match');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkPasswordStrength(newPassword)

    if (passwordStrength !== 'Password is strong') {
      setError('Password does not meet strength requirements.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters long and contain both uppercase and lowercase letters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }), // Send the new password to the backend
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Internal server error');
    }
  };

  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md md:max-w-lg lg:max-w-xl -mt-40">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-900">
                New Password
              </label>
              <input
                id="new-password"
                name="new-password"
                type="password"
                required
                value={newPassword}
                onChange={handlePasswordChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {newPassword && (
              <p className={`text-sm mt-2 ${passwordStrength === 'Password is strong' ? 'text-green-500' : 'text-red-500'}`}>
                {passwordStrength}
              </p>
            )}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {confirmPassword && passwordMatch && (
              <p className={`text-sm mt-2 ${passwordMatch === '' ? 'text-green-500' : 'text-red-500'}`}>
                {passwordMatch}
              </p>
            )}

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
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
