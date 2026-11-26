const express = require('express');
const router = express.Router();

const {
    addProjectSkill,
    getProjectSkills
} = require('../controllers/projectSkillController');

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/:projectId', verifyToken, addProjectSkill);
router.get('/:projectId', verifyToken, getProjectSkills);

module.exports = router;