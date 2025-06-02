const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const imageController = require('../controllers/imageController');

// Multer setup (reuse from server.js if needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.STORAGE_PATH || './uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    cb(null, allowed.includes(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// POST /api/images/upload
router.post('/upload', upload.single('image'), imageController.uploadImage);

// POST /api/images/compress
router.post('/compress', imageController.compressImage);

module.exports = router; 