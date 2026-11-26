const express = require('express');
const router = express.Router();

const {
    addFreelancerSkill,
    getFreelancerSkills,
    removeFreelancerSkill
} = require('../controllers/freelancerSkillController');

const { verifyToken } = require('../middleware/authMiddleware');

// Add freelancer skill
router.post('/', verifyToken, addFreelancerSkill);

// Get freelancer skills
router.get('/', verifyToken, getFreelancerSkills);

// Remove freelancer skill
router.delete('/:skillId', verifyToken, removeFreelancerSkill);

module.exports = router;