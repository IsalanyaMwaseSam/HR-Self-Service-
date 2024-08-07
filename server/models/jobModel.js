const fetch = require('node-fetch');

const jobUrl = `http://20.87.21.82:9048/HRSuite/api/hrsuite/hrmodule/v2.0/vacancies`;
const urls = {
  rolesAndResponsibilities: 'http://20.87.21.82:9048/HRSuite/api/hrsuite/hrmodule/v2.0/rolesandResponsibilites',
  positionSkills: 'http://20.87.21.82:9048/HRSuite/api/hrsuite/hrmodule/v2.0/positionSkills',
  employeePositionQualification: 'http://20.87.21.82:9048/HRSuite/api/hrsuite/hrmodule/v2.0/employeePositionQualifications',
  positionCertificate: 'http://20.87.21.82:9048/HRSuite/api/hrsuite/hrmodule/v2.0/positionCertificate',
  positionLanguages: 'http://20.87.21.82:9048/HRSuite/api/hrsuite/hrmodule/v2.0/positionLanguages'
};

const fetchApiData = async (url, authHeaders) => {
  const response = await fetch(url, { headers: authHeaders });
  const data = await response.json();
  console.log(`Data from ${url}:`, data);
  return data.value; 
};


const getJobDetails = async (vacancyCode, authHeaders) => {
  const response = await fetch(jobUrl, { headers: authHeaders });
  const jobData = await response.json();
  const jobDetail = jobData.value.find(job => job.vacancyCode === vacancyCode);

  if (!jobDetail) {
    throw new Error('Job not found');
  }

  const [
    rolesAndResponsibilitiesData,
    positionSkillsData,
    employeePositionQualificationData,
    positionCertificateData,
    positionLanguagesData
  ] = await Promise.all(
    Object.values(urls).map(url => fetchApiData(url, authHeaders))
  );

  const filterByPositionCode = (data) => {
    if (!Array.isArray(data)) {
      console.error('Expected an array but received:', data);
      return []; // Return an empty array if data is not an array
    }
    return data.filter(item => item.positionCode === jobDetail.positionCode);
  };

  return {
    ...jobDetail,
    rolesAndResponsibilities: filterByPositionCode(rolesAndResponsibilitiesData),
    positionSkills: filterByPositionCode(positionSkillsData),
    employeePositionQualifications: filterByPositionCode(employeePositionQualificationData),
    positionCertificate: filterByPositionCode(positionCertificateData),
    positionLanguages: filterByPositionCode(positionLanguagesData)
  };
};


module.exports = {
  getJobDetails
};
