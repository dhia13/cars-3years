
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyToken } = require('../middleware/auth');

// Public route - Anyone can submit a contact form
router.post('/', contactController.submitContact);

// Protected routes - Admin only
router.get('/', verifyToken, contactController.getContacts);
router.get('/:id', verifyToken, contactController.getContact);
router.put('/:id/respond', verifyToken, contactController.markResponded);
router.delete('/:id', verifyToken, contactController.deleteContact);

module.exports = router;
