const express = require('express');
const router = express.Router();

const {
    createPayment,
    getAssignmentPayments,
    updatePaymentStatus
} = require('../controllers/paymentController');

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createPayment);

router.get('/:assignmentId', verifyToken, getAssignmentPayments);

router.put('/status/:paymentId', verifyToken, updatePaymentStatus);

module.exports = router;