import React, {useEffect} from 'react';
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';
import { loadConfig, getBackendUrl } from '../config';

function SSOButtons() {
  const backendUrl = getBackendUrl();
  useEffect(() => {
      const fetchConfig = async () => {
        await loadConfig();
      };
      fetchConfig();
    }, []);
    
  const handleSSO = (provider) => {
    window.location.href = `${backendUrl}/auth/api/${provider}`;
  };
  return (
    <div className='flex flex-col items-center'>
      <div className='flex items-center'>
        <h1 className="flex items-center text-xl">Sign in with</h1>
        <div className="ml-2 flex">
          <button   onClick={() => handleSSO('google')} className='btn btn-outline-primary mx-1 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center'>
            <FaGoogle className='text-white text-sm' />
          </button>
          <button  onClick={() => handleSSO('facebook')} className='btn btn-outline-primary mx-1 bg-blue-900 rounded-full w-8 h-8 flex items-center justify-center'>
            <FaFacebook className='text-white text-xl'/>
          </button>
          <button  onClick={() => handleSSO('twitter')} className='btn btn-outline-primary mx-1 bg-blue-950 rounded-full w-8 h-8 flex items-center justify-center'>
            <FaTwitter className='text-white text-xl' />
          </button>
        </div>
      </div>
      <div className='mt-10'>
        ━━━━━━━━━━━━━ Or ━━━━━━━━━━━━
      </div>
    </div>

  );
}

export default SSOButtons;
