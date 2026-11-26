const express = require('express');
const router = express.Router();

const {
    addFreelancerService,
    getFreelancerServices,
    removeFreelancerService
} = require('../controllers/freelancerServiceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, addFreelancerService);
router.get('/', verifyToken, getFreelancerServices);
router.delete('/:serviceId', verifyToken, removeFreelancerService);

module.exports = router;