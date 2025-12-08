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

exports.createReel = (imagePaths, audioPath, totalDuration, jobId, startTime, transitions, imageAnimations) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, '../temp', `${jobId}.mp4`);
    const tempDir = path.join(__dirname, '../temp', jobId);
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Calculate duration per image
    const imageDuration = totalDuration / imagePaths.length;
    const transitionDuration = 1.0; // 1 second crossfade

    // Helper to get transition
    const getTransition = () => {
      let available = transitions;
      if (!Array.isArray(available)) available = [available];
      
      // If 'random' is selected (or it's the default), pick from ALL transitions
      if (available.includes('random')) {
         return TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)];
      }
      
      // Otherwise pick random from the selected list
      return available[Math.floor(Math.random() * available.length)];
    };

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
          
          // Get specific animation for this image
          const anim = imageAnimations && imageAnimations[i] ? imageAnimations[i] : 'random';

          await createClip(imgPath, clipPath, clipDuration, anim);
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
        const command = ffmpeg();
        clips.forEach(clip => command.input(clip));
        
        // Audio input is handled later

        const filterComplex = [];
        let lastStream = '0:v';
        let currentOffset = imageDuration;
        
        for (let i = 1; i < clips.length; i++) {
          const nextStream = `${i}:v`;
          const outStream = `v${i}`;
          const transition = getTransition();
          filterComplex.push(`[${lastStream}][${nextStream}]xfade=transition=${transition}:duration=${transitionDuration}:offset=${currentOffset}[${outStream}]`);
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

function createClip(imagePath, outputPath, duration, animationType) {
  return new Promise((resolve, reject) => {
    // Randomize direction
    const frames = Math.ceil(duration * 25) + 25; // Add buffer frames
    // Reduced max zoom to 1.2 to minimize cropping of the padded image
    
    const zoomInCenter = `z='min(zoom+0.0010,1.2)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;
    const zoomInTopLeft = `z='min(zoom+0.0010,1.2)':d=${frames}:x='0':y='0'`;
    const zoomOutCenter = `z='1.2-0.0010*on':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;
    
    // Pan effects (constant zoom 1.2)
    const panRight = `z='1.2':d=${frames}:x='(iw-iw/zoom)*(on/${frames})':y='ih/2-(ih/zoom/2)'`;
    const panLeft = `z='1.2':d=${frames}:x='(iw-iw/zoom)*(1-on/${frames})':y='ih/2-(ih/zoom/2)'`;
    const panDown = `z='1.2':d=${frames}:x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(on/${frames})'`;
    const panUp = `z='1.2':d=${frames}:x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(1-on/${frames})'`;

    // New Animations
    const diagTLBR = `z='1.2':d=${frames}:x='(iw-iw/zoom)*(on/${frames})':y='(ih-ih/zoom)*(on/${frames})'`;
    const diagTRBL = `z='1.2':d=${frames}:x='(iw-iw/zoom)*(1-on/${frames})':y='(ih-ih/zoom)*(on/${frames})'`;
    const pulse = `z='if(lte(on,${frames}/2), min(zoom+0.0015,1.2), max(zoom-0.0015,1.0))':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;
    const shake = `z='1.1':d=${frames}:x='iw/2-(iw/zoom/2)+10*sin(on)':y='ih/2-(ih/zoom/2)+10*cos(on)'`;

    // New Innovative Animations
    const spiral = `z='1.2':d=${frames}:x='iw/2-(iw/zoom/2)+20*sin(on/20)':y='ih/2-(ih/zoom/2)+20*cos(on/20)'`;
    const sway = `z='1.1':d=${frames}:x='iw/2-(iw/zoom/2)+30*sin(on/40)':y='ih/2-(ih/zoom/2)'`;
    const bounce = `z='1.1':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)+30*abs(sin(on/30))'`;
    const dramaticZoom = `z='min(zoom+0.005,1.5)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;

    let zoompan;
    switch (animationType) {
      case 'zoomIn':
        zoompan = Math.random() > 0.5 ? zoomInCenter : zoomInTopLeft;
        break;
      case 'zoomOut':
        zoompan = zoomOutCenter;
        break;
      case 'panRight':
        zoompan = panRight;
        break;
      case 'panLeft':
        zoompan = panLeft;
        break;
      case 'panUp':
        zoompan = panUp;
        break;
      case 'panDown':
        zoompan = panDown;
        break;
      case 'diagTLBR':
        zoompan = diagTLBR;
        break;
      case 'diagTRBL':
        zoompan = diagTRBL;
        break;
      case 'pulse':
        zoompan = pulse;
        break;
      case 'shake':
        zoompan = shake;
        break;
      case 'spiral':
        zoompan = spiral;
        break;
      case 'sway':
        zoompan = sway;
        break;
      case 'bounce':
        zoompan = bounce;
        break;
      case 'dramaticZoom':
        zoompan = dramaticZoom;
        break;
      default: // random
        const directions = [
          zoomInCenter, zoomInTopLeft, zoomOutCenter, 
          panRight, panLeft, panUp, panDown, 
          diagTLBR, diagTRBL, pulse, shake,
          spiral, sway, bounce, dramaticZoom
        ];
        zoompan = directions[Math.floor(Math.random() * directions.length)];
    }

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
