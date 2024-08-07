import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../shared/NavBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadConfig, getBackendUrl } from '../config';

const Dropdown = ({ selectedValue, handleChange }) => (
  <div className='flex flex-col'>
    <label className='w-full'>Source:</label>
    <select
      name='source'
      value={selectedValue}
      onChange={handleChange}
      className='border border-gray-400 p-2 rounded-sm'
    >
      <option value='None'>None</option>
      <option value='friend'>Friend</option>
      <option value='google advert'>Google Advert</option>
      <option value='social media advert'>Social Media</option>
      <option value='Our Site'>Our Site</option>
    </select>
  </div>
);

const FileList = ({ files }) => (
  files.length > 0 && (
    <div className="mt-4">
      <ul>
        {files.map((file, index) => {
          try {
            const fileURL = URL.createObjectURL(file);
            return (
              <li key={index}>
                <a href={fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {file.name}
                </a>
              </li>
            );
          } catch (error) {
            console.error('Error creating file URL:', error);
            return null;
          }
        })}
      </ul>
    </div>
  )
);

const Application = () => {
  const { vacancyCode } = useParams();
  console.log('Vacancy Code from useParams:', vacancyCode);
  const [loading, setLoading] = useState(true);
  const [jobDetail, setJobDetail] = useState(null);
  const [error, setError] = useState(null);
  const [selectedValue, setSelectedValue] = useState('None');
  const [coverLetterFiles, setCoverLetterFiles] = useState([]);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [otherFiles, setOtherFiles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const backendUrl = getBackendUrl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem(`applicationData-${vacancyCode}`);
    if (savedData) {
      const { selectedValue, coverLetterFiles, resumeFiles, otherFiles } = JSON.parse(savedData);
      setSelectedValue(selectedValue || 'None');
      if (Array.isArray(coverLetterFiles)) {
        setCoverLetterFiles(coverLetterFiles.map(fileData => new File([fileData], fileData.name)));
      }
      if (Array.isArray(resumeFiles)) {
        setResumeFiles(resumeFiles.map(fileData => new File([fileData], fileData.name)));
      }
      if (Array.isArray(otherFiles)) {
        setOtherFiles(otherFiles.map(fileData => new File([fileData], fileData.name)));
      }
    }
  }, [vacancyCode]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const dataToSave = {
        selectedValue,
        coverLetterFiles: coverLetterFiles.map(file => ({ name: file.name })),
        resumeFiles: resumeFiles.map(file => ({ name: file.name })),
        otherFiles: otherFiles.map(file => ({ name: file.name }))
      };
      localStorage.setItem(`applicationData-${vacancyCode}`, JSON.stringify(dataToSave));
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [selectedValue, coverLetterFiles, resumeFiles, otherFiles, vacancyCode]);

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!vacancyCode) {
        console.error('vacancyCode is undefined');
        return;
      }
  
      try {
        const response = await fetch(`${backendUrl}/api/jobDetails/${vacancyCode}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Job detail data:', data);
        setJobDetail(data);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobDetail();
  }, [vacancyCode, backendUrl]);

  const handleFileChange = (event, setFiles) => {
    const files = Array.from(event.target.files).filter(file => file instanceof File);
    setFiles(files);
  };

  const handleShareClick = () => {
    setShowDropdown(prev => !prev);
  };

  const handleShare = (platform) => {
    const link = window.location.href;
    let url;
    switch (platform) {
      case 'email':
        url = `mailto:?subject=Check%20this%20out&body=${encodeURIComponent(link)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank');
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>@media print { .no-print { display: none; } .print-hide { display: none; } }</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(document.querySelector('#printable-content').innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      localStorage.setItem('showNotification', 'true'); // Set flag to show notification on the next page
      event.returnValue = ''; // Prevent default browser prompt
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleApply = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('vacancyCode', jobDetail.vacancyCode);
      formData.append('selectedValue', selectedValue);
      coverLetterFiles.forEach((file) => {
        formData.append('coverLetterFiles', file);
      });
      resumeFiles.forEach((file) => {
        formData.append('resumeFiles', file);
      });
      otherFiles.forEach((file) => {
        formData.append('otherFiles', file);
      });

      const response = await fetch(`${backendUrl}/api/apply/${vacancyCode}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      toast.success('Application submitted successfully');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false); // Reset isSubmitting state
    }
  };

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

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

  if (!jobDetail) {
    return null;
  }

  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 mt-6">
        <div className="w-full md:w-4/5 lg:w-3/4 bg-white shadow-md rounded-lg mt-32">
          <div className="p-6 mt-16">
            <h2 className="text-2xl font-bold mb-6">Job Details</h2>
            <div id="printable-content">
              <section className="mb-4">
                <div className="ml-4">
                  <section className="mb-4">
                    <div className="flex items-center">
                      <p className="font-semibold w-1/4">Vacancy Code</p>
                      <p className="w-3/4">{jobDetail.vacancyCode}</p>
                    </div>
                  </section>

                  <section className="mb-4">
                    <div className="flex items-center">
                      <p className="font-semibold w-1/4">Department</p>
                      <p className="w-3/4">{jobDetail.orgDepartment}</p>
                    </div>
                  </section>

                  <section className="mb-4">
                    <div className="flex items-center">
                      <p className="font-semibold w-1/4">Duty Station</p>
                      <p className="w-3/4">{jobDetail.dutyStation}</p>
                    </div>
                  </section>

                  <section className="mb-4">
                    <div className="flex items-center">
                      <p className="font-semibold w-1/4">Contract Type</p>
                      <p className="w-3/4">{jobDetail.contractType}</p>
                    </div>
                  </section>

                  <section className="mb-4">
                    <div className="flex items-center">
                      <p className="font-semibold w-1/4">Application Period</p>
                      <p className="w-3/4">{jobDetail.applicationPeriod}</p>
                    </div>
                  </section>
                </div>
              </section>

              <div className="mt-6 ml-4">
                <h3 className="text-2xl font-bold mb-6">How did you get to know about this Vacancy</h3>
                <Dropdown selectedValue={selectedValue} handleChange={handleChange} />
              </div>
              
              <div className="mt-6 ml-4">
                <h3 className="text-2xl font-bold mb-6">Attachments</h3>
                <p>Please upload any files you would like to include with your application here. If you have previously uploaded any files to your applications, you can choose to attach them to this application below.</p>
                
                <div className="mt-4">
                  <p className='font-bold'>Cover Letter</p>
                  <input 
                      type="file" 
                      onChange={(event) => handleFileChange(event, setCoverLetterFiles)} 
                      multiple 
                      className="mt-4"
                  />
                  <FileList files={coverLetterFiles} />
                </div>

                <div className="mt-4">
                  <p className='font-bold'>Resume/CV</p>
                  <input 
                      type="file" 
                      onChange={(event) => handleFileChange(event, setResumeFiles)} 
                      multiple 
                      className="mt-4"
                  />
                  <FileList files={resumeFiles} />
                </div>

                <div className="mt-4">
                  <p className='font-bold'>Other Files</p>
                  <input 
                      type="file" 
                      onChange={(event) => handleFileChange(event, setOtherFiles)} 
                      multiple 
                      className="mt-4"
                  />
                  <FileList files={otherFiles} />
                </div>
              </div>

              <div className="relative flex items-center space-x-4 mt-8 ml-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded no-print" onClick={handleShareClick}>
                  Share
                </button>
                {showDropdown && (
                  <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 shadow-lg rounded w-48">
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left" onClick={() => handleShare('email')}>
                      Share via Email
                    </button>
                  </div>
                )}
                <button className="bg-green-500 text-white px-4 py-2 rounded no-print" onClick={handlePrint}>
                  Print
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded no-print" onClick={handleApply} disabled={isSubmitting}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Application;
