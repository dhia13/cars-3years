
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');

// Auth routes
router.post('/login', adminController.login);

// Protected routes (admin only)
router.post('/upload-video', verifyToken, adminController.uploadVideo);
router.get('/site-config', verifyToken, adminController.getSiteConfig);
router.put('/site-config', verifyToken, adminController.updateSiteConfig);

// Custom pages
router.put('/custom-page/:pageKey', verifyToken, adminController.updateCustomPage);

// Dashboard stats
router.get('/dashboard-stats', verifyToken, adminController.getDashboardStats);

// Activity log
router.get('/activity', verifyToken, adminController.getActivityLog);

module.exports = router;
