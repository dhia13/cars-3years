const fs = require('fs');
const path = require('path');
const { uploadMedia } = require('../middleware/upload');
const Activity = require('../models/Activity');
const cloudinary = require('../utils/cloudinaryConfig');

// Get all media files
exports.getAllMedia = async (req, res) => {
  try {
    console.log('Getting all media files from Cloudinary');
    
    // Test connection before proceeding
    const connectionTest = await cloudinary.testConnection();
    if (!connectionTest.success) {
      console.error('Cloudinary connection failed:', connectionTest.error);
      return res.status(500).json({ 
        message: 'Erreur de connexion avec Cloudinary', 
        error: connectionTest.error,
        details: 'Vérifiez les variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans votre fichier .env'
      });
    }
    
    // Récupérer les médias depuis Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'media/',
      max_results: 100
    });
    
    console.log(`Found ${result.resources?.length || 0} resources in Cloudinary`);
    
    const mediaFiles = result.resources?.map(resource => {
      return {
        filename: resource.public_id.split('/').pop(),
        url: resource.secure_url,
        type: path.extname(resource.url).substring(1) || 'jpg',
        size: resource.bytes,
        createdAt: resource.created_at,
        cloudinary_id: resource.public_id
      };
    }) || [];
    
    res.status(200).json(mediaFiles);
  } catch (error) {
    console.error('Error fetching media files from Cloudinary:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des médias',
      error: error.message,
      details: 'Vérifiez votre configuration Cloudinary et que votre connexion internet fonctionne correctement.'
    });
  }
};

// Upload a new media file
exports.uploadMediaFile = (req, res) => {
  uploadMedia.single('media')(req, res, async (err) => {
    if (err) {
      console.error('Error uploading media:', err);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      console.log('Uploaded media file locally:', req.file);
      const filePath = req.file.path;
      
      // Test connection before proceeding
      const connectionTest = await cloudinary.testConnection();
      if (!connectionTest.success) {
        // Delete local file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        throw new Error(`Erreur de connexion avec Cloudinary: ${connectionTest.error}`);
      }
      
      // Upload to Cloudinary
      console.log('Uploading to Cloudinary...');
      const cloudinaryResult = await cloudinary.uploader.upload(filePath, {
        folder: 'media',
        resource_type: 'auto'
      });
      
      console.log('Uploaded to Cloudinary:', cloudinaryResult);
      
      // Delete local file after upload to Cloudinary
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Create media file object
      const mediaFile = {
        filename: path.basename(req.file.originalname),
        url: cloudinaryResult.secure_url,
        type: path.extname(req.file.originalname).substring(1) || 'jpg',
        size: cloudinaryResult.bytes,
        createdAt: new Date().toISOString(),
        cloudinary_id: cloudinaryResult.public_id
      };
      
      // Log activity
      try {
        await Activity.create({
          type: 'admin',
          action: 'Nouveau média ajouté',
          details: mediaFile.filename,
          user: req.user?.username || 'admin'
        });
      } catch (activityError) {
        console.error('Error logging activity:', activityError);
      }
      
      res.status(201).json(mediaFile);
    } catch (error) {
      console.error('Error processing uploaded media:', error);
      // Delete local file if it exists
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ 
        message: 'Erreur lors du traitement du média',
        error: error.message
      });
    }
  });
};

// Delete a media file
exports.deleteMedia = async (req, res) => {
  try {
    const filename = req.params.filename;
    console.log('Deleting media file:', filename);
    
    // Test connection before proceeding
    const connectionTest = await cloudinary.testConnection();
    if (!connectionTest.success) {
      throw new Error(`Erreur de connexion avec Cloudinary: ${connectionTest.error}`);
    }
    
    // Rechercher l'identifiant Cloudinary à partir du nom du fichier
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'media/',
      max_results: 100
    });
    
    const mediaFile = result.resources.find(resource => 
      resource.public_id.split('/').pop() === filename ||
      resource.public_id === `media/${filename}`
    );
    
    if (!mediaFile) {
      console.log('Media file not found in Cloudinary');
      return res.status(404).json({ message: 'File not found' });
    }
    
    console.log('Found media in Cloudinary:', mediaFile.public_id);
    
    // Supprimer de Cloudinary
    const deleteResult = await cloudinary.uploader.destroy(mediaFile.public_id);
    console.log('Cloudinary delete result:', deleteResult);
    
    // Log activity
    try {
      await Activity.create({
        type: 'admin',
        action: 'Média supprimé',
        details: filename,
        user: req.user?.username || 'admin'
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
    }
    
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting media file:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du média',
      error: error.message 
    });
  }
};

// Test Cloudinary connection
exports.testCloudinary = async (req, res) => {
  try {
    // Log env variables for debugging (don't log the secret)
    console.log('Testing Cloudinary with cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key provided:', process.env.CLOUDINARY_API_KEY ? 'Yes' : 'No');
    
    const testResult = await cloudinary.testConnection();
    
    if (testResult.success) {
      console.log('Cloudinary connection test successful');
      res.status(200).json({
        status: 'success',
        message: 'Cloudinary connection successful',
        result: testResult.result
      });
    } else {
      console.error('Cloudinary connection test failed:', testResult.error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur de connexion à Cloudinary',
        error: testResult.error,
        details: 'Vérifiez vos variables d\'environnement CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET'
      });
    }
  } catch (error) {
    console.error('Error testing Cloudinary connection:', error);
    res.status(500).json({
      status: 'error',
      message: 'Échec du test de connexion à Cloudinary',
      error: error.message,
      details: 'Une erreur s\'est produite lors du test de connexion'
    });
  }
};
