import React, { useEffect, useState } from 'react';
import Logo from '../shared/Logo';
import SSOButtons from '../components/SSOButtons';
import LoginForm from '../components/LoginForm';
import Image from '../shared/Image';

const App = () => {

  return (
    <div className="container mx-auto px-36 py-8 mt-8"> 
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 md:text-center md:pr-2 mb-8 md:mb-0"> 
          <div className="mb-2 ml-2"> 
            <Logo />
          </div>
          <div className="mb-4 ml-2">
            <Image />
          </div>
        </div>
        <div className="md:w-1/2 md:text-center flex flex-col items-center md:pl-2">
          <div className="mb-4 md:mr-2 md:w-full">
            <SSOButtons />
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
