const express = require('express');
const router = express.Router();

const {
    acceptProposal,
    getFreelancerAssignments
} = require('../controllers/assignmentController');

const { verifyToken } = require('../middleware/authMiddleware');

// Accept a proposal
router.put('/accept/:proposalId', verifyToken, acceptProposal);

// Get freelancer assignments
router.get('/freelancer', verifyToken, getFreelancerAssignments);

module.exports = router;