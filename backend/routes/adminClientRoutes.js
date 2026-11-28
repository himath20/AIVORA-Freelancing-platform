const express = require('express');
const router = express.Router();

const {
    getAllClients,
    getClientById,
    updateClientStatus
} = require('../controllers/adminClientController');

const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllClients);
router.get('/:clientId', verifyToken, getClientById);
router.put('/:clientId/status', verifyToken, updateClientStatus);

module.exports = router;
