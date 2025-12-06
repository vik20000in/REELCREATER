const videoService = require('./services/videoService');
const path = require('path');
const fs = require('fs');

const imagePath = path.join(__dirname, 'test_image.jpg');
const jobId = 'test_job_' + Date.now();

console.log('Starting video generation test...');
console.log('Image path:', imagePath);

videoService.createReel([imagePath, imagePath], null, 10, jobId)
  .then(outputPath => {
    console.log('Success! Video generated at:', outputPath);
  })
  .catch(err => {
    console.error('Failed:', err);
  });
