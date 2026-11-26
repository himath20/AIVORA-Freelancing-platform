const express = require('express');
const router = express.Router();

const { getAllSkills } = require('../controllers/skillController');

// Get all skills
router.get('/', getAllSkills);

module.exports = router;