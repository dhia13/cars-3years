
const mongoose = require('mongoose');

const customPageSchema = new mongoose.Schema({
  title: String,
  content: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

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
  seo: {
    title: String,
    description: String,
    keywords: String,
    ogImage: String
  },
  customPages: {
    type: Map,
    of: customPageSchema,
    default: () => new Map()
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour convertir Map en Object pour la sérialisation JSON
siteConfigSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.customPages instanceof Map) {
      ret.customPages = Object.fromEntries(ret.customPages);
    }
    return ret;
  }
});

// Méthode pour convertir Object en Map lors de la mise à jour
siteConfigSchema.statics.updateConfig = async function(configData) {
  let config = await this.findOne();
  if (!config) {
    config = new this();
  }
  
  // Mise à jour des champs simples
  Object.keys(configData).forEach(key => {
    if (key !== 'customPages' && key !== '_id' && key !== '__v') {
      config[key] = configData[key];
    }
  });
  
  // Mise à jour des pages personnalisées
  if (configData.customPages) {
    if (!config.customPages) {
      config.customPages = new Map();
    }
    
    Object.entries(configData.customPages).forEach(([key, value]) => {
      config.customPages.set(key, value);
    });
  }
  
  config.lastUpdated = Date.now();
  return config.save();
};

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
