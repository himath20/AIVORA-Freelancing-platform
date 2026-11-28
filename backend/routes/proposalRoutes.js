const express = require('express');
const router = express.Router();

const {
    submitProposal,
    getProjectProposals,
    getFreelancerProposals
} = require('../controllers/proposalController');

const { verifyToken } = require('../middleware/authMiddleware');

// Submit a proposal
router.post('/:projectId', verifyToken, submitProposal);

// Get freelancer's own proposals
router.get('/freelancer', verifyToken, getFreelancerProposals);

// Get proposals for a client's project
router.get('/:projectId', verifyToken, getProjectProposals);

module.exports = router;