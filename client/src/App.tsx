import React, { useState } from 'react';
import { Film, Globe } from 'lucide-react';
import { ImageReelGenerator } from './components/ImageReelGenerator';
import { WebsiteDemoGenerator } from './components/WebsiteDemoGenerator';

function App() {
  const [activeTab, setActiveTab] = useState<'reel' | 'website'>('reel');

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
          <p className="text-gray-400">Create cinematic masterpieces from images or websites</p>
        </header>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 p-1 rounded-xl border border-gray-800 inline-flex">
            <button
              onClick={() => setActiveTab('reel')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'reel' 
                  ? 'bg-gray-800 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4" />
              Image Reel
            </button>
            <button
              onClick={() => setActiveTab('website')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'website' 
                  ? 'bg-gray-800 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              Website Demo
            </button>
          </div>
        </div>

        {activeTab === 'reel' ? <ImageReelGenerator /> : <WebsiteDemoGenerator />}
      </div>
    </div>
  );
}

export default App;
