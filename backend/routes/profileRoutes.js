const express = require('express');
const router = express.Router();

const {
    getUserProfile,
    updateUserProfile
} = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');

// Get logged-in user's profile
router.get('/me', verifyToken, getUserProfile);
// Update logged-in user's profile
router.put('/me', verifyToken, updateUserProfile);

module.exports = router;