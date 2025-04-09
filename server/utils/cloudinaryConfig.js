
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Configuration de Cloudinary avec les identifiants
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Vérifier la configuration
console.log('Cloudinary configuration:');
console.log('- Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('- API Key set:', process.env.CLOUDINARY_API_KEY ? 'Yes' : 'No');
console.log('- API Secret set:', process.env.CLOUDINARY_API_SECRET ? 'Yes' : 'No');

// Ajouter une méthode pour tester la connexion
cloudinary.testConnection = async () => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing. Please check your .env file');
      return { success: false, error: 'Configuration Cloudinary manquante ou incomplète' };
    }
    
    console.log('Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection test successful:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Cloudinary connection test failed:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error',
      details: error 
    };
  }
};

module.exports = cloudinary;
