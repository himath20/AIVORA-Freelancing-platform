const express = require('express');
const router = express.Router();

const {
    getAllComplaints,
    updateComplaint
} = require('../controllers/adminComplaintController');

const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllComplaints);

router.put('/:complaintId', verifyToken, updateComplaint);

module.exports = router;