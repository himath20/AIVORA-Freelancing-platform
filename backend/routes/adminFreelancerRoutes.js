const express = require('express');
const router = express.Router();

const {
    getAllFreelancers,
    getFreelancerById,
    updateFreelancerStatus
} = require('../controllers/adminFreelancerController');

const { verifyToken } = require('../middleware/authMiddleware');

// Get all freelancers
router.get('/', verifyToken, getAllFreelancers);

// Get one freelancer
router.get('/:freelancerId', verifyToken, getFreelancerById);

// Activate or deactivate a freelancer
router.put('/:freelancerId/status', verifyToken, updateFreelancerStatus);

module.exports = router;
