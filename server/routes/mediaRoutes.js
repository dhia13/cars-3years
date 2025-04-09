
const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { verifyToken } = require('../middleware/auth');

// Routes protégées (admin uniquement)
router.get('/', verifyToken, mediaController.getAllMedia);
router.post('/upload', verifyToken, mediaController.uploadMediaFile);
router.delete('/:filename', verifyToken, mediaController.deleteMedia);

// Route de test pour Cloudinary
router.get('/test-cloudinary', verifyToken, mediaController.testCloudinary);

// Test route
router.get('/test', (req, res) => {
  res.json({
    message: 'Media API test route working',
    endpoints: [
      { method: 'GET', path: '/api/media', description: 'Get all media' },
      { method: 'POST', path: '/api/media/upload', description: 'Upload media' },
      { method: 'DELETE', path: '/api/media/:filename', description: 'Delete media' },
      { method: 'GET', path: '/api/media/test-cloudinary', description: 'Test Cloudinary connection' }
    ]
  });
});

module.exports = router;
