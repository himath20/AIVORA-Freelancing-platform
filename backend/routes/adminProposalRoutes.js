const express = require('express');
const router = express.Router();

const {
    getAllProposals,
    getProposalById,
    updateProposalStatus
} = require('../controllers/adminProposalController');

const { verifyToken } = require('../middleware/authMiddleware');

// Get all proposals
router.get('/', verifyToken, getAllProposals);

// Get proposal details
router.get('/:proposalId', verifyToken, getProposalById);

// Update proposal status
router.put('/:proposalId/status', verifyToken, updateProposalStatus);

module.exports = router;
