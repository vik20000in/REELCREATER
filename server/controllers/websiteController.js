const websiteService = require('../services/websiteService');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

exports.generateDemo = async (req, res) => {
  const { url, apiKey } = req.body;
  const jobId = uuidv4();

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log(`[${jobId}] Starting website demo generation for ${url}`);
    
    const outputPath = await websiteService.createWebsiteDemo(url, apiKey, jobId);

    res.download(outputPath, 'website-demo.mp4', (err) => {
      if (err) console.error('Error sending file:', err);
      // Cleanup
      fs.unlink(outputPath, () => {});
    });

  } catch (error) {
    console.error(`[${jobId}] Error:`, error);
    res.status(500).json({ error: 'Failed to generate demo: ' + error.message });
  }
};
