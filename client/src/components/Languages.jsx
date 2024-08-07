import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import { TbChevronsRight } from 'react-icons/tb';
import { loadConfig, getBackendUrl } from '../config';

const Languages = () => {
  const [languageEntries, setLanguageEntries] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showLanguageForm, setShowLanguageForm] = useState(false);
  const [currentLanguageEntry, setCurrentLanguageEntry] = useState({
    languageName: '',
    readingAbility: '',
    writingAbility: '',
    speakingAbility: ''
  });

  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);


  // Fetch experience entries on component mount
  useEffect(() => {
      const fetchLanguageEntries = async () => {
          try {
              const response = await fetch(`${backendUrl}/api/language`, {
                  headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
              });

              if (!response.ok) {
                  throw new Error('Failed to fetch experience entries');
              }

              const data = await response.json();
              setLanguageEntries(data);
          } catch (error) {
              console.error('Error fetching experience entries:', error);
          }
      };

      fetchLanguageEntries();
  }, []);

  const handleLanguageChange = (e) => {
      const { name, value } = e.target;
      setCurrentLanguageEntry(prevEntry => ({
          ...prevEntry,
          [name]: value
      }));
  };

  const handleAddLanguage = () => {
      setShowLanguageForm(prevState => !prevState);
      setCurrentLanguageEntry({
        languageName: '',
        readingAbility: '',
        writingAbility: '',
        speakingAbility: ''
      });
  };

  const handleSaveLanguage = async () => {
      try {
          const response = await fetch(`${backendUrl}/api/language`, {
              method: 'POST',
              headers: {
                  'content-type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(currentLanguageEntry)
          });

          if (!response.ok) {
              throw new Error('Failed to save experience entry');
          }

          
          setLanguageEntries(prevEntries => [...prevEntries, currentLanguageEntry]);
          setShowLanguageForm(false);
          setMessage({ type: 'success', text: 'Experience entry has been successfully saved' });
      } catch (error) {
          console.error('Error saving experience entry:', error);
          setMessage({ type: 'error', text: 'Error saving experience entry. Please try again.' });
      }
  };

  const handleCancelLanguage = () => {
      setShowLanguageForm(false);
      setCurrentLanguageEntry({
        languageName: '',
        readingAbility: '',
        writingAbility: '',
        speakingAbility: ''
      });
  };

  const handleRemoveLanguage = async (index) => {
      const entryToRemove = languageEntries[index];
      try {
          const response = await fetch(`${backendUrl}/language/${entryToRemove.id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
          });

          if (!response.ok) {
              throw new Error('Failed to delete language entry');
          }

          setLanguageEntries(prevEntries => prevEntries.filter((_, i) => i !== index));
      } catch (error) {
          console.error('Error deleting language entry:', error);
      }
  };

  const handleEditLanguage = (index) => {
      setCurrentLanguageEntry(languageEntries[index]);
      setShowLanguageForm(true);
  };

  return (
        <>
            <Profile />
            <form onSubmit={handleSaveLanguage} className='max-w-7xl mx-auto'>
                {message.text && (
                    <div className={`mt-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}
                <div className='bg-white border border-gray-200 mx-auto max-w-7xl mt-4 p-4 rounded-lg shadow-md'>
                {languageEntries.map((entry, index) => (
                      <div key={index} className='mb-4'>
                          <div className='flex justify-between items-center'>
                              <div>
                                  <strong>{entry.languageName}</strong> - {entry.languageName} - 
                                  <strong>{entry.speakingAbility}</strong>
                              </div>
                              <div className='flex space-x-2'>
                                  <button 
                                      type='button' 
                                      className='bg-yellow-500 text-white py-1 px-2 rounded'
                                      onClick={() => handleEditLanguage(index)}
                                  >
                                      Edit
                                  </button>
                                  <button 
                                      type='button' 
                                      className='bg-red-500 text-white py-1 px-2 rounded'
                                      onClick={() => handleRemoveLanguage(index)}
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
                                onClick={handleAddLanguage}
                                type='button'
                            >
                                Add Language
                            </button>
                        </div>
                    </div>
                    {showLanguageForm && (
                        <div className='mt-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Language Name:</label>
                                    <input
                                        required
                                        type='text'
                                        name='languageName'
                                        value={currentLanguageEntry.languageName}
                                        onChange={handleLanguageChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Ability to Read:</label>
                                    <select
                                        name='readingAbility'
                                        value={currentLanguageEntry.readingAbility}
                                        onChange={handleLanguageChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    >
                                        <option value='None'>None</option>
                                        <option value='Basic'>Basic</option>
                                        <option value='Intermediate'>Intermediate</option>
                                        <option value='Fluent'>Fluent</option>
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='w-full'>Ability to Speak:</label>
                                    <select
                                        name='speakingAbility'
                                        value={currentLanguageEntry.speakingAbility}
                                        onChange={handleLanguageChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    >
                                        <option value='None'>None</option>
                                        <option value='Basic'>Basic</option>
                                        <option value='Intermediate'>Intermediate</option>
                                        <option value='Fluent'>Fluent</option>
                                    </select>
                                </div>
                                <div className='flex flex-col col-span-3'>
                                    <label className='w-full'>Ability to Write:</label>
                                    <select
                                        name='writingAbility'
                                        value={currentLanguageEntry.writingAbility}
                                        onChange={handleLanguageChange}
                                        className='border border-gray-400 p-2 rounded-sm'
                                    >
                                        <option value='None'>None</option>
                                        <option value='Basic'>Basic</option>
                                        <option value='Intermediate'>Intermediate</option>
                                        <option value='Fluent'>Fluent</option>
                                    </select>
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
                                            onClick={handleCancelLanguage}
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

export default Languages;


