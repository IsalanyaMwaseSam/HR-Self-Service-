const express = require('express');
const router = express.Router();
const vacancyController = require('../controllers/vacancyController'); 

console.log('vacancyController:', vacancyController);



router.get('/vacancies', vacancyController.getVacancies);

module.exports = router;
