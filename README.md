# ImageReels

ImageReels is a powerful full-stack web application that transforms your static images into engaging, cinematic video reels. It seamlessly integrates background music from YouTube and applies professional video effects.

## Features

- **📸 Smart Image Processing**:
  - **Drag-and-drop Upload**: Easily upload multiple images.
  - **Smart Aspect Ratio**: Automatically handles images of different sizes using a blurred background effect to prevent cropping while maintaining the original aspect ratio.
  - **Ken Burns Effect**: Adds dynamic pan and zoom motion to bring static images to life.

- **🎵 Advanced Audio Integration**:
  - **YouTube Support**: Extract audio directly from any YouTube video URL.
  - **Custom Start Time**: Specify exactly where the music should start (e.g., skip the intro).
  - **Auto-Fade**: Audio automatically fades in and out to match the video duration.

- **🎬 Professional Video Generation**:
  - **Custom Transitions**: Choose from over 30 different transition styles (Fade, Wipe, Slide, Circle, etc.) or let the app randomize them.
  - **Flexible Duration**: Use a slider to set the exact video length between 15 and 60 seconds.
  - **High Performance**: Optimized with parallel processing for faster video generation.

- **💻 Modern UI/UX**:
  - **Dark Mode**: Sleek, modern interface designed for creative work.
  - **Real-time Feedback**: Progress indicators and status updates.
  - **Responsive Design**: Built with React and Tailwind CSS.

## Tech Stack

- **Frontend**: 
  - React (Vite)
  - Tailwind CSS
  - Lucide React (Icons)
- **Backend**: 
  - Node.js & Express
  - Fluent-ffmpeg (Video processing)
  - yt-dlp-exec (Audio extraction)
  - Multer (File handling)
- **Core Engine**: 
  - FFmpeg (System-level video processing)
  - Python (Required for yt-dlp)

## Prerequisites

Before running the application, ensure you have the following installed:

1.  **Node.js** (v16 or higher)
2.  **FFmpeg**: Must be installed and added to your system's PATH.
    - *Windows*: Download from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/), extract, and add `bin` folder to Environment Variables.
    - *Mac*: `brew install ffmpeg`
    - *Linux*: `sudo apt install ffmpeg`
3.  **Python**: Required for `yt-dlp` to download YouTube audio.

## Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/vik20000in/REELCREATER.git
    cd REELCREATER
    ```

2.  **Install Server Dependencies**:
    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies**:
    ```bash
    cd ../client
    npm install
    ```

## Running the Application

You can run the client and server separately or use the provided VS Code tasks.

### Option 1: Manual Start

**Start the Server** (Runs on port 3000):
```bash
cd server
npm run dev
```

**Start the Client** (Runs on port 5173):
```bash
cd client
npm run dev
```

### Option 2: VS Code Tasks
If you are using VS Code, simply press `Ctrl+Shift+P`, type `Tasks: Run Task`, and select **Start Server** and **Start Client**.

## Usage Guide

1.  **Upload Images**: Drag and drop your photos into the upload zone.
2.  **Add Music**: Paste a YouTube link. Optionally, set a **Start Time** (e.g., "0:30" to start 30 seconds in).
3.  **Customize**:
    - Select a **Transition Style** (or keep it Random).
    - Adjust the **Duration Slider** (15s - 60s).
4.  **Generate**: Click "Generate Reel".
5.  **Download**: Once processing is complete, preview your video and click "Download Reel".

## License

MIT
