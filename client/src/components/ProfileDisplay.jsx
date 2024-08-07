import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import FormSection from './FormSection';
import { loadConfig, getBackendUrl } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 

const ProfileDisplay = () => {
    const [profileData, setProfileData] = useState(null);
    const backendUrl = getBackendUrl();
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchConfig = async () => {
            await loadConfig();
        };
        fetchConfig();
    }, []);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${backendUrl}/api/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (!data || Object.keys(data).length === 0) {
                        handleNoProfileData();
                    } else {
                        setProfileData(data);
                    }
                } else {
                    console.error('Failed to fetch profile data:', response.statusText);
                    handleNoProfileData();
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                handleNoProfileData();
            }
        };

        fetchProfileData();
    }, []);

    const handleNoProfileData = () => {
        toast.error("You haven't updated your profile yet. Please do so before continuing.");
        setTimeout(() => {
            navigate('/profile/personal'); 
        }, 3000); // Delay for 3 seconds to show the toast message
    };

    if (!profileData) {
        return (
            <>
                <ToastContainer />
                <p className="text-center text-gray-500">Loading profile data...</p>
            </>
        );
    }

    return (
        <div>
            <ToastContainer />
            <Profile /> 
            <FormSection title="Personal Information" defaultExpanded={true}>
                <div className="space-y-6">
                    <div className="text-lg font-semibold border-b pb-2 mb-4">
                        Personal Information
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="font-medium">First Name:</p>
                            <p>{profileData.personal?.firstName}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Middle Name:</p>
                            <p>{profileData.personal?.middleName}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Last Name:</p>
                            <p>{profileData.personal?.lastName}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Email:</p>
                            <p>{profileData.personal?.alternativeEmail}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Date Of Birth:</p>
                            <p>{profileData.personal?.dob}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Country:</p>
                            <p>{profileData.personal?.country}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Nationality:</p>
                            <p>{profileData.personal?.nationality}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Gender:</p>
                            <p>{profileData.personal?.gender}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Street:</p>
                            <p>{profileData.personal?.street}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">House Name/No:</p>
                            <p>{profileData.personal?.houseNumber}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Town:</p>
                            <p>{profileData.personal?.town}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">City:</p>
                            <p>{profileData.personal?.city}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Postal Code:</p>
                            <p>{profileData.personal?.postalCode}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Phone Number:</p>
                            <p>{profileData.personal?.phoneNumber}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Alternative Phone Number:</p>
                            <p>{profileData.personal?.alternativePhoneNumber}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">Availability:</p>
                            <p>{profileData.personal?.availability}</p>
                        </div>
                    </div>
                </div>
            </FormSection>

            <FormSection title="Education">
                <div className="space-y-6">
                    <div className="text-lg font-semibold border-b pb-2 mb-4">
                        Education
                    </div>
                    {profileData.education?.map((edu) => (
                        <div key={edu.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="font-medium">Institution:</p>
                                <p>{edu.institution}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Degree Awarded:</p>
                                <p>{edu.degree}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Country:</p>
                                <p>{edu.country}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Degree/Diploma Title:</p>
                                <p>{edu.title}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">From:</p>
                                <p>{edu.startDate}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">To:</p>
                                <p>{edu.endDate}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Degree/Diploma Level:</p>
                                <p>{edu.level}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Degree/Diploma Subject:</p>
                                <p>{edu.subject}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Certificate Name:</p>
                                <p>{edu.certificateName}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Issuing Institution:</p>
                                <p>{edu.issuingInstitution}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Registration Number:</p>
                                <p>{edu.registrationNumber}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Year Of Issue:</p>
                                <p>{edu.yearOfIssue}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FormSection>

            <FormSection title="Skills">
                <div className="space-y-6">
                    <div className="text-lg font-semibold border-b pb-2 mb-4">
                        Skills
                    </div>
                    {profileData.skills?.map((skill) => (
                        <div key={skill.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="font-medium">Description Of Skill:</p>
                                <p>{skill.skillDescription}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Years Of Experience:</p>
                                <p>{skill.yearsOfExperience}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FormSection>

            <FormSection title="Experience">
                <div className="space-y-6">
                    <div className="text-lg font-semibold border-b pb-2 mb-4">
                        Experience
                    </div>
                    {profileData.experience?.map((exp) => (
                        <div key={exp.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="font-medium">Employer's Name:</p>
                                <p>{exp.employerName}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Area of Work:</p>
                                <p>{exp.workArea}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Functional Title:</p>
                                <p>{exp.functionalTitle}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">From:</p>
                                <p>{exp.fromDate}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">To:</p>
                                <p>{exp.endDate}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Country:</p>
                                <p>{exp.country}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Number of Employees Supervised:</p>
                                <p>{exp.noOfEmployeesSupervised}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Description of Duties:</p>
                                <p>{exp.descriptionOfDuties}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Major Achievements:</p>
                                <p>{exp.majorAchievements}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Reasons for Leaving:</p>
                                <p>{exp.leavingReasons}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FormSection>

            <FormSection title="Languages">
                <div className="space-y-6">
                    <div className="text-lg font-semibold border-b pb-2 mb-4">
                        Languages
                    </div>
                    {profileData.languages?.map((lang) => (
                        <div key={lang.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="font-medium">Language:</p>
                                <p>{lang.languageName}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Reading Ability:</p>
                                <p>{lang.readingAbility}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Writing Ability:</p>
                                <p>{lang.writingAbility}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Speaking Ability:</p>
                                <p>{lang.speakingAbility}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FormSection>

            <FormSection title="Attachments">
                <div className="space-y-6">
                    <div className="text-lg font-semibold border-b pb-2 mb-4">
                        Attachments
                    </div>
                    {profileData.attachments?.map((attachment) => (
                        <div key={attachment.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="font-medium">File Type:</p>
                                <p>{attachment.fileType}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">File Name:</p>
                                <p>{attachment.fileName}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">File Size:</p>
                                <p>{attachment.fileSize}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">Last Updated:</p>
                                <p>{attachment.lastUpdated}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FormSection>
        </div>
    );
};

export default ProfileDisplay;
