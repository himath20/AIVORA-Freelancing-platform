const express = require('express');
const router = express.Router();

const {
    addProjectRequirement,
    getProjectRequirements
} = require('../controllers/projectRequirementController');

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/:projectId', verifyToken, addProjectRequirement);
router.get('/:projectId', verifyToken, getProjectRequirements);

module.exports = router;