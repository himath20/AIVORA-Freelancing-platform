const express = require('express');
const router = express.Router();

const { testController } = require('../controllers/testController');
const { verifyToken } = require('../middleware/authMiddleware');

// Normal test route
router.get('/test', testController);

// Protected route
router.get('/protected', verifyToken, (req, res) => {
    res.json({
        message: 'You accessed a protected route successfully!',
        user: req.user
    });
});

module.exports = router;