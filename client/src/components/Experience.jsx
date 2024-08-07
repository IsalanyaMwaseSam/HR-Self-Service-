import React, { useState, useEffect, useMemo } from 'react';
import Profile from './Profile';
import { TbChevronsRight } from 'react-icons/tb';
import { useCountries } from 'use-react-countries';
import { loadConfig, getBackendUrl } from '../config';

const Experience = () => {
    const { countries } = useCountries();
    const sortedCountries = useMemo(() => {
        return countries.sort((a, b) => a.name.localeCompare(b.name));
    }, [countries]);
    const [experienceEntries, setExperienceEntries] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [currentExperienceEntry, setCurrentExperienceEntry] = useState({
        employerName: '',
        workArea: '',
        country: '',
        functionalTitle: '',
        startDate: '',
        endDate: '',
        noOfEmployeesSupervised: '',
        descriptionOfDuties: '',
        majorAchievements: '',
        leavingReasons: ''
    });
 
    const backendUrl = getBackendUrl();
  
    useEffect(() => {
      const fetchConfig = async () => {
        await loadConfig();
      };
      fetchConfig();
    }, []);
  

  
    const fetchExperienceEntries = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/experience`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch experience entries');
            }
    
            const data = await response.json();
            console.log('Fetched Experience Entries:', data); // Debug log
            setExperienceEntries(data);
        } catch (error) {
            console.error('Error fetching experience entries:', error);
        }
    };
    

    useEffect(() => {
        fetchExperienceEntries(); // Fetch entries on component mount
    }, []);

    const handleExperienceChange = (e) => {
        const { name, value } = e.target;
        setCurrentExperienceEntry(prevEntry => ({
            ...prevEntry,
            [name]: value
        }));
    };

    const handleAddExperience = () => {
        setShowExperienceForm(true);
        setCurrentExperienceEntry({
            employerName: '',
            workArea: '',
            country: '',
            functionalTitle: '',
            startDate: '',
            endDate: '',
            noOfEmployeesSupervised: '',
            descriptionOfDuties: '',
            majorAchievements: '',
            leavingReasons: ''
        });
    };

    const handleSaveExperience = async (e) => {
        e.preventDefault(); 
        const {
            employerName,
            workArea,
            country,
            functionalTitle,
            startDate,
            endDate,
            noOfEmployeesSupervised,
            descriptionOfDuties,
            majorAchievements,
            leavingReasons
        } = currentExperienceEntry;
        
        if (!employerName || !workArea || !country || !functionalTitle || !startDate || !endDate || !noOfEmployeesSupervised || !descriptionOfDuties || !majorAchievements || !leavingReasons) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            return;
        }
    
        try {
            const response = await fetch(`${backendUrl}/api/experience`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ experienceEntries: [currentExperienceEntry] }) // Send as an array
            });
    
            if (!response.ok) {
                throw new Error('Failed to save experience entry');
            }
    
            console.log('Response:', response);
    
            await fetchExperienceEntries();  // Refresh the list
            setShowExperienceForm(false);
            setMessage({ type: 'success', text: 'Experience entry has been successfully saved' });
        } catch (error) {
            console.error('Error saving experience entry:', error);
            setMessage({ type: 'error', text: 'Error saving experience entry. Please try again.' });
        }
    };
    
    const handleCancelExperience = () => {
        setShowExperienceForm(false);
        setCurrentExperienceEntry({
            employerName: '',
            workArea: '',
            country: '',
            functionalTitle: '',
            startDate: '',
            endDate: '',
            noOfEmployeesSupervised: '',
            descriptionOfDuties: '',
            majorAchievements: '',
            leavingReasons: ''
        });
    };

    const handleRemoveExperience = async (index) => {
        const entryToRemove = experienceEntries[index];
        try {
            const response = await fetch(`${backendUrl}/experience/${entryToRemove.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete experience entry');
            }

            setExperienceEntries(prevEntries => prevEntries.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error deleting experience entry:', error);
        }
    };

    const handleEditExperience = (index) => {
        setCurrentExperienceEntry(experienceEntries[index]);
        setShowExperienceForm(true);
    };


    return (
        <>
            <Profile />
            <form onSubmit={handleSaveExperience} className='max-w-7xl mx-auto'>
                {message.text && (
                    <div className={`mt-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}
                <div className='bg-white border border-gray-200 mx-auto max-w-7xl mt-4 p-4 rounded-lg shadow-md'>
                    {experienceEntries.map((entry, index) => (
                        <div key={index} className='mb-4'>
                            <div className='flex justify-between items-center'>
                                <div>
                                    <strong>{entry.employerName}</strong> - {entry.functionalTitle} - 
                                    <strong>{entry.workArea}</strong>
                                </div>
                                <div className='flex space-x-2'>
                                    <button 
                                        type='button' 
                                        className='bg-yellow-500 text-white py-1 px-2 rounded'
                                        onClick={() => handleEditExperience(index)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        type='button' 
                                        className='bg-red-500 text-white py-1 px-2 rounded'
                                        onClick={() => handleRemoveExperience(index)}
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
                                onClick={handleAddExperience}
                                type='button'
                            >
                                Add Experience
                            </button>
                        </div>
                    </div>
                    {showExperienceForm && (
                        <div className='mt-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Name of Employer:</label>
                                    <input
                                        required
                                        type='text'
                                        name='employerName'
                                        value={currentExperienceEntry.employerName}
                                        onChange={handleExperienceChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Area of Work:</label>
                                    <input
                                        required
                                        type='text'
                                        name='workArea'
                                        value={currentExperienceEntry.workArea}
                                        onChange={handleExperienceChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Country:</label>
                                    <select
                                        name='country'
                                        value={currentExperienceEntry.country}
                                        onChange={handleExperienceChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    >
                                        <option value="">Country</option>
                                        {sortedCountries.map((country) => (
                                            <option key={country.code} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Functional Title:</label>
                                    <input
                                        required
                                        type='text'
                                        name='functionalTitle'
                                        value={currentExperienceEntry.functionalTitle}
                                        onChange={handleExperienceChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Employed From:</label>
                                    <input
                                        required
                                        type='date'
                                        name='startDate'
                                        value={currentExperienceEntry.startDate}
                                        onChange={handleExperienceChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Employed to:</label>
                                    <input
                                        type='date'
                                        name='endDate'
                                        value={currentExperienceEntry.endDate}
                                        onChange={handleExperienceChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Number of Employees Supervised:</label>
                                    <input
                                        required
                                        type='number'
                                        name='noOfEmployeesSupervised'
                                        value={currentExperienceEntry.noOfEmployeesSupervised}
                                        onChange={handleExperienceChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Description of Duties:</label>
                                    <input
                                        required
                                        type='text'
                                        name='descriptionOfDuties'
                                        value={currentExperienceEntry.descriptionOfDuties}
                                        onChange={handleExperienceChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Major Achievements:</label>
                                    <input
                                        required
                                        type='text'
                                        name='majorAchievements'
                                        value={currentExperienceEntry.majorAchievements}
                                        onChange={handleExperienceChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Reasons for Leaving:</label>
                                    <input
                                        required
                                        type='text'
                                        name='leavingReasons'
                                        value={currentExperienceEntry.leavingReasons}
                                        onChange={handleExperienceChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex justify-start mt-2 col-span-3'>
                                    <div className='flex space-x-2'>
                                        <button 
                                            type='submit' 
                                            className='bg-green-500 text-white py-1 px-4 rounded'
                                        >
                                            Save
                                        </button>
                                        <button 
                                            type='button' 
                                            className='bg-red-500 text-white py-1 px-4 rounded'
                                            onClick={handleCancelExperience}
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

export default Experience;
