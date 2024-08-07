import React, { useState, useMemo, useEffect } from 'react'
import FormSection from './FormSection';
import Profile from './Profile';
import { TbChevronsRight } from "react-icons/tb";
import { useCountries } from 'use-react-countries';
import { loadConfig, getBackendUrl } from '../config';

const Personal = () => {
  const { countries } = useCountries();
  const sortedCountries = useMemo(() => {
    return countries.sort((a, b) => a.name.localeCompare(b.name));
  }, [countries]);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    nationality: '',
    gender: '',
    street: '',
    houseNumber: '',
    town: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    alternativePhoneNumber: '',
    email: '',
    alternativeEmail: '',
    availability: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/personal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setMessage({ type: 'success', text: 'Personal information saved successfully!' });
      console.log('Data saved successfully:', result);
      
    } catch (error) {
      console.error('Error saving data:', error);
      setMessage({ type: 'error', text: 'Error saving data. Please try again.' });
    }
  };

  return (
    <>
      <Profile />
      <form onSubmit={handleSubmit} className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {message.text && (
          <div className={`mt-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
        <FormSection title="General Information * " defaultExpanded={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Adjusted grid columns for different screen sizes */}
            <div className="flex items-center">
              <label className="w-full md:w-40 flex items-center justify-end pr-4">
                First Name
                <p className="text-red-600 ml-1">*</p>:
              </label>
              <input
                required
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-sm h-8 w-full md:w-48"
              />
            </div>
            <div className="flex items-center">
              <label className="w-full md:w-40 text-right pr-4">Middle Name:</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-sm h-8 w-full md:w-48"
              />
            </div>
            <div className="flex items-center">
              <label className="w-full md:w-40 flex items-center justify-end pr-4">
                Last Name:
                <p className="text-red-600 ml-1">*</p>
              </label>
              <input
                required
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-sm h-8 w-full md:w-48"
              />
            </div>

            <div className="flex items-center">
              <label className="w-full md:w-40 text-right pr-4">Date Of Birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-sm h-8 w-full md:w-48"
              />
            </div>
            <div className="flex items-center">
              <label className="w-full md:w-40 text-right pr-4">Nationality:</label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-sm h-10 w-full md:w-48"
              >
                <option value="">Select Nationality</option>
                {sortedCountries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="w-full md:w-40 text-right pr-4">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-sm h-9 w-full md:w-48"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </FormSection>

        <FormSection title='Current Address'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center'>
                <label className='w-full md:w-1/3 text-right pr-4'>Street:</label>
                <input
                  type='text'
                  name='street'
                  value={formData.street}
                  onChange={handleChange}
                  className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                />
              </div>
              <div className='flex items-center'>
                <label className='w-full md:w-1/3 text-right pr-4'>House Name/No:</label>
                <input
                  type='text'
                  name='houseNumber'
                  value={formData.houseNumber}
                  onChange={handleChange}
                  className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                />
              </div>
              <div className='flex items-center'>
                <label className='w-full md:w-1/3 text-right pr-4'>Town/Province/State:</label>
                <input
                  type='text'
                  name='town'
                  value={formData.town}
                  onChange={handleChange}
                  className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                />
              </div>
            </div>
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center'>
                <label className='w-full md:w-1/3 text-right pr-4'>City:</label>
                <input
                  type='text'
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                />
              </div>
              <div className='flex items-center'>
                <label className='w-full md:w-1/3 text-right pr-4'>Postal Code:</label>
                <input
                  type='text'
                  name='postalCode'
                  value={formData.postalCode}
                  onChange={handleChange}
                  className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                />
              </div>
            </div>
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center'>
                <label className='w-full md:w-1/3 text-right pr-4'>Country:</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border border-gray-400 p-2 rounded-sm h-10 w-full"
                >
                  <option value="">Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title='Contact Details'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center'>
                <label className='w-full md:w-1/3 text-right pr-4'>Phone Number:
                  <p className="text-red-600 ml-1">*</p>
                </label>
                <input
                  required
                  type='text'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                />
              </div>
              <div className='flex items-center'>
                <label className='w-full md:w-1/3 text-right pr-4'>Alternative Phone Number:</label>
                <input
                  type='text'
                  name='alternativePhoneNumber'
                  value={formData.alternativePhoneNumber}
                  onChange={handleChange}
                  className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                />
              </div>
            </div>
            <div className='flex flex-col space-y-4'>
              <div className='flex items-center'>
                <label className='w-full md:w-1/3 text-right pr-4'>Email:</label>
                <input
                  required
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                />
              </div>
              <div className='flex items-center'>
                <label className='w-full md:w-1/3 text-right pr-4'>Alternative Email:</label>
                <input
                  type='email'
                  name='alternativeEmail'
                  value={formData.alternativeEmail}
                  onChange={handleChange}
                  className='border border-gray-400 p-2 rounded-sm h-6 w-full'
                />
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title='Availability'>
          <div className='flex flex-col space-y-4'>
            <div className='flex items-center'>
              <label className='w-full md:w-40 text-right pr-4'>
                Availability (Minimum notice in days):
              </label>
              <input
                required
                type='number'
                name='availability'
                value={formData.availability}
                onChange={handleChange}
                className='border border-gray-400 p-2 rounded-sm h-6 w-full md:w-48'
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
  )
}

export default Personal
