# ImageReels

ImageReels is a full-stack web application that turns your photos into cinematic video reels with background music.

## Features

- **Drag-and-drop Upload**: Upload multiple images easily.
- **YouTube Audio**: Extract audio from any YouTube video.
- **Cinematic Effects**: Ken Burns effect (pan & zoom) and smooth crossfades.
- **Customizable**: Choose video duration (15s, 30s, 60s).
- **Responsive UI**: Beautiful dark mode interface built with React and Tailwind CSS.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, Fluent-ffmpeg, yt-dlp
- **Video Processing**: FFmpeg (Server-side)

## Prerequisites

- Node.js (v16+)
- FFmpeg installed and added to system PATH
- Python (for yt-dlp)

## Setup

1.  **Install Dependencies**:
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

2.  **Start the Application**:
    You can run both client and server using the VS Code task "Run Full Stack" or manually:

    **Server**:
    ```bash
    cd server
    npm run dev
    ```
    Server runs on `http://localhost:3000`.

    **Client**:
    ```bash
    cd client
    npm run dev
    ```
    Client runs on `http://localhost:5173`.

3.  **Open in Browser**:
    Open `http://localhost:5173` to use the application.

## Usage

1.  Upload images.
2.  (Optional) Paste a YouTube URL for background music.
3.  Select duration.
4.  Click "Generate Reel".
5.  Wait for processing and download your video!

## License

MIT
