
const Vehicle = require('../models/Vehicle');
const Activity = require('../models/Activity');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/vehicles';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images only!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter
});

// Get all vehicles
exports.getVehicles = async (req, res) => {
  try {
    console.log('Fetching all vehicles');
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    console.log(`Found ${vehicles.length} vehicles`);
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error in getVehicles:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single vehicle
exports.getVehicle = async (req, res) => {
  try {
    console.log(`Fetching vehicle with ID: ${req.params.id}`);
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      console.log(`Vehicle not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error in getVehicle:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    console.log('Creating new vehicle:', req.body);
    const vehicle = new Vehicle(req.body);
    
    // If status is not provided, set to 'available' by default
    if (!vehicle.status) {
      vehicle.status = 'available';
    }
    
    await vehicle.save();
    console.log('Vehicle created successfully:', vehicle._id);
    
    // Log activity
    try {
      await Activity.create({
        type: 'vehicle',
        action: 'Nouveau véhicule créé',
        details: `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
        user: req.user?.username || 'admin'
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }
    
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error in createVehicle:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  try {
    console.log(`Updating vehicle with ID: ${req.params.id}`);
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) {
      console.log(`Vehicle not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Log activity
    try {
      await Activity.create({
        type: 'vehicle',
        action: 'Véhicule mis à jour',
        details: `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
        user: req.user?.username || 'admin'
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }
    
    console.log('Vehicle updated successfully');
    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error in updateVehicle:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    console.log(`Deleting vehicle with ID: ${req.params.id}`);
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      console.log(`Vehicle not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Delete associated images
    let deletedImages = 0;
    vehicle.images.forEach(img => {
      const imagePath = path.join(__dirname, '../uploads/vehicles', path.basename(img));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        deletedImages++;
      }
    });
    
    // Log activity
    try {
      await Activity.create({
        type: 'vehicle',
        action: 'Véhicule supprimé',
        details: `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
        user: req.user?.username || 'admin'
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }
    
    console.log(`Vehicle deleted successfully. Removed ${deletedImages} associated images.`);
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error in deleteVehicle:', error);
    res.status(500).json({ message: error.message });
  }
};

// Upload vehicle images
exports.uploadImages = (req, res) => {
  console.log('Vehicle ID for image upload:', req.params.id);
  const uploadMultiple = upload.array('images', 10); // Allow up to 10 images

  uploadMultiple(req, res, async (err) => {
    if (err) {
      console.error('Error in uploadImages:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      
      console.log(`Uploaded ${req.files.length} images`);
      const fileUrls = req.files.map(file => `/vehicles/${file.filename}`);
      console.log('Generated file URLs:', fileUrls);
      
      if (req.params.id) {
        // Update existing vehicle with new images
        console.log(`Adding images to vehicle with ID: ${req.params.id}`);
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
          console.log(`Vehicle not found with ID: ${req.params.id}`);
          return res.status(404).json({ message: 'Vehicle not found' });
        }
        
        vehicle.images = [...vehicle.images, ...fileUrls];
        await vehicle.save();
        console.log('Images added to vehicle successfully');
        
        // Log activity
        try {
          await Activity.create({
            type: 'vehicle',
            action: 'Images ajoutées',
            details: `${req.files.length} images ajoutées à ${vehicle.make} ${vehicle.model}`,
            user: req.user?.username || 'admin'
          });
        } catch (activityError) {
          console.error('Error logging activity:', activityError);
        }
        
        return res.status(200).json(vehicle);
      }
      
      // Just return the URLs if no vehicle ID provided
      console.log('Returning image URLs only');
      res.status(200).json(fileUrls);
    } catch (error) {
      console.error('Error processing uploaded images:', error);
      res.status(500).json({ message: error.message });
    }
  });
};

// Get featured vehicles
exports.getFeaturedVehicles = async (req, res) => {
  try {
    console.log('Fetching featured vehicles');
    const vehicles = await Vehicle.find({ featured: true }).sort({ createdAt: -1 });
    console.log(`Found ${vehicles.length} featured vehicles`);
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error in getFeaturedVehicles:', error);
    res.status(500).json({ message: error.message });
  }
};
