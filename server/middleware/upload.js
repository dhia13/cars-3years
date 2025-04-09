
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les répertoires de téléchargement s'ils n'existent pas
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '..', 'uploads'),
    path.join(__dirname, '..', 'uploads/vehicles'),
    path.join(__dirname, '..', 'uploads/media'),
    path.join(__dirname, '..', 'uploads/videos'),
    path.join(__dirname, '..', 'uploads/temp')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Ensure upload directories exist
createUploadDirs();

// Configuration pour les médias
const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads/media');
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const mediaFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Utilisez des images, PDF ou documents Office.'));
  }
};

exports.uploadMedia = multer({
  storage: mediaStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: mediaFileFilter
});

// Configuration pour les véhicules
const vehicleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads/vehicles');
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const vehicleFileFilter = (req, file, cb) => {
  // Limit to images only
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Utilisez des images (JPG, PNG, WEBP)'));
  }
};

exports.uploadVehicle = multer({
  storage: vehicleStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: vehicleFileFilter
});

// Configuration pour les vidéos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads/videos');
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `site-video${path.extname(file.originalname)}`);
  }
});

const videoFileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Utilisez des vidéos (MP4, WEBM)'));
  }
};

exports.uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: videoFileFilter
});

// Ajout de logs pour le débogage
console.log('Upload middleware initialized');
console.log('Upload directories:');
console.log('- Media:', path.join(__dirname, '..', 'uploads/media'));
console.log('- Vehicles:', path.join(__dirname, '..', 'uploads/vehicles'));
console.log('- Videos:', path.join(__dirname, '..', 'uploads/videos'));
