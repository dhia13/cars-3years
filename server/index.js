
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const vehicleRoutes = require('./routes/vehicleRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();

// Middleware
// Configure CORS middleware to allow all origins
app.use(cors({
  origin: '*',  // This allows requests from any origin
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB with better error handling and retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      retryWrites: true
    });
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Attempting to reconnect...');
  connectDB();
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Initial connection
connectDB();

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/vehicles'),
    path.join(__dirname, 'uploads/media'),
    path.join(__dirname, 'uploads/videos'),
    path.join(__dirname, 'uploads/temp')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    } else {
      console.log(`Directory already exists: ${dir}`);
    }
  });
};

// Ensure upload directories exist
createUploadDirs();

// Setup static file serving - BEFORE the routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/media', express.static(path.join(__dirname, 'uploads/media')));
app.use('/vehicles', express.static(path.join(__dirname, 'uploads/vehicles')));
app.use('/videos', express.static(path.join(__dirname, 'uploads/videos')));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/media', mediaRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('3ansdz API is running');
});

// Debug routes
app.get('/api/check-uploads', (req, res) => {
  const vehiclesDir = path.join(__dirname, 'uploads/vehicles');

  if (!fs.existsSync(vehiclesDir)) {
    return res.json({ exists: false, message: 'Vehicles directory does not exist' });
  }

  try {
    const files = fs.readdirSync(vehiclesDir);
    res.json({
      exists: true,
      fileCount: files.length,
      files: files.slice(0, 20), // Return first 20 files to avoid overwhelming response
      path: vehiclesDir
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/check-media', (req, res) => {
  const mediaDir = path.join(__dirname, 'uploads/media');

  if (!fs.existsSync(mediaDir)) {
    return res.json({ exists: false, message: 'Media directory does not exist' });
  }

  try {
    const files = fs.readdirSync(mediaDir);
    res.json({
      exists: true,
      fileCount: files.length,
      files: files.slice(0, 20), // Return first 20 files to avoid overwhelming response
      path: mediaDir
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route for contact API
app.get('/api/test-contact', (req, res) => {
  res.json({
    message: "Contact API test route working",
    contactApiEndpoints: [
      { method: "POST", path: "/api/contact", description: "Submit a contact form" },
      { method: "GET", path: "/api/contact", description: "Get all contacts (admin only)" },
      { method: "GET", path: "/api/contact/:id", description: "Get a single contact (admin only)" },
      { method: "PUT", path: "/api/contact/:id/respond", description: "Mark contact as responded (admin only)" },
      { method: "DELETE", path: "/api/contact/:id", description: "Delete a contact (admin only)" }
    ]
  });
});

// 404 handler
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connection: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'}`);
  console.log(`Static files served from: ${path.join(__dirname, 'uploads')}`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
});

module.exports = app;

