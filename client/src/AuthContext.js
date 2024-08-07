import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOtpVerificationInProgress, setIsOtpVerificationInProgress] = useState(false);

  const login = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };

  const startOtpVerification = () => {
    setIsOtpVerificationInProgress(true);
  };

  const completeOtpVerification = () => {
    setIsOtpVerificationInProgress(false);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsOtpVerificationInProgress(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isOtpVerificationInProgress,
      login,
      startOtpVerification,
      completeOtpVerification,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
