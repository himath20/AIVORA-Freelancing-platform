const express = require('express');
const router = express.Router();

const {
    createProject,
    getClientProjects,
    updateProject,
    browseProjects
} = require('../controllers/projectController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getClientProjects);
router.get('/browse', verifyToken, browseProjects);
router.put('/:projectId', verifyToken, updateProject);
module.exports = router;