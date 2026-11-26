const express = require('express');
const router = express.Router();

const { getAllCategories } = require('../controllers/categoryController');

// Get all AI categories
router.get('/', getAllCategories);

module.exports = router;