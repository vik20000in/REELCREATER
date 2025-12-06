const ytDlp = require('yt-dlp-exec');
const path = require('path');
const fs = require('fs');

exports.downloadAudio = async (url, jobId) => {
  // Clean URL to remove playlist and timestamp
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      url = `https://www.youtube.com/watch?v=${urlObj.pathname.slice(1)}`;
    }
    const cleanUrlObj = new URL(url);
    cleanUrlObj.searchParams.delete('list');
    cleanUrlObj.searchParams.delete('index');
    cleanUrlObj.searchParams.delete('t');
    url = cleanUrlObj.toString();
  } catch (e) {
    // Ignore error, use original url
  }

  const outputPath = path.join(__dirname, '../temp', `${jobId}_audio.mp3`);
  console.log(`[${jobId}] Starting yt-dlp for ${url}`);
  
  try {
    await ytDlp(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: path.join(__dirname, '../temp', `${jobId}_audio.%(ext)s`),
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      noPlaylist: true, // Ensure we don't download a playlist
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });
    
    console.log(`[${jobId}] yt-dlp finished`);

    // Verify file exists (yt-dlp might append extension differently)
    // yt-dlp often appends .mp3 to the filename we gave if we didn't specify it exactly right in the template
    // But with 'output', it should be close.
    
    // Actually yt-dlp adds the extension automatically sometimes.
    // Let's check for the file.
    if (fs.existsSync(outputPath)) return outputPath;
    
    // If not found, try finding any file starting with jobId_audio
    const dir = path.dirname(outputPath);
    const files = fs.readdirSync(dir);
    const audioFile = files.find(f => f.startsWith(`${jobId}_audio`));
    
    if (audioFile) {
        const foundPath = path.join(dir, audioFile);
        console.log(`[${jobId}] Found audio file: ${foundPath}`);
        return foundPath;
    }
    
    throw new Error('Audio file not found after download');
    
  } catch (error) {
    console.error('YouTube download error:', error);
    throw new Error('Failed to download YouTube audio');
  }
};
