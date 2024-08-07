import React from 'react';
import Logo from '../shared/Logo';
// import SSOButtons from '../components/SSOButtons';
import RegisterForm from '../components/RegisterForm';
import Image from '../shared/Image';

const App = () => {
  return (
<div className="container mx-auto px-36 py-8 mt-8"> 
  <div className="flex flex-col md:flex-row items-center md:space-x-1">
    <div className="md:w-1/2 md:text-center mb-8 md:mb-0"> 
      <div className="mb-2 ml-2"> 
        <Logo />
      </div>
      <div className="mb-4 ml-2">
        <Image />
      </div>
    </div>
    <div className="md:w-1/2 md:text-center flex flex-col items-center -ml-4 md:-ml-2">
      <div className="mb-4 md:w-full">
        <RegisterForm />
      </div>
    </div>
  </div>
</div>

  );
};

export default App;
