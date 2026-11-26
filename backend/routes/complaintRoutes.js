const express = require('express');
const router = express.Router();

const {
    createComplaint,
    getComplaints
} = require('../controllers/complaintController');

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/:projectId', verifyToken, createComplaint);
router.get('/', verifyToken, getComplaints);

module.exports = router;