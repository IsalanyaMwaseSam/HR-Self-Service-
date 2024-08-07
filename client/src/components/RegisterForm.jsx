import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { loadConfig, getBackendUrl } from '../config';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const navigate = useNavigate();
  const location = useLocation();
  const [emailError, setEmailError] = useState('');
  const isExpired = location.state && location.state.expired;
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (location.search.includes('message=')) {
      const params = new URLSearchParams(location.search);
      setError(params.get('message'));
    }
  }, [location]);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialCharacter;
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength('Password is too short');
    } else if (!/[A-Z]/.test(password)) {
      setPasswordStrength('Password must contain an upper case letter');
    } else if (!/[a-z]/.test(password)) {
      setPasswordStrength('Password must contain a lower case letter');
    } else if (!/[0-9]/.test(password)) {
      setPasswordStrength('Password must contain a digit');
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordStrength('Password must contain a special character');
    } else {
      setPasswordStrength('Password is strong');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatch(password === newConfirmPassword ? '' : 'Passwords do not match');
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateEmail(email)) {
      setLoading(false);
      return;
    }

    if (passwordStrength !== 'Password is strong') {
      setError('Password does not meet strength requirements.');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain both uppercase and lowercase letters.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          sessionStorage.setItem('successMessage', 'Account Successfully Created. Please check your email to verify your account.');
          setLoading(false);
          navigate('/login');
        }, 1000);
      } else if (response.status === 401) {
        setError('User with this email already exists. Please choose a different email.');
        setLoading(false);
      } else {
        setEmailError(data.error);
        setError('Failed to register user.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to register user.');
      setEmailError('An error occurred during registration.');
      setLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="relative">
      {isExpired && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Your verification link has expired. Please register again.</span>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <img src="/Spinner.gif" alt="Loading..." className="w-16 h-16" />
        </div>
      )}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
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
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>
          <div className="flex items-center justify-between">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={togglePasswordVisibility}
            >
              <FaEye className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {password && (
            <p className={`text-sm mt-2 ${passwordStrength === 'Password is strong' ? 'text-green-500' : 'text-red-500'}`}>
              {passwordStrength}
            </p>
          )}
           <div className="flex items-center justify-between">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
            </div>
          <div className="relative">
            <input
              id="confirm-password"
              name="confirm-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="confirm-password"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pr-10"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={togglePasswordVisibility}
            >
              <FaEye className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {confirmPassword && (
            <p className={`text-sm mt-2 ${passwordMatch === '' ? 'text-green-500' : 'text-red-500'}`}>
              {passwordMatch || 'Passwords match'}
            </p>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Register
          </button>
          <div className="text-left mt-3">
          <p>Have an account? <a href="/login" className="text-blue-500 hover:no-underline">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
