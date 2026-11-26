const express = require('express');
const router = express.Router();

const { acceptProposal } = require('../controllers/assignmentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.put('/accept/:proposalId', verifyToken, acceptProposal);

module.exports = router;