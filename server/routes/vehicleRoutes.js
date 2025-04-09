
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.get('/', vehicleController.getVehicles);
router.get('/featured', vehicleController.getFeaturedVehicles);
router.get('/:id', vehicleController.getVehicle);

// Protected routes (admin only)
router.post('/', verifyToken, vehicleController.createVehicle);
router.put('/:id', verifyToken, vehicleController.updateVehicle);
router.delete('/:id', verifyToken, vehicleController.deleteVehicle);
router.post('/upload/:id?', verifyToken, vehicleController.uploadImages);

module.exports = router;
