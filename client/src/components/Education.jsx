import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import { TbChevronsRight } from 'react-icons/tb';
import { useCountries } from 'use-react-countries';
import { loadConfig, getBackendUrl } from '../config';

const Education = () => {
    const { countries } = useCountries();
    const [educationEntries, setEducationEntries] = useState([]);
    const [certificateEntries, setCertificateEntries] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [showCertificateForm, setShowCertificateForm] = useState(false);
    const [currentEducationEntry, setCurrentEducationEntry] = useState({
        institution: '',
        degree: '',
        country: '',
        title: '',
        startDate: '',
        endDate: '',
        level: '',
        subject: ''
    });

    const backendUrl = getBackendUrl();
    useEffect(() => {
        const fetchConfig = async () => {
          await loadConfig();
        };
        fetchConfig();
      }, []);
    

    
    const [currentCertificateEntry, setCurrentCertificateEntry] = useState({
        certificateName: '',
        issuingInstitution: '',
        registrationNumber: '',
        yearOfIssue: ''
    });

    useEffect(() => {
      const fetchEducationEntries = async () => {
          try {
              const response = await fetch(`${backendUrl}/api/education`, {
                  headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
              });

              if (!response.ok) {
                  throw new Error('Failed to fetch experience entries');
              }

              const data = await response.json();
              setEducationEntries(data);
              setCertificateEntries(data)
          } catch (error) {
              console.error('Error fetching experience entries:', error);
          }
      };

      fetchEducationEntries();
  }, []);

  

    const handleEducationChange = (e) => {
        const { name, value } = e.target;
        setCurrentEducationEntry(prevEntry => ({
            ...prevEntry,
            [name]: value
        }));
    };

    const handleAddEducation = () => {
        setShowEducationForm(prevState => !prevState);
        setCurrentEducationEntry({
            institution: '',
            degree: '',
            country: '',
            title: '',
            startDate: '',
            endDate: '',
            level: '',
            subject: ''
        });
    };

    const handleSaveEducation = () => {
        setEducationEntries(prevEntries => [...prevEntries, currentEducationEntry]);
        setShowEducationForm(false);
        setCurrentEducationEntry({
            institution: '',
            degree: '',
            country: '',
            title: '',
            startDate: '',
            endDate: '',
            level: '',
            subject: ''
        });
    };

    const handleCancelEducation = () => {
        setShowEducationForm(false);
        setCurrentEducationEntry({
            institution: '',
            degree: '',
            country: '',
            title: '',
            startDate: '',
            endDate: '',
            level: '',
            subject: ''
        });
    };

    const handleRemoveEducation = (index) => {
        setEducationEntries(prevEntries => prevEntries.filter((_, i) => i !== index));
    };

    const handleEditEducation = (index) => {
        setCurrentEducationEntry(educationEntries[index]);
        setShowEducationForm(true);
    };

    const handleAddCertificate = () => {
        setShowCertificateForm(prevState => !prevState);
        setCurrentCertificateEntry({
            certificateName: '',
            issuingInstitution: '',
            registrationNumber: '',
            yearOfIssue: ''
        });
    };

    const handleCertificateChange = (e) => {
        const { name, value } = e.target;
        setCurrentCertificateEntry(prevEntry => ({
            ...prevEntry,
            [name]: value
        }));
    };

    const handleSaveCertificate = () => {
        setCertificateEntries(prevEntries => [...prevEntries, currentCertificateEntry]);
        setShowCertificateForm(false);
        setCurrentCertificateEntry({
            certificateName: '',
            issuingInstitution: '',
            registrationNumber: '',
            yearOfIssue: ''
        });
    };

    const handleCancelCertificate = () => {
        setShowCertificateForm(false);
        setCurrentCertificateEntry({
            certificateName: '',
            issuingInstitution: '',
            registrationNumber: '',
            yearOfIssue: ''
        });
    };

    const handleRemoveCertificate = (index) => {
        setCertificateEntries(prevEntries => prevEntries.filter((_, i) => i !== index));
    };

    const handleEditCertificate = (index) => {
        setCurrentCertificateEntry(certificateEntries[index]);
        setShowCertificateForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/education`, {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ educationEntries, certificateEntries })
            });

            if (!response.ok) {
                throw new Error('Failed to save education profile updates');
            }

            const result = await response.json();
            setMessage({ type: 'success', text: 'Your Education profile has successfully been updated' });
            console.log('Data successfully saved:', result);
        } catch (error) {
            console.error('Error saving data:', error);
            setMessage({ type: 'error', text: 'Error saving data. Please try again.' });
        }
    };

    return (
        <>
            <Profile />
            <form onSubmit={handleSubmit} className='max-w-7xl mx-auto'>
                {message.text && (
                    <div className={`mt-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}
                <div className='bg-white border border-gray-200 mx-auto max-w-7xl mt-4 p-4 rounded-lg shadow-md'>
                    {educationEntries.map((entry, index) => (
                        <div key={index} className='mb-4'>
                            <div className='flex justify-between items-center'>
                                <div>
                                    <strong>{entry.institution}</strong> - {entry.degree} - 
                                    <strong>{entry.subject}</strong> 
                                </div>
                                <div className='flex space-x-2'>
                                    <button 
                                        type='button' 
                                        className='bg-yellow-500 text-white py-1 px-2 rounded'
                                        onClick={() => handleEditEducation(index)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        type='button' 
                                        className='bg-red-500 text-white py-1 px-2 rounded'
                                        onClick={() => handleRemoveEducation(index)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className='flex items-center cursor-pointer'>
                        <div className='flex-1 text-center'>
                            <button
                                className='bg-gray-500 text-white w-full py-2 rounded-md hover:bg-gray-600 transition-colors duration-200'
                                onClick={handleAddEducation}
                                type='button'
                            >
                                Add Education
                            </button>
                        </div>
                    </div>
                    {showEducationForm && (
                        <div className='mt-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Educational Institute:</label>
                                    <input
                                        required
                                        type='text'
                                        name='institution'
                                        value={currentEducationEntry.institution}
                                        onChange={handleEducationChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Country:</label>
                                    <select
                                        name='country'
                                        value={currentEducationEntry.country}
                                        onChange={handleEducationChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    >
                                        <option value="">Country</option>
                                        {countries.map((country) => (
                                            <option key={country.code} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Degree Awarded:</label>
                                    <input
                                        required
                                        type='text'
                                        name='degree'
                                        value={currentEducationEntry.degree}
                                        onChange={handleEducationChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Attended From:</label>
                                    <input
                                        required
                                        type='date'
                                        name='startDate'
                                        value={currentEducationEntry.startDate}
                                        onChange={handleEducationChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Attended to:</label>
                                    <input
                                        type='date'
                                        name='endDate'
                                        value={currentEducationEntry.endDate}
                                        onChange={handleEducationChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Degree/Diploma Title:</label>
                                    <input
                                        type='text'
                                        name='title'
                                        value={currentEducationEntry.title}
                                        onChange={handleEducationChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Degree/Diploma Level:</label>
                                    <input
                                        type='text'
                                        name='level'
                                        value={currentEducationEntry.level}
                                        onChange={handleEducationChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Degree/Diploma Subject:</label>
                                    <input
                                        type='text'
                                        name='subject'
                                        value={currentEducationEntry.subject}
                                        onChange={handleEducationChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex justify-start mt-2 col-span-3'>
                                    <div className='flex space-x-2'>
                                        <button 
                                            type='button' 
                                            className='bg-green-500 text-white py-1 px-4 rounded'
                                            onClick={handleSaveEducation}
                                        >
                                            Save
                                        </button>
                                        <button 
                                            type='button' 
                                            className='bg-red-500 text-white py-1 px-4 rounded'
                                            onClick={handleCancelEducation}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className='bg-white border border-gray-200 mx-auto max-w-7xl mt-4 p-4 rounded-lg shadow-md'>
                    {certificateEntries.map((entry, index) => (
                        <div key={index} className='mb-4'>
                            <div className='flex justify-between items-center'>
                                <div>
                                    <strong>{entry.certificateName}</strong> - {entry.certificateName} - 
                                    <strong>{entry.issuingInstitution}</strong> 
                                </div>
                                <div className='flex space-x-2'>
                                    <button 
                                        type='button' 
                                        className='bg-yellow-500 text-white py-1 px-2 rounded'
                                        onClick={() => handleEditCertificate(index)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        type='button' 
                                        className='bg-red-500 text-white py-1 px-2 rounded'
                                        onClick={() => handleRemoveCertificate(index)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className='flex items-center cursor-pointer'>
                        <div className='flex-1 text-center'>
                            <button
                                className='bg-gray-500 text-white w-full py-2 rounded-md hover:bg-gray-600 transition-colors duration-200'
                                onClick={handleAddCertificate}
                                type='button'
                            >
                                Add Certificate
                            </button>
                        </div>
                    </div>
                    {showCertificateForm && (
                        <div className='mt-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Certificate Name:</label>
                                    <input
                                        required
                                        type='text'
                                        name='certificateName'
                                        value={currentCertificateEntry.certificateName}
                                        onChange={handleCertificateChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Issuing Institution:</label>
                                    <input
                                        required
                                        type='text'
                                        name='issuingInstitution'
                                        value={currentCertificateEntry.issuingInstitution}
                                        onChange={handleCertificateChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Registration Number:</label>
                                    <input
                                        required
                                        type='text'
                                        name='registrationNumber'
                                        value={currentCertificateEntry.registrationNumber}
                                        onChange={handleCertificateChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Year of issue:</label>
                                    <input
                                        required
                                        type='date'
                                        name='yearOfIssue'
                                        value={currentCertificateEntry.yearOfIssue}
                                        onChange={handleCertificateChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                              
                                <div className='flex justify-start mt-2 col-span-3'>
                                    <div className='flex space-x-2'>
                                        <button 
                                            type='button' 
                                            className='bg-green-500 text-white py-1 px-4 rounded'
                                            onClick={handleSaveCertificate}
                                        >
                                            Save
                                        </button>
                                        <button 
                                            type='button' 
                                            className='bg-red-500 text-white py-1 px-4 rounded'
                                            onClick={handleCancelCertificate}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex justify-end mt-8'>
                    <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded flex items-center space-x-2'>
                        <span>Save</span>
                        <TbChevronsRight />
                    </button>
                </div>
            </form>
        </>
    );
};

export default Education;
