const express = require('express');
const router = express.Router();

const {
    getAllSkills,
    getSkillById,
    updateSkill
} = require('../controllers/adminSkillController');

const { verifyToken } = require('../middleware/authMiddleware');

// Get all skills
router.get('/', verifyToken, getAllSkills);

// Get one skill
router.get('/:skillId', verifyToken, getSkillById);

// Update skill
router.put('/:skillId', verifyToken, updateSkill);

module.exports = router;
