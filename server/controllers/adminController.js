
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Admin = require('../models/Admin');
const Contact = require('../models/Contact');
const Activity = require('../models/Activity');
const Vehicle = require('../models/Vehicle');
const SiteConfig = require('../models/SiteConfig');
const { uploadVideo } = require('../middleware/upload');
const cloudinary = require('../utils/cloudinaryConfig');

// Login admin
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Vérifier les identifiants par défaut
    const isDefaultAdmin = username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
    
    if (isDefaultAdmin) {
      // Créer un token JWT pour l'admin par défaut
      const token = jwt.sign(
        { username: process.env.ADMIN_USERNAME },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Enregistrer l'activité de connexion
      await Activity.create({
        type: 'admin',
        action: 'Connexion',
        details: 'Connexion de l\'administrateur (identifiants par défaut)',
        user: process.env.ADMIN_USERNAME
      });
      
      return res.status(200).json({
        token,
        username: process.env.ADMIN_USERNAME
      });
    }
    
    // Si ce ne sont pas les identifiants par défaut, chercher dans la base de données
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
    
    // Créer un token JWT
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Enregistrer l'activité de connexion
    await Activity.create({
      type: 'admin',
      action: 'Connexion',
      details: 'Connexion de l\'administrateur',
      user: admin.username
    });
    
    res.status(200).json({
      token,
      username: admin.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Upload video
exports.uploadVideo = (req, res) => {
  uploadVideo.single('video')(req, res, async (err) => {
    if (err) {
      console.error('Error uploading video:', err);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }

    try {
      const filePath = req.file.path;
      console.log('Video uploaded locally:', req.file);
      
      // Cloudinary upload for video
      const cloudinaryResult = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder: 'videos'
      });
      console.log('Video uploaded to Cloudinary:', cloudinaryResult);
      
      // Delete local file after upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Update site config with new video URL
      let siteConfig = await SiteConfig.findOne();
      
      if (!siteConfig) {
        siteConfig = new SiteConfig();
      }
      
      siteConfig.videoUrl = cloudinaryResult.secure_url;
      siteConfig.lastUpdated = Date.now();
      await siteConfig.save();
      
      // Log activity
      await Activity.create({
        type: 'admin',
        action: 'Vidéo mise à jour',
        details: req.file.originalname,
        user: req.user?.username || 'admin'
      });
      
      res.status(200).json({
        videoUrl: cloudinaryResult.secure_url,
        message: 'Video uploaded successfully'
      });
    } catch (error) {
      console.error('Error processing video upload:', error);
      res.status(500).json({ message: error.message });
    }
  });
};

// Get site configuration
exports.getSiteConfig = async (req, res) => {
  try {
    console.log('Getting site configuration');
    let siteConfig = await SiteConfig.findOne();
    
    if (!siteConfig) {
      console.log('Creating default site configuration');
      siteConfig = new SiteConfig({
        homeHeroText: 'Bienvenue sur notre site',
        contactInfo: {
          email: 'contact@example.com',
          phone: '+33 1 23 45 67 89',
          address: '123 Rue Exemple, Paris'
        },
        socialMedia: {
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
          twitter: 'https://twitter.com'
        },
        videoUrl: '',
        seo: {
          title: '3ansdz - Vente de véhicules',
          description: 'Découvrez notre sélection de véhicules de qualité',
          keywords: 'voiture, automobile, vente, occasion, neuf',
        },
        customPages: {
          about: {
            title: 'À Propos',
            content: '<p>Contenu de la page à propos</p>',
            lastUpdated: new Date()
          }
        }
      });
      await siteConfig.save();
    }
    
    res.status(200).json(siteConfig);
  } catch (error) {
    console.error('Error getting site config:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update site configuration
exports.updateSiteConfig = async (req, res) => {
  try {
    console.log('Updating site configuration:', req.body);
    let siteConfig = await SiteConfig.findOne();
    
    if (!siteConfig) {
      siteConfig = new SiteConfig();
    }
    
    const configData = req.body;
    
    // Update top-level fields
    ['homeHeroText', 'videoUrl'].forEach(field => {
      if (configData[field] !== undefined) {
        siteConfig[field] = configData[field];
      }
    });
    
    // Update nested objects
    ['contactInfo', 'socialMedia', 'seo'].forEach(section => {
      if (configData[section]) {
        if (!siteConfig[section]) {
          siteConfig[section] = {};
        }
        
        siteConfig[section] = {
          ...siteConfig[section], 
          ...configData[section]
        };
      }
    });
    
    // Update custom pages if provided
    if (configData.customPages) {
      if (!siteConfig.customPages) {
        siteConfig.customPages = new Map();
      }
      
      Object.entries(configData.customPages).forEach(([key, value]) => {
        siteConfig.customPages.set(key, value);
      });
    }
    
    siteConfig.lastUpdated = Date.now();
    const savedConfig = await siteConfig.save();
    
    // Log activity
    await Activity.create({
      type: 'admin',
      action: 'Configuration mise à jour',
      details: 'Configuration du site modifiée',
      user: req.user?.username || 'admin'
    });
    
    console.log('Site configuration updated successfully');
    res.status(200).json(savedConfig);
  } catch (error) {
    console.error('Error updating site config:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update custom page
exports.updateCustomPage = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const { title, content } = req.body;
    
    console.log('Updating custom page:', pageKey, req.body);
    
    if (!pageKey || !title || content === undefined) {
      return res.status(400).json({ message: 'Page key, title and content are required' });
    }
    
    let siteConfig = await SiteConfig.findOne();
    
    if (!siteConfig) {
      siteConfig = new SiteConfig();
    }
    
    if (!siteConfig.customPages) {
      siteConfig.customPages = new Map();
    }
    
    siteConfig.customPages.set(pageKey, {
      title,
      content,
      lastUpdated: new Date()
    });
    
    await siteConfig.save();
    
    // Log activity
    await Activity.create({
      type: 'admin',
      action: 'Page personnalisée mise à jour',
      details: `Page "${title}" (${pageKey}) modifiée`,
      user: req.user?.username || 'admin'
    });
    
    console.log('Custom page updated successfully');
    res.status(200).json({
      message: 'Page updated successfully',
      page: {
        key: pageKey,
        title,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error updating custom page:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const vehicleCount = await Vehicle.countDocuments();
    const vehicleAvailable = await Vehicle.countDocuments({ status: 'available' });
    const vehicleSold = await Vehicle.countDocuments({ status: 'sold' });
    
    const contactCount = await Contact.countDocuments();
    const unreadMessages = await Contact.countDocuments({ read: false });
    
    const recentActivity = await Activity.find()
      .sort({ date: -1 })
      .limit(10);
    
    res.status(200).json({
      vehicles: {
        total: vehicleCount,
        available: vehicleAvailable,
        sold: vehicleSold
      },
      contacts: {
        total: contactCount,
        unread: unreadMessages
      },
      recentActivity
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get activity log
exports.getActivityLog = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const activities = await Activity.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Activity.countDocuments();
    
    res.status(200).json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error getting activity log:', error);
    res.status(500).json({ message: error.message });
  }
};
