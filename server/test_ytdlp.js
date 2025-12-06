const ytDlp = require('yt-dlp-exec');
const path = require('path');

console.log('Starting test...');
ytDlp('https://youtu.be/XAUXBiS-0_U?list=RDAMVMXAUXBiS-0_U&t=7', {
  extractAudio: true,
  audioFormat: 'mp3',
  output: 'test_audio_user.%(ext)s',
  noCheckCertificates: true,
  noWarnings: true,
  preferFreeFormats: true,
})
.then(output => console.log('Success:', output))
.catch(err => console.error('Error:', err));
