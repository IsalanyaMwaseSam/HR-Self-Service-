import React, { useState, useEffect } from 'react'
import { loadConfig, getBackendUrl } from '../config';


function Image() {
  const[imageURL, setImageURL] = useState('');
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/illustration`)
        const data = await response.json()
        setImageURL(data.illustrationURL)
      } catch (error) {
        console.error('Error fetching image URL:', error)
      }
    }
    fetchImageUrl();
  }, []);
  return (
    <div className='text-center my-3'>
      <img src={imageURL} alt='ilustration' style={{ width: '100%', maxWidth: '500px' }}></img>
    </div>
  )
}

export default Image
