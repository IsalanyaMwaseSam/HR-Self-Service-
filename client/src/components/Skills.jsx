import React, { useState, useEffect, useMemo } from 'react';
import Profile from './Profile';
import { TbChevronsRight } from 'react-icons/tb';
import { loadConfig, getBackendUrl } from '../config';

const Skills = () => {
  const backendUrl = getBackendUrl();
  const [skillsEntries, setSkillsEntries] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showSkillsForm, setShowSkillsForm] = useState(false);
  const [currentSkillsEntry, setCurrentSkillsEntry] = useState({
    skillDescription: '',
    yearsOfExperience: ''
  });

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  const fetchSkillsEntries = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/skills`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch skills entries');
      }

      const data = await response.json();
      console.log('Fetched Skills Entries:', data); // Debug log
      setSkillsEntries(data);
    } catch (error) {
      console.error('Error fetching skills entries:', error);
    }
  };

  useEffect(() => {
    fetchSkillsEntries(); // Fetch entries on component mount
  }, []);

  const handleSkillsChange = (e) => {
    const { name, value } = e.target;
    setCurrentSkillsEntry(prevEntry => ({
      ...prevEntry,
      [name]: value
    }));
  };

  const handleAddSkills = () => {
    setShowSkillsForm(true);
    setCurrentSkillsEntry({
      skillDescription: '',
      yearsOfExperience: ''
    });
  };

  const handleSaveSkills = async (e) => {
    e.preventDefault();
    const { skillDescription, yearsOfExperience } = currentSkillsEntry;

    if (!skillDescription || !yearsOfExperience) {
      setMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(currentSkillsEntry)
      });

      if (!response.ok) {
        throw new Error('Failed to save skills entry');
      }

      console.log('Response:', response);

      await fetchSkillsEntries();  // Refresh the list
      setShowSkillsForm(false);
      setMessage({ type: 'success', text: 'Skills entry has been successfully saved' });
    } catch (error) {
      console.error('Error saving skills entry:', error);
      setMessage({ type: 'error', text: 'Error saving skills entry. Please try again.' });
    }
  };

  const handleCancelSkills = () => {
    setShowSkillsForm(false);
    setCurrentSkillsEntry({
      skillDescription: '',
      yearsOfExperience: ''
    });
  };

  const handleRemoveSkills = async (index) => {
    const entryToRemove = skillsEntries[index];
    try {
      const response = await fetch(`${backendUrl}/api/skills/${entryToRemove.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete skills entry');
      }

      setSkillsEntries(prevEntries => prevEntries.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting skills entry:', error);
    }
  };

  const handleEditSkills = (index) => {
    setCurrentSkillsEntry(skillsEntries[index]);
    setShowSkillsForm(true);
  };

  return (
    <>
      <Profile />
      <form onSubmit={handleSaveSkills} className='max-w-7xl mx-auto'>
        {message.text && (
          <div className={`mt-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
        <div className='bg-white border border-gray-200 mx-auto max-w-7xl mt-4 p-4 rounded-lg shadow-md'>
          {skillsEntries.map((entry, index) => (
            <div key={index} className='mb-4'>
              <div className='flex justify-between items-center'>
                <div>
                  <strong>{entry.skillDescription}</strong> - {entry.yearsOfExperience} years
                </div>
                <div className='flex space-x-2'>
                  <button
                    type='button'
                    className='bg-yellow-500 text-white py-1 px-2 rounded'
                    onClick={() => handleEditSkills(index)}
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    className='bg-red-500 text-white py-1 px-2 rounded'
                    onClick={() => handleRemoveSkills(index)}
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
                onClick={handleAddSkills}
                type='button'
              >
                Add Skills
              </button>
            </div>
          </div>
          {showSkillsForm && (
            <div className='mt-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
                <div className='flex flex-col'>
                  <label className='w-full'>Skill Description:</label>
                  <input
                    required
                    type='text'
                    name='skillDescription'
                    value={currentSkillsEntry.skillDescription}
                    onChange={handleSkillsChange}
                    className='border border-gray-400 p-2 rounded-sm'
                  />
                </div>
                <div className='flex flex-col'>
                  <label className='w-full'>Years of Experience:</label>
                  <input
                    required
                    type='number'
                    name='yearsOfExperience'
                    value={currentSkillsEntry.yearsOfExperience}
                    onChange={handleSkillsChange}
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
                      onClick={handleCancelSkills}
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

export default Skills;
