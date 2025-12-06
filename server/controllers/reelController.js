const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const videoService = require('../services/videoService');
const audioService = require('../services/audioService');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
}).array('images', 20); // Max 20 images

exports.generateReel = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one image' });
    }

    const jobId = uuidv4();
    const images = req.files.map(f => f.path);
    const { youtubeUrl, duration = 30 } = req.body;

    try {
      console.log(`[${jobId}] Starting generation...`);
      
      // 1. Get Audio
      let audioPath = null;
      if (youtubeUrl) {
        console.log(`[${jobId}] Downloading audio...`);
        audioPath = await audioService.downloadAudio(youtubeUrl, jobId);
      }

      // 2. Generate Video
      console.log(`[${jobId}] Processing video...`);
      const outputPath = await videoService.createReel(images, audioPath, parseInt(duration), jobId);

      // 3. Send File
      res.download(outputPath, 'reel.mp4', (err) => {
        // Cleanup
        cleanup(images, audioPath, outputPath);
        if (err) console.error('Error sending file:', err);
      });

    } catch (error) {
      console.error(`[${jobId}] Error:`, error);
      cleanup(images, null, null); // Try to clean up images at least
      res.status(500).json({ error: 'Failed to generate video: ' + error.message });
    }
  });
};

function cleanup(images, audioPath, videoPath) {
  try {
    if (images) images.forEach(img => fs.unlink(img, () => {}));
    if (audioPath) fs.unlink(audioPath, () => {});
    if (videoPath) {
      // Keep video for a bit or delete immediately? 
      // For now delete after sending, but since res.download is async, we do it in callback
      fs.unlink(videoPath, () => {});
    }
  } catch (e) {
    console.error('Cleanup error:', e);
  }
}
