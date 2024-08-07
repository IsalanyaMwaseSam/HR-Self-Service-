import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const isVerifying = useRef(false); 

  useEffect(() => {
    const verifyToken = async () => {
      if (isVerifying.current) return; 
      isVerifying.current = true; 

      try {
        const response = await fetch(`http://localhost:5000/api/verify/${token}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Verification successful:', data.message);
          navigate(`/login?message=${encodeURIComponent('Verification successful')}`);
        } else {
          const errorData = await response.json();
          console.error('Verification failed:', errorData.message);
          navigate(`/register?message=${encodeURIComponent(errorData.message)}`);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        navigate('/register?message=Verification failed due to internal error');
      }
    };

    verifyToken();
  }, [token, isVerifying]); 

  return (
    <div>
      <h1>Verifying...</h1>
    </div>
  );
};

export default Verify;
