const express = require('express');
const router = express.Router();

const {
    createProject,
    getClientProjects,
    updateProject
} = require('../controllers/projectController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getClientProjects);
router.put('/:projectId', verifyToken, updateProject);

module.exports = router;