const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const reelController = require('./controllers/reelController');
const instagramController = require('./controllers/instagramController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads (optional, mostly for debugging)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.post('/api/generate', (req, res, next) => {
  console.log('Received generate request');
  next();
}, reelController.generateReel);

app.post('/api/import-instagram', instagramController.importReel);

// Error handling
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Ensure temp directories exist
const dirs = ['uploads', 'temp'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
