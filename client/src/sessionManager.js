import React, { useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';

const SESSION_TIMEOUT = 1000 * 60 * 60; // 60 minutes
const WARNING_TIME = 1000 * 60 * 5; // 5 minutes

const SessionManager = ({ children }) => {
  const navigate = useNavigate();

  const handleOnIdle = () => {
    // Handle session expiration
    // Make an API call to log out if needed
    fetch('/logout', {
      method: 'POST',
      credentials: 'include', // Ensure cookies/session are sent with the request
    }).then(() => {
      navigate('/login?message=sessionExpired');
    });
  };

  const { getRemainingTime } = useIdleTimer({
    timeout: SESSION_TIMEOUT,
    onIdle: handleOnIdle,
    debounce: 500,
  });

  useEffect(() => {
    const remainingTime = getRemainingTime();
    if (remainingTime <= WARNING_TIME) {
      alert('Your session is about to expire. Please save your work.');
    }
  }, [getRemainingTime]);

  return <>{children}</>;
};

export default SessionManager;
