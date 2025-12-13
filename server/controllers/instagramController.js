const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const ytDlp = require('yt-dlp-exec');
const ffmpeg = require('fluent-ffmpeg');

exports.importReel = async (req, res) => {
  const { url } = req.body;
  const jobId = uuidv4();
  const tempDir = path.join(__dirname, '../temp');
  const outputPath = path.join(tempDir, `${jobId}.mp4`);
  const audioPath = path.join(tempDir, `${jobId}.mp3`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  try {
    console.log(`[${jobId}] Downloading Instagram reel: ${url}`);
    
    // Download video
    await ytDlp(url, {
      output: outputPath,
      format: 'mp4',
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
    });

    // Extract audio and get duration
    await new Promise((resolve, reject) => {
      ffmpeg(outputPath)
        .toFormat('mp3')
        .save(audioPath)
        .on('end', resolve)
        .on('error', reject);
    });

    // Get duration
    const duration = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(outputPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration);
      });
    });

    // Clean up video, keep audio
    fs.unlinkSync(outputPath);

    // Return the audio URL (served statically) and metadata
    // We need to move the audio to 'uploads' or a public folder to serve it
    const publicAudioPath = path.join(__dirname, '../uploads', `${jobId}.mp3`);
    fs.renameSync(audioPath, publicAudioPath);

    res.json({
      success: true,
      audioUrl: `/uploads/${jobId}.mp3`,
      duration: Math.round(duration),
      jobId
    });

  } catch (error) {
    console.error(`[${jobId}] Error importing reel:`, error);
    res.status(500).json({ error: 'Failed to import Instagram reel. Make sure the link is public.' });
  }
};
