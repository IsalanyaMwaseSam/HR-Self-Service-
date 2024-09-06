const express = require('express');
const router = express.Router();
const JobsController = require('../controllers/postedJobController');


router.post('/create-job', JobsController.createPostedJob);

router.get('/post-jobs', JobsController.getPostedJobsWithCriteria);

module.exports = router;
