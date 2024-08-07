import React, { useState, useEffect } from 'react';
import { FaCaretSquareRight } from 'react-icons/fa';

const FormSection = ({ title, children, defaultExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  return (
    <div className='bg-gray-200 border border-gray-400 mx-auto max-w-7xl mt-4'>
      <div className='h-10 flex items-center cursor-pointer ml-4' onClick={handleToggle}>
        <div className='flex items-center'>
          <FaCaretSquareRight className={`mr-2 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
        <div className='flex-1 text-center'>
          <p className='text-blue-500'>{title}</p>
        </div>
      </div>
      {isExpanded && (
        <div className='bg-slate-50 p-4'>
          {children}
        </div>
      )}
    </div>
  );
};

export default FormSection;
