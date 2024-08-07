const fetch = require('node-fetch'); 

async function fetchVacancies() {
  try {
    const response = await fetch('http://20.87.21.82:9048/HRSuite/api/hrsuite/hrmodule/v2.0/vacancies', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Log and provide a detailed error message
      const errorText = await response.text();
      throw new Error(`Failed to fetch vacancies: ${response.status} ${response.statusText}, ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching vacancies: ${error.message}`);
  }
}

module.exports = {
  fetchVacancies
};
