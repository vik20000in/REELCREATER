import React from 'react';
import { Film } from 'lucide-react';
import { ImageReelGenerator } from './components/ImageReelGenerator';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-10 h-10 text-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              ReelCreater
            </h1>
          </div>
          <p className="text-gray-400">Create cinematic masterpieces from images</p>
        </header>

        <ImageReelGenerator />
      </div>
    </div>
  );
}

export default App;
