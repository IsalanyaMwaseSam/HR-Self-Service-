import React, { useState, useEffect } from 'react';
import NavBar from '../shared/NavBar';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import DateRange from './DateRange';
import { loadConfig, getBackendUrl } from '../config';

function MyApplications() {
  const [showSearch, setShowSearch] = useState(false);
  const [userData, setUserData] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [vacanciesPerPage] = useState(10);
  const [jobCategories, setJobCategories] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [dutyStations, setDutyStations] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchJobCategory, setSearchJobCategory] = useState('');
  const [searchContractType, setSearchContractType] = useState('');
  const [searchDutyStation, setSearchDutyStation] = useState('');
  const [searchApplicationPeriod, setSearchApplicationPeriod] = useState([null, null]);
  const [loading, setLoading] = useState(true); 
  const backendUrl = getBackendUrl();

  useEffect(() => {
      const fetchConfig = async () => {
        await loadConfig();
      };
      fetchConfig();
    }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch(`${backendUrl}/api/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUserData(data.userData);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        setError(error.message);
      }
    };

    const addPostingAndClosingDate = (vacancies) => {
      return vacancies.map(vacancy => {
        const applicationPeriod = vacancy.applicationPeriod;
        const [startDate, endDate] = applicationPeriod.split("..").map(dateStr => dateStr.trim());

        const formattedStartDate = new Date(startDate.replace(/(\d+)(st|nd|rd|th)/, '$1'));
        const formattedEndDate = new Date(endDate.replace(/(\d+)(st|nd|rd|th)/, '$1'));

        return {
          ...vacancy,
          postingDate: formattedStartDate.toISOString(),
          closingDate: formattedEndDate.toISOString()
        };
      });
    };

    const fetchVacancies = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/vacancies`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch vacancies: ${response.status} ${response.statusText}, Details: ${errorText}`);
        }

        const data = await response.json();
        const vacanciesWithDates = addPostingAndClosingDate(data.value);

        const currentDate = new Date();
        const activeVacancies = vacanciesWithDates.filter(vacancy => new Date(vacancy.closingDate) >= currentDate);
        const sortedVacancies = activeVacancies.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));

        setVacancies(sortedVacancies);
        setFilteredVacancies(sortedVacancies);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching vacancies:', error.message);
        setError(error.message);
      }
    };

    const fetchDropdownData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/vacancies`);
        if (!response.ok) {
          throw new Error(`Failed to fetch dropdown data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setJobCategories([...new Set(data.value.map(vacancy => vacancy.orgDepartment))]);
        setContractTypes([...new Set(data.value.map(vacancy => vacancy.contractType))]);
        setDutyStations([...new Set(data.value.map(vacancy => vacancy.dutyStation))]);

      } catch (error) {
        console.error('Error fetching dropdown data:', error.message);
        setError(error.message);
      }
    };

    fetchUserData();
    fetchVacancies();
    fetchDropdownData();
  }, []);

  useEffect(() => {
    const filterVacancies = () => {
      const lowerCaseKeyword = searchKeyword.toLowerCase();

      const filtered = vacancies.filter(vacancy => {
        const [startDateStr, endDateStr] = searchApplicationPeriod;
        const startDate = startDateStr ? new Date(startDateStr) : null;
        const endDate = endDateStr ? new Date(endDateStr) : null;

        const matchesKeyword = lowerCaseKeyword === '' || Object.values(vacancy).join(' ').toLowerCase().includes(lowerCaseKeyword);
        const matchesCategory = searchJobCategory === '' || vacancy.orgDepartment === searchJobCategory;
        const matchesContractType = searchContractType === '' || vacancy.contractType === searchContractType;
        const matchesDutyStation = searchDutyStation === '' || vacancy.dutyStation === searchDutyStation;
        const matchesStartDate = !startDate || (new Date(vacancy.postingDate) >= startDate);
        const matchesEndDate = !endDate || (new Date(vacancy.closingDate) <= endDate);

        return matchesKeyword && matchesCategory && matchesContractType && matchesDutyStation && matchesStartDate && matchesEndDate;
      });

      setFilteredVacancies(filtered);
    };

    filterVacancies();
  }, [searchKeyword, searchJobCategory, searchContractType, searchDutyStation, vacancies, searchApplicationPeriod]);

  const indexOfLastVacancy = currentPage * vacanciesPerPage;
  const indexOfFirstVacancy = indexOfLastVacancy - vacanciesPerPage;
  const currentVacancies = filteredVacancies.slice(indexOfFirstVacancy, indexOfLastVacancy);

  const totalPages = Math.ceil(filteredVacancies.length / vacanciesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSearchJobCategory('');
    setSearchContractType('');
    setSearchDutyStation('');
    setSearchApplicationPeriod([null, null]);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="loading-container">
          <p className="loading-text">Loading...</p>
          <img src="/Spinner.gif" alt="Loading..." className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <NavBar userData={userData} />
      </div>

      {error && (
        <div className="mt-4 ml-8 sm:ml-36 text-red-600">
          <p>Error: {error}</p>
        </div>
      )}
      <div className="flex flex-1 overflow-auto " >
        <table className='min-w-[1200px] divide-y divide-gray-200 mt-40 ml-8 sm:ml-36 mr-8 sm:mr-36 shadow-lg'>
          <thead className='bg-gray-50'>
            <tr className='border-b-2 border-blue-600'>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>Title</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>Position Code</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>Department</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>Application Date</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>Application Deadline</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>Application Status</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>Vacancy Status</th>
              <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'>Action</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {currentVacancies.length > 0 ? (
              currentVacancies.map((vacancy) => (
                <tr key={vacancy.vacancyCode} className='hover:bg-gray-100'>
                  <td className='px-6 py-4 whitespace-nowrap text-blue-950'>
                    <Link to={`/job/${vacancy.vacancyCode}`} className='no-underline hover:text-blue-500 hover:no-underline'>{vacancy.jobTitle}</Link>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600 '>{vacancy.positionCode}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600'>{vacancy.dutyStation}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600'>{vacancy.applicationPeriod}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600'>{vacancy.closingDate}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600'>
                    <button className={`px-2 py-1 rounded ${vacancy.applicationStatus === 'Applied' ? 'bg-blue-500 text-white' : 
                    vacancy.applicationStatus === 'Longlisted' ? 'bg-yellow-500 text-white' : 
                    vacancy.applicationStatus === 'ShortListed' ? 'bg-green-500 text-white' : 
                    vacancy.applicationStatus === 'Interviewing' ? 'bg-orange-500 text-white' : 
                    vacancy.applicationStatus === 'BackgroundChecks' ? 'bg-purple-500 text-white' : 
                    vacancy.applicationStatus === 'VerifyingDocuments' ? 'bg-teal-500 text-white' : 
                    vacancy.applicationStatus === 'Onboarding' ? 'bg-pink-500 text-white' : 
                    'bg-red-500 text-white'}`}>
                      {vacancy.applicationStatus}
                    </button>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600'>{vacancy.vacancyStatus}</td>
                  <td>
                    <div className="flex space-x-3">
                      <button className='bg-green-500 text-white rounded-md w-10'>View</button>
                      <button className='bg-blue-500 text-white rounded-md w-12'>Update</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className='px-6 py-4 text-center text-red-500'>
                  No vacancies available at the moment. Please keep checking your notifications for job vacancies of your interest
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredVacancies.length > vacanciesPerPage && (
        <div className="flex justify-center mt-4">
          <nav className="relative z-0 inline-flex shadow-sm">
            <button
              onClick={() => paginate(currentPage - 1)}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === pageNumber ? 'text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

export default MyApplications;
