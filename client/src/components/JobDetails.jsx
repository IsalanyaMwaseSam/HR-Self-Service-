import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../shared/NavBar';
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { loadConfig, getBackendUrl } from '../config';

const JobDetails = () => {
  const navigate = useNavigate();
  const { vacancyCode } = useParams();
  console.log('Vacancy Code in JobDetails:', vacancyCode);
  const [loading, setLoading] = useState(true); 
  const [jobDetail, setJobDetail] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    jobInfo: true,
    qualifications: true,
    roles: true,
    skills: true,
    certificates: true,
    languages: true
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchConfig = async () => {
      await loadConfig();
    };
    fetchConfig();
  }, []);

  const handleApply = () => {
    navigate(`/apply/${vacancyCode}`);
  };

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/jobDetails/${vacancyCode}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJobDetail(data);
        console.log('Job Detail Data:', data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchJobDetail();
  }, [vacancyCode]);

  const handleShareClick = () => {
    setShowDropdown(prev => !prev);
  };


  const handleShare = (platform) => {
    const link = window.location.href;
    let url;
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(link)}`;
        break;
      case 'email':
        url = `mailto:?subject=Check%20this%20out&body=${encodeURIComponent(link)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank');
  };

  const toggleSection = (section) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>@media print { .no-print { display: none; } .print-hide { display: none; } }</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(document.querySelector('#printable-content').innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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

              <div className="mt-6 flex items-center ml-4">
              <div className="relative flex items-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded no-print" onClick={handleShareClick}>
                  Share
                </button>
                {showDropdown && (
                  <div className="absolute left-0 mt-40 bg-white border border-gray-200 shadow-lg rounded w-48">
                    <button className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left" onClick={() => handleShare('linkedin')}>
                      Share on LinkedIn
                    </button>
                    <button className="block px-4 py-2 text-green-500 hover:bg-gray-100 w-full text-left" onClick={() => handleShare('whatsapp')}>
                      Share on WhatsApp
                    </button>
                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left" onClick={() => handleShare('email')}>
                      Share via Email
                    </button>
                  </div>
                )}
              </div>
              <div className="ml-4 flex space-x-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded no-print" onClick={handlePrint}>Print</button>
                <button 
                  className="bg-yellow-500 text-white px-4 py-2 rounded no-print"
                  onClick={handleApply}
                >
                  Apply
                </button>
              </div>
            </div>


              <div className="mt-10 text-orange-500 print-hide">
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              </div>

              <section className="mb-4 mt-8">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('roles')}>
                  <div className="flex items-center">
                    {expandedSections.roles ? <IoMdArrowDropup className="mr-2 print-hide" /> : <IoMdArrowDropdown className="mr-2 print-hide" />}
                    <h3 className="text-xl font-semibold">Roles and Responsibilities</h3>
                  </div>
                </div>

                {expandedSections.roles && (
                  jobDetail.rolesAndResponsibilities.length > 0 ? (
                    <ul className="ml-16 list-disc mt-4">
                      <h4 className="font-bold mt-4 ml-14">Key Responsibilities</h4>
                      {jobDetail.rolesAndResponsibilities.map((item, index) => (
                        <li key={index}>{item.rolesandResponsibilities}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-4">No specified roles and responsibilities for the job.</p>
                  )
                )}
              </section>

              <section className="mb-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('skills')}>
                  <div className="flex items-center">
                    {expandedSections.skills ? <IoMdArrowDropup className="mr-2 print-hide" /> : <IoMdArrowDropdown className="mr-2 print-hide" />}
                    <h3 className="text-xl font-semibold">Skills</h3>
                  </div>
                </div>
                {expandedSections.skills && (
                  jobDetail.positionSkills.length > 0 ? (
                    <ul className="ml-16 list-disc">
                      {jobDetail.positionSkills.map((item, index) => (
                        <li key={index}>{item.skillDescription}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-4">No specified skills for the job.</p>
                  )
                )}
              </section>

              <section className="mb-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('qualifications')}>
                  <div className="flex items-center">
                    {expandedSections.qualifications ? <IoMdArrowDropup className="mr-2 print-hide" /> : <IoMdArrowDropdown className="mr-2 print-hide" />}
                    <h3 className="text-xl font-semibold">Qualifications</h3>
                  </div>
                </div>
                {expandedSections.qualifications && (
                  <ul className="ml-16 list-disc">
                    {jobDetail.employeePositionQualifications.map((item, index) => (
                      <li key={index}>
                        <li><div>{item.qualificationCategoryCode}</div></li>
                        <li><div>{item.fieldofStudy}</div></li>
                        <li><div>{item.minimumlevelofEducation}</div></li>
                        <li><div>Years of experience: {item.yearsofExperience}</div></li>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="mb-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('certificates')}>
                  <div className="flex items-center">
                    {expandedSections.certificates ? <IoMdArrowDropup className="mr-2 print-hide" /> : <IoMdArrowDropdown className="mr-2 print-hide" />}
                    <h3 className="text-xl font-semibold">Certificates</h3>
                  </div>
                </div>
                {expandedSections.certificates && (
                  jobDetail.positionCertificate.length > 0 ? (
                    <ul className="ml-16 list-disc">
                      {jobDetail.positionCertificate.map((item, index) => (
                        <li key={index}>{item.certificateCode}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-4">No specified certificates for the job.</p>
                  )
                )}
              </section>

              <section className="mb-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('languages')}>
                  <div className="flex items-center">
                    {expandedSections.languages ? <IoMdArrowDropup className="mr-2 print-hide" /> : <IoMdArrowDropdown className="mr-2 print-hide" />}
                    <h3 className="text-xl font-semibold">Languages</h3>
                  </div>
                </div>
                {expandedSections.languages && (
                  jobDetail.positionLanguages.length > 0 ? (
                    <ul className="ml-16 list-disc">
                      {jobDetail.positionLanguages.map((item, index) => (
                        <li key={index}>{item.languageCode}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-4">No specified languages for the job.</p>
                  )
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetails;
