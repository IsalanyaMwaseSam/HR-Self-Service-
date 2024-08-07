const vacancyModel = require('../models/vacancyModel');

console.log('vacancyModel:', vacancyModel);

exports.getVacancies = async (req, res) => {
    
  try {
    const vacancies = await vacancyModel.fetchVacancies();
    res.status(200).json(vacancies);
  } catch (error) {
    console.error('Error fetching vacancies:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
