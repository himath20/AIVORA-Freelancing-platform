const express = require('express');
const router = express.Router();

const { getAllServices } = require('../controllers/serviceController');

// Get all AI services
router.get('/', getAllServices);

module.exports = router;