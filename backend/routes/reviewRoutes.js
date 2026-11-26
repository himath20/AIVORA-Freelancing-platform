const express = require('express');
const router = express.Router();

const { createReview } = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/:projectId', verifyToken, createReview);

module.exports = router;