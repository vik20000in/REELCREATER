const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');

// Ensure ffmpeg is available in path or set it here
// ffmpeg.setFfmpegPath('path/to/ffmpeg'); 

exports.createReel = (imagePaths, audioPath, totalDuration, jobId) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, '../temp', `${jobId}.mp4`);
    const tempDir = path.join(__dirname, '../temp', jobId);
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Calculate duration per image
    const imageDuration = totalDuration / imagePaths.length;
    const transitionDuration = 1.0; // 1 second crossfade

    // Create a complex filter for Ken Burns and transitions
    // This is complex. For simplicity in this MVP, we might just do a slideshow
    // But the user asked for Ken Burns.
    
    // Strategy:
    // 1. Create a video clip for each image with Ken Burns effect
    // 2. Concatenate them with crossfades
    
    // Since fluent-ffmpeg complex filters are hard to generate dynamically for N inputs,
    // we will generate a concat file or use a loop.
    
    // Let's try generating individual clips first, then concat.
    // This is slower but more reliable for dynamic inputs.
    
    (async () => {
      try {
        const clips = [];
        
        for (let i = 0; i < imagePaths.length; i++) {
          const imgPath = imagePaths[i];
          const clipPath = path.join(tempDir, `clip_${i}.mp4`);
          
          // Randomize zoom/pan
          const zoom = (Math.random() * 0.3) + 1.1; // 1.1 to 1.4
          const x = Math.random() > 0.5 ? 0 : (1920 * (zoom - 1)); // Left or Right
          const y = Math.random() > 0.5 ? 0 : (1080 * (zoom - 1)); // Top or Bottom
          
          // Ken Burns filter
          // scale=8000:-1,zoompan=z='min(zoom+0.0015,1.5)':d=700:x='if(gte(zoom,1.5),x,x+1/a)':y='if(gte(zoom,1.5),y,y+1)':s=1280x720
          // Simplified: zoompan
          
          // We need to ensure the clip is long enough for the transition overlap
          const clipDuration = imageDuration + (i < imagePaths.length - 1 ? transitionDuration : 0);
          
          await createClip(imgPath, clipPath, clipDuration);
          clips.push(clipPath);
        }
        
        // Now concat with crossfade
        // Using a complex filter for concat is best
        // [0][1]xfade=transition=fade:duration=1:offset=3[v1];
        // [v1][2]xfade=transition=fade:duration=1:offset=6[v2]...
        
        const command = ffmpeg();
        clips.forEach(clip => command.input(clip));
        
        if (audioPath) {
          command.input(audioPath);
        }

        const filterComplex = [];
        let lastStream = '0:v';
        let currentOffset = imageDuration;
        
        for (let i = 1; i < clips.length; i++) {
          const nextStream = `${i}:v`;
          const outStream = `v${i}`;
          filterComplex.push(`[${lastStream}][${nextStream}]xfade=transition=fade:duration=${transitionDuration}:offset=${currentOffset}[${outStream}]`);
          lastStream = outStream;
          currentOffset += imageDuration;
        }
        
        // Map the final video stream
        const videoMap = clips.length > 1 ? `[${lastStream}]` : '0:v';
        
        // Add audio if present
        let outputOptions = [
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p',
          '-shortest' // Cut to shortest stream (video or audio)
        ];
        
        if (audioPath) {
          // Loop audio if it's shorter? Or just let it play.
          // User said "download 30-60s clip", so it should be enough.
          // We might need to fade out audio.
          filterComplex.push(`[${clips.length}:a]afade=t=in:st=0:d=2,afade=t=out:st=${totalDuration-2}:d=2[aout]`);
          command.complexFilter(filterComplex, [videoMap, '[aout]']);
        } else {
          command.complexFilter(filterComplex, [videoMap]);
        }

        command
          .outputOptions(outputOptions)
          .on('end', () => {
            // Cleanup temp clips
            fs.rm(tempDir, { recursive: true, force: true }, () => {});
            resolve(outputPath);
          })
          .on('error', (err) => {
            console.error('FFmpeg error:', err);
            reject(err);
          })
          .save(outputPath);

      } catch (err) {
        reject(err);
      }
    })();
  });
};

function createClip(imagePath, outputPath, duration) {
  return new Promise((resolve, reject) => {
    // Randomize direction
    const frames = Math.ceil(duration * 25) + 25; // Add buffer frames
    const directions = [
      `z='min(zoom+0.0015,1.5)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`, // Zoom in center
      `z='min(zoom+0.0015,1.5)':d=${frames}:x='0':y='0'`, // Zoom in top-left
      `z='1.5-0.0015*on':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`, // Zoom out center
    ];
    const zoompan = directions[Math.floor(Math.random() * directions.length)];

    ffmpeg(imagePath)
      .loop(duration)
      .videoFilters([
        `scale=1080:1920:force_original_aspect_ratio=increase`, // Scale to cover 9:16
        `crop=1080:1920:(iw-ow)/2:(ih-oh)/2`, // Crop to exact 9:16
        `setsar=1`, // Ensure square pixels
        `zoompan=${zoompan}:s=1080x1920:fps=25` // Apply Ken Burns
      ])
      .duration(duration)
      .outputOptions(['-c:v', 'libx264', '-pix_fmt', 'yuv420p'])
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });
}
