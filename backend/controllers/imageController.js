const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');

// POST /api/images/upload
exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    path: req.file.path
  });
};

// POST /api/images/compress
exports.compressImage = async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ error: 'Filename required' });
    const inputPath = path.join(process.env.STORAGE_PATH || './uploads', filename);
    if (!fs.existsSync(inputPath)) return res.status(404).json({ error: 'File not found' });

    // Mock AI API call (replace with real API integration)
    // Example: returns [{x, y, width, height, type: 'face'|'text'}]
    // const aiRes = await axios.post(process.env.AI_API_URL, { image: fs.readFileSync(inputPath) }, { headers: { 'Ocp-Apim-Subscription-Key': process.env.AI_API_KEY } });
    // const regions = aiRes.data.regions;
    const regions = [
      { x: 50, y: 50, width: 100, height: 100, type: 'face' } // Mock: one face region
    ];

    // Load image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Create mask for important regions (mock: just blur outside region)
    const { width, height } = metadata;
    const mask = Buffer.alloc(width * height, 0);
    // Mark important region as 1 (mock)
    regions.forEach(r => {
      for (let y = r.y; y < r.y + r.height; y++) {
        for (let x = r.x; x < r.x + r.width; x++) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            mask[y * width + x] = 1;
          }
        }
      }
    });

    // Adaptive compression: compress whole image, then overlay important region at higher quality
    const compressedPath = path.join('compressed', 'compressed-' + filename);
    await image.jpeg({ quality: 40 }).toFile(compressedPath); // Aggressive compression
    // For demo, skip overlay step (real: extract region, compress at higher quality, composite)

    res.json({
      compressedUrl: `/compressed/compressed-${filename}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Compression failed' });
  }
}; 