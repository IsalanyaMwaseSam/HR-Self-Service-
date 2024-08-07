import React, { useEffect, useState} from 'react'
import { loadConfig, getBackendUrl } from '../config';


function Logo() {
  const[logoURL, setLogoURL] = useState('');
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/logo`)
        const data = await response.json()
        setLogoURL(data.logoURL)
      } catch (error) {
        console.error('Error fetching log URL:', error)
      }
    }
    fetchLogoUrl();
  }, []);
  return (
    <div className='text-center'>
        <img src={logoURL} alt="Company Logo" className='w-32' />
    </div>
  )
}

export default Logo
