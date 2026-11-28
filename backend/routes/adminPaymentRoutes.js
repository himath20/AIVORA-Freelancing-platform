const express = require('express');
const router = express.Router();

const { getAllPayments } = require('../controllers/adminPaymentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllPayments);

module.exports = router;
