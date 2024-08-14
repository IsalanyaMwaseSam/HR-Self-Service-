const express = require('express');
const { createApplicationHandler, getApplicationsHandler } = require('../controllers/myApplicationsController');
const { getApplicationById } = require('../controllers/viewApplicationsController');
const {updateApplicationHandler} = require('../controllers/updateApplicationController')
const { deleteApplicationHandler } =  require('../controllers/deleteApplicationController')
const verifyToken = require('../middlweware/verifyToken')
const router = express.Router();


router.post('/my-applications', verifyToken, createApplicationHandler);
router.get('/my-applications', verifyToken, getApplicationsHandler);
router.post('/my-applications/:id', verifyToken, getApplicationById );
router.delete('/my-applications/delete/:id', verifyToken, deleteApplicationHandler)
router.put('/my-applications/update/:id', verifyToken, updateApplicationHandler);

module.exports = router;
