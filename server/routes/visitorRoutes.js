
const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/record', visitorController.recordVisit);

// Protected routes (admin only)
router.get('/stats', verifyToken, visitorController.getVisitorStats);

module.exports = router;
