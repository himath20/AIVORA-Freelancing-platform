const express = require('express');
const router = express.Router();

const {
    submitProposal,
    getProjectProposals
} = require('../controllers/proposalController');

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/:projectId', verifyToken, submitProposal);
router.get('/:projectId', verifyToken, getProjectProposals);

module.exports = router;