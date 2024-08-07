import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import NavBar from '../shared/NavBar';
import { FaUser } from 'react-icons/fa';

function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('Personal');

    useEffect(() => {
        const path = location.pathname.split('/').pop();
        const capitalizedPath = path.charAt(0).toUpperCase() + path.slice(1);
        setActiveSection(capitalizedPath);
    }, [location]);

    const handleClick = (section) => {
        setActiveSection(section);
        navigate(`/profile/${section.toLowerCase()}`); 
    };

    return (
        <div>
            <NavBar />
            <div className='flex flex-col items-center justify-center mt-24 font-semibold text-xs sm:mt-16'>
                <div className='flex items-center'>
                    <h1 className='text-blue-300 text-2xl sm:text-3xl mr-4'>MY PROFILE</h1>
                    <FaUser className='text-blue-300 text-xl sm:text-2xl' />
                </div>
            </div>

            <div className='mt-8'>
                <div className='container mx-auto px-4 sm:px-6'>
                    <ul className='flex flex-wrap justify-center gap-4 sm:gap-6 sm:flex-nowrap'>
                        {['Personal', 'Education', 'Experience', 'Languages', 'Skills', 'Attachments', 'View'].map((section) => (
                            <li
                                key={section}
                                className={`cursor-pointer ${activeSection === section ? 'text-orange-500' : 'text-gray-700'} hover:text-orange-500 text-sm sm:text-base`}
                                onClick={() => handleClick(section)}
                            >
                                {section}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='bg-gray-50 border border-gray-400 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-10 mt-8 flex items-center justify-center'>
                <p className='text-blue-500'>* Denotes Required Field</p>
            </div>
        </div>
    );
}

export default Profile;
