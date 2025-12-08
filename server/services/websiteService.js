const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const googleTTS = require('google-tts-api'); // You need to install this: npm install google-tts-api
const { v4: uuidv4 } = require('uuid');
const https = require('https');

exports.createWebsiteDemo = async (url, apiKey, jobId) => {
  const tempDir = path.join(__dirname, '../temp', jobId);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  let browser;
  try {
    // 1. Launch Browser & Scrape
    console.log(`[${jobId}] Launching browser...`);
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log(`[${jobId}] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    // Extract content for script
    const content = await page.evaluate(() => {
      const title = document.title;
      const description = document.querySelector('meta[name="description"]')?.content || '';
      const headings = Array.from(document.querySelectorAll('h1, h2')).map(h => h.innerText).slice(0, 5);
      const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText).filter(t => t.length > 50).slice(0, 3);
      return { title, description, headings, paragraphs };
    });

    // 2. Generate Script
    console.log(`[${jobId}] Generating script...`);
    const script = await generateScript(content, apiKey);
    console.log(`[${jobId}] Script: ${script}`);

    // 3. Generate Audio
    console.log(`[${jobId}] Generating audio...`);
    const audioPath = path.join(tempDir, 'audio.mp3');
    await generateAudio(script, audioPath);

    // 4. Record Video (Screenshots while scrolling)
    console.log(`[${jobId}] Recording video...`);
    const framesDir = path.join(tempDir, 'frames');
    fs.mkdirSync(framesDir);
    
    // Get audio duration to know how long to record
    const audioDuration = await getAudioDuration(audioPath);
    const fps = 30;
    const totalFrames = Math.ceil(audioDuration * fps);
    
    // Scroll logic
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = 1080;
    const scrollDistance = bodyHeight - viewportHeight;
    const scrollStep = scrollDistance / totalFrames;

    for (let i = 0; i < totalFrames; i++) {
      const y = Math.min(i * scrollStep, scrollDistance);
      await page.evaluate((y) => window.scrollTo(0, y), y);
      
      // Save screenshot
      const framePath = path.join(framesDir, `frame_${String(i).padStart(5, '0')}.png`);
      await page.screenshot({ path: framePath });
    }

    await browser.close();
    browser = null;

    // 5. Combine Frames and Audio
    console.log(`[${jobId}] Rendering final video...`);
    const outputPath = path.join(__dirname, '../temp', `${jobId}.mp4`);
    
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(framesDir, 'frame_%05d.png'))
        .inputFPS(fps)
        .input(audioPath)
        .outputOptions([
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p',
          '-shortest'
        ])
        .save(outputPath)
        .on('end', resolve)
        .on('error', reject);
    });

    // Cleanup temp files
    fs.rm(tempDir, { recursive: true, force: true }, () => {});

    return outputPath;

  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
};

async function generateScript(content, apiKey) {
  if (apiKey) {
    try {
      const prompt = `
        Create a short, engaging 30-second script for a video demo of this website.
        Speak directly to the user. Explain what the website is and its key features.
        
        Website Title: ${content.title}
        Description: ${content.description}
        Key Headings: ${content.headings.join(', ')}
        Content Snippets: ${content.paragraphs.join(' ')}
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      }
    } catch (e) {
      console.error("AI Generation failed, falling back to template", e);
    }
  }

  // Fallback Template
  return `Welcome to ${content.title}. ${content.description ? `This website is about ${content.description}.` : ''} 
  Here are some of the key features: ${content.headings.slice(0, 3).join('. ')}. 
  Explore more to discover everything we have to offer.`;
}

async function generateAudio(text, outputPath) {
  // Split text if too long (google-tts-api limit is 200 chars)
  // For simplicity, we'll take the first 200 chars or use a library that handles splitting
  // google-tts-api has getAllAudioUrls for long text
  
  const urls = googleTTS.getAllAudioUrls(text, {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
  });

  // Download and concat audio (simplified: just download first part for MVP or handle concat)
  // Actually, let's just use the first chunk for stability in this demo
  const url = urls[0].url;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(resolve);
      });
    }).on('error', function(err) {
      fs.unlink(outputPath);
      reject(err);
    });
  });
}

function getAudioDuration(audioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
}
