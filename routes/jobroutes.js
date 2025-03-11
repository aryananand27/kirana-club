const express = require('express');
const router = express.Router();
const { submitJob, getJobStatus } = require('../controllers/jcontroller');

router.post('/submit', submitJob);
router.get('/status', getJobStatus);

module.exports = router;
