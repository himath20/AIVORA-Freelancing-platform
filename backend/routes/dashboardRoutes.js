const express = require('express');
const router = express.Router();

const {
    getFreelancerDashboard,
    getClientDashboard,
    getAdminDashboard
} = require('../controllers/dashboardController');

const { verifyToken } = require('../middleware/authMiddleware');

// Freelancer Dashboard
router.get('/freelancer', verifyToken, getFreelancerDashboard);

// Client Dashboard
router.get('/client', verifyToken, getClientDashboard);

// Admin Dashboard
router.get('/admin', verifyToken, getAdminDashboard);

module.exports = router;
