const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');

// Ensure ffmpeg is available in path or set it here
// ffmpeg.setFfmpegPath('path/to/ffmpeg'); 

const TRANSITIONS = [
  'fade', 'wipeleft', 'wiperight', 'wipeup', 'wipedown', 
  'slideleft', 'slideright', 'slideup', 'slidedown', 
  'circlecrop', 'rectcrop', 'distance', 'fadeblack', 'fadewhite', 
  'radial', 'smoothleft', 'smoothright', 'circleopen', 'circleclose', 
  'vertopen', 'vertclose', 'horzopen', 'horzclose', 'dissolve', 
  'pixelize', 'diagtl', 'diagtr', 'diagbl', 'diagbr', 
  'hlslice', 'hrslice', 'vuslice', 'vdslice'
];

exports.createReel = (imagePaths, audioPath, totalDuration, jobId, startTime, transitionType) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, '../temp', `${jobId}.mp4`);
    const tempDir = path.join(__dirname, '../temp', jobId);
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Calculate duration per image
    const imageDuration = totalDuration / imagePaths.length;
    const transitionDuration = 1.0; // 1 second crossfade

    // Determine transition
    let selectedTransition = transitionType;
    if (!selectedTransition || selectedTransition === 'random') {
      selectedTransition = TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)];
    }

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
        const clips = new Array(imagePaths.length);
        
        // Parallel processing with concurrency limit
        const concurrencyLimit = 4;
        const queue = imagePaths.map((imgPath, i) => ({ imgPath, i }));
        const activePromises = [];

        const processImage = async ({ imgPath, i }) => {
          const clipPath = path.join(tempDir, `clip_${i}.mp4`);
          // We need to ensure the clip is long enough for the transition overlap
          const clipDuration = imageDuration + (i < imagePaths.length - 1 ? transitionDuration : 0);
          
          await createClip(imgPath, clipPath, clipDuration);
          clips[i] = clipPath;
        };

        while (queue.length > 0 || activePromises.length > 0) {
          while (queue.length > 0 && activePromises.length < concurrencyLimit) {
            const task = queue.shift();
            const promise = processImage(task).then(() => {
              activePromises.splice(activePromises.indexOf(promise), 1);
            });
            activePromises.push(promise);
          }
          if (activePromises.length > 0) {
            await Promise.race(activePromises);
          }
        }
        
        // Now concat with crossfade
        // Using a complex filter for concat is best
        // [0][1]xfade=transition=fade:duration=1:offset=3[v1];
        // [v1][2]xfade=transition=fade:duration=1:offset=6[v2]...
        
        const command = ffmpeg();
        clips.forEach(clip => command.input(clip));
        
        // Audio input is handled later

        const filterComplex = [];
        let lastStream = '0:v';
        let currentOffset = imageDuration;
        
        for (let i = 1; i < clips.length; i++) {
          const nextStream = `${i}:v`;
          const outStream = `v${i}`;
          filterComplex.push(`[${lastStream}][${nextStream}]xfade=transition=${selectedTransition}:duration=${transitionDuration}:offset=${currentOffset}[${outStream}]`);
          lastStream = outStream;
          currentOffset += imageDuration;
        }
        
        // Map the final video stream
        const videoMap = clips.length > 1 ? `[${lastStream}]` : '0:v';
        
        // Add audio if present
        let outputOptions = [
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p',
          '-preset', 'fast',
          '-shortest' // Cut to shortest stream (video or audio)
        ];
        
        if (audioPath) {
          // Handle start time
          if (startTime) {
            command.addInput(audioPath).inputOptions(['-ss', startTime]);
          } else {
            command.input(audioPath);
          }

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
    // Reduced max zoom to 1.2 to minimize cropping of the padded image
    const directions = [
      `z='min(zoom+0.0010,1.2)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`, // Zoom in center
      `z='min(zoom+0.0010,1.2)':d=${frames}:x='0':y='0'`, // Zoom in top-left
      `z='1.2-0.0010*on':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`, // Zoom out center
    ];
    const zoompan = directions[Math.floor(Math.random() * directions.length)];

    ffmpeg(imagePath)
      .loop(duration)
      .complexFilter([
        // 1. Background: Scale to cover 1080x1920, crop, and blur
        `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920:(iw-ow)/2:(ih-oh)/2,boxblur=40:20[bg]`,
        // 2. Foreground: Scale to fit 1080x1920 (preserve aspect ratio)
        `[0:v]scale=1080:1920:force_original_aspect_ratio=decrease[fg]`,
        // 3. Overlay Foreground on Background
        `[bg][fg]overlay=(W-w)/2:(H-h)/2[ov]`,
        // 4. Apply Ken Burns to the combined result
        `[ov]setsar=1,zoompan=${zoompan}:s=1080x1920:fps=25[v]`
      ], 'v')
      .duration(duration)
      .outputOptions(['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'ultrafast'])
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });
}
