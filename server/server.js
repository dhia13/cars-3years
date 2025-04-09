
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// =========== MODELS ===========

// Vehicle Model
const vehicleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    trim: true
  }],
  specifications: {
    engine: String,
    transmission: String,
    mileage: Number,
    fuelType: String,
    bodyType: String,
    color: String
  },
  images: [{
    type: String,
    required: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Contact Model
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  responded: {
    type: Boolean,
    default: false
  }
});

const Contact = mongoose.model('Contact', contactSchema);

// Site Config Model
const siteConfigSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    trim: true
  },
  homeHeroText: {
    type: String,
    trim: true
  },
  contactInfo: {
    address: String,
    phone: String,
    email: String,
    workingHours: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const SiteConfig = mongoose.model('SiteConfig', siteConfigSchema);

// Visitor Model
const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String
  },
  page: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

// =========== MIDDLEWARE ===========

// Auth middleware
const verifyToken = (req, res, next) => {
  // Get auth header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  // Check if auth header has the right format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token error' });
  }
  
  const token = parts[1];
  
  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Add user info to request
    req.user = decoded;
    next();
  });
};

// =========== STORAGE CONFIGURATIONS ===========

// Setup storage for vehicle images
const vehicleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/vehicles';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Check vehicle image file type
const vehicleFileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
};

const uploadVehicleImages = multer({
  storage: vehicleStorage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter: vehicleFileFilter
});

// Setup storage for video upload
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/videos';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `site-video${path.extname(file.originalname)}`);
  }
});

// Check video file type
const videoFileFilter = (req, file, cb) => {
  const filetypes = /mp4|webm|mov|avi/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Videos only!');
  }
};

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100000000 }, // 100MB
  fileFilter: videoFileFilter
});

// =========== CONTROLLERS ===========

// ===== Vehicle Controllers =====
const vehicleController = {
  // Get all vehicles
  getVehicles: async (req, res) => {
    try {
      const vehicles = await Vehicle.find();
      res.status(200).json(vehicles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single vehicle
  getVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new vehicle
  createVehicle: async (req, res) => {
    try {
      const vehicle = new Vehicle(req.body);
      await vehicle.save();
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a vehicle
  updateVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a vehicle
  deleteVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      
      // Delete associated images
      vehicle.images.forEach(img => {
        const imagePath = path.join(__dirname, '../uploads/vehicles', path.basename(img));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
      
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Upload vehicle images
  uploadImages: (req, res) => {
    const uploadMultiple = uploadVehicleImages.array('images', 10); // Allow up to 10 images

    uploadMultiple(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      try {
        const fileUrls = req.files.map(file => `/vehicles/${file.filename}`);
        
        if (req.params.id) {
          // Update existing vehicle with new images
          const vehicle = await Vehicle.findById(req.params.id);
          if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
          }
          
          vehicle.images = [...vehicle.images, ...fileUrls];
          await vehicle.save();
          return res.status(200).json(vehicle);
        }
        
        // Just return the URLs if no vehicle ID provided
        res.status(200).json(fileUrls);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  },

  // Get featured vehicles
  getFeaturedVehicles: async (req, res) => {
    try {
      const vehicles = await Vehicle.find({ featured: true });
      res.status(200).json(vehicles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// ===== Contact Controllers =====
const contactController = {
  // Submit a contact form
  submitContact: async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      
      // Create new contact
      const contact = new Contact({
        name,
        email,
        phone,
        message
      });
      
      await contact.save();
      
      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: 'Nouveau message de contact - 3ansdz',
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Téléphone:</strong> ${phone || 'Non fourni'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p>Ce message a été envoyé depuis le formulaire de contact sur 3ansdz.com</p>
        `
      };
      
      await transporter.sendMail(mailOptions);
      
      res.status(201).json({ message: 'Message envoyé avec succès' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all contacts
  getContacts: async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single contact
  getContact: async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mark contact as responded
  markResponded: async (req, res) => {
    try {
      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { responded: true },
        { new: true }
      );
      
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a contact
  deleteContact: async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// ===== Admin Controllers =====
const adminController = {
  // Admin login
  login: async (req, res) => {
    const { username, password } = req.body;
    
    // Check credentials against environment variables
    if (
      username === process.env.ADMIN_USERNAME && 
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate JWT token
      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(200).json({
        message: 'Login successful',
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  },

  // Upload site video
  uploadVideo: (req, res) => {
    const videoUpload = uploadVideo.single('video');

    videoUpload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      try {
        // Save video URL to site config
        let siteConfig = await SiteConfig.findOne();
        
        if (!siteConfig) {
          siteConfig = new SiteConfig();
        }
        
        siteConfig.videoUrl = `/videos/${req.file.filename}`;
        await siteConfig.save();
        
        res.status(200).json({ 
          message: 'Video uploaded successfully',
          videoUrl: siteConfig.videoUrl 
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  },

  // Get site config
  getSiteConfig: async (req, res) => {
    try {
      let siteConfig = await SiteConfig.findOne();
      
      if (!siteConfig) {
        siteConfig = new SiteConfig();
        await siteConfig.save();
      }
      
      res.status(200).json(siteConfig);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update site config
  updateSiteConfig: async (req, res) => {
    try {
      let siteConfig = await SiteConfig.findOne();
      
      if (!siteConfig) {
        siteConfig = new SiteConfig();
      }
      
      // Update fields
      if (req.body.homeHeroText) siteConfig.homeHeroText = req.body.homeHeroText;
      if (req.body.contactInfo) siteConfig.contactInfo = req.body.contactInfo;
      if (req.body.socialMedia) siteConfig.socialMedia = req.body.socialMedia;
      
      siteConfig.lastUpdated = Date.now();
      await siteConfig.save();
      
      res.status(200).json(siteConfig);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// ===== Visitor Controllers =====
const visitorController = {
  // Record a new visitor
  recordVisit: async (req, res) => {
    try {
      const { page } = req.body;
      
      const visitor = new Visitor({
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        page
      });
      
      await visitor.save();
      
      // Send email notification for important pages
      if (page === '/contact' || page === '/vehicules' || page.startsWith('/vehicules/')) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `Nouvelle visite sur ${page} - 3ansdz`,
          html: `
            <h2>Nouvelle visite sur le site</h2>
            <p><strong>Page:</strong> ${page}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>IP:</strong> ${req.ip}</p>
            <p><strong>User Agent:</strong> ${req.headers['user-agent']}</p>
            <hr>
            <p>Cette notification a été envoyée automatiquement depuis 3ansdz.com</p>
          `
        };
        
        await transporter.sendMail(mailOptions);
      }
      
      res.status(201).json({ message: 'Visit recorded' });
    } catch (error) {
      // Don't return error to client, just log it
      console.error('Error recording visit:', error);
      res.status(200).json({ message: 'OK' });
    }
  },

  // Get visitor statistics
  getVisitorStats: async (req, res) => {
    try {
      // Get total visitors
      const totalVisitors = await Visitor.countDocuments();
      
      // Get visitors in the last 24 hours
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);
      const visitorsLast24Hours = await Visitor.countDocuments({
        timestamp: { $gte: last24Hours }
      });
      
      // Get visitors in the last 7 days
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      const visitorsLast7Days = await Visitor.countDocuments({
        timestamp: { $gte: last7Days }
      });
      
      // Get most visited pages
      const mostVisitedPages = await Visitor.aggregate([
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      
      res.status(200).json({
        totalVisitors,
        visitorsLast24Hours,
        visitorsLast7Days,
        mostVisitedPages
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// =========== ROUTES ===========

// Vehicle Routes
app.get('/api/vehicles', vehicleController.getVehicles);
app.get('/api/vehicles/featured', vehicleController.getFeaturedVehicles);
app.get('/api/vehicles/:id', vehicleController.getVehicle);
app.post('/api/vehicles', verifyToken, vehicleController.createVehicle);
app.put('/api/vehicles/:id', verifyToken, vehicleController.updateVehicle);
app.delete('/api/vehicles/:id', verifyToken, vehicleController.deleteVehicle);
app.post('/api/vehicles/upload/:id?', verifyToken, vehicleController.uploadImages);

// Contact Routes
app.post('/api/contact', contactController.submitContact);
app.get('/api/contact', verifyToken, contactController.getContacts);
app.get('/api/contact/:id', verifyToken, contactController.getContact);
app.put('/api/contact/:id/respond', verifyToken, contactController.markResponded);
app.delete('/api/contact/:id', verifyToken, contactController.deleteContact);

// Admin Routes
app.post('/api/admin/login', adminController.login);
app.post('/api/admin/upload-video', verifyToken, adminController.uploadVideo);
app.get('/api/admin/site-config', verifyToken, adminController.getSiteConfig);
app.put('/api/admin/site-config', verifyToken, adminController.updateSiteConfig);

// Visitor Routes
app.post('/api/visitors/record', visitorController.recordVisit);
app.get('/api/visitors/stats', verifyToken, visitorController.getVisitorStats);

// Base route
app.get('/', (req, res) => {
  res.send('3ansdz API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
