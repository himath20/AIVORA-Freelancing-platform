const express = require('express');
const router = express.Router();

const {
    getAllProjects,
    getProjectById,
    updateProjectStatus
} = require('../controllers/adminProjectController');

const { verifyToken } = require('../middleware/authMiddleware');

// Get all projects
router.get('/', verifyToken, getAllProjects);

// Get project details
router.get('/:projectId', verifyToken, getProjectById);

// Update project status
router.put('/:projectId/status', verifyToken, updateProjectStatus);

module.exports = router;