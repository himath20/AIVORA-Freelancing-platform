const express = require('express');
const router = express.Router();

const {
    getAllServices,
    getServiceById,
    updateService
} = require('../controllers/adminServiceController');

const { verifyToken } = require('../middleware/authMiddleware');

// Get all services
router.get('/', verifyToken, getAllServices);

// Get one service
router.get('/:serviceId', verifyToken, getServiceById);

// Update service
router.put('/:serviceId', verifyToken, updateService);

module.exports = router;
