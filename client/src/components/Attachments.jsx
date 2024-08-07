import React, { useState, useEffect } from 'react';
import { TbChevronsRight } from 'react-icons/tb';
import FormSection from './FormSection';
import Profile from './Profile';
import { loadConfig, getBackendUrl } from '../config';

const FormComponent = () => {
    const backendUrl = getBackendUrl();
    useEffect(() => {
        const fetchConfig = async () => {
          await loadConfig();
        };
        fetchConfig();
      }, []);
    const [formData, setFormData] = useState({
        fileType: '',
        fileName: '',
        fileSize: '',
        lastUpdated: ''
    });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const updatedFormData = {
                fileType: selectedFile.type,
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                lastUpdated: new Date().toISOString()
            };
            setFile(selectedFile);
            setFormData(updatedFormData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/attachments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const savedAttachment = await response.json();
                setMessage({type: 'success', text: 'Your Attachments profile has successfully been updated'});
                console.log('Attachment saved:', savedAttachment);
            } else {
                console.error('Failed to save attachment:', response.statusText);
                setMessage({type: 'error', text: 'Failed to save the updates. Please try again!'});
            }
        } catch (error) {
            console.error('Error saving attachment:', error);
        }
    };

    return (
        <>
            <Profile />
            {message.text && (
                <div className={`mt-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className='max-w-7xl mx-auto'>
                <FormSection title='Attachments'>
                    <div className='grid grid-cols-3 gap-4'>
                        <div className='flex items-center'>
                            <input type='file' onChange={handleFileChange} className='border border-gray-400 p-2 rounded-sm h-12 w-full' />
                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 text-right pr-4'>
                                File Type:
                            </label>
                            <input
                                type='text'
                                name='fileType'
                                value={formData.fileType}
                                readOnly
                                className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                            />
                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 text-right pr-4'>
                                File Name:
                            </label>
                            <input
                                type='text'
                                name='fileName'
                                value={formData.fileName}
                                readOnly
                                className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                            />
                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 text-right pr-4'>
                                File Size:
                            </label>
                            <input
                                type='text'
                                name='fileSize'
                                value={formData.fileSize}
                                readOnly
                                className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                            />
                        </div>
                        <div className='flex items-center'>
                            <label className='w-40 text-right pr-4'>
                                Last Updated:
                            </label>
                            <input
                                type='text'
                                name='lastUpdated'
                                value={formData.lastUpdated}
                                readOnly
                                className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                            />
                        </div>
                    </div>
                </FormSection>
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

export default FormComponent;
