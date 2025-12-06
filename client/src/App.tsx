import React, { useState } from 'react';
import { Upload, Youtube, Film, Music, Download, Loader2, X, Play, Clock, Wand2 } from 'lucide-react';

const TRANSITIONS = [
  { id: 'random', name: 'Random (Surprise Me)' },
  { id: 'fade', name: 'Fade' },
  { id: 'wipeleft', name: 'Wipe Left' },
  { id: 'wiperight', name: 'Wipe Right' },
  { id: 'wipeup', name: 'Wipe Up' },
  { id: 'wipedown', name: 'Wipe Down' },
  { id: 'slideleft', name: 'Slide Left' },
  { id: 'slideright', name: 'Slide Right' },
  { id: 'slideup', name: 'Slide Up' },
  { id: 'slidedown', name: 'Slide Down' },
  { id: 'circlecrop', name: 'Circle Crop' },
  { id: 'rectcrop', name: 'Rect Crop' },
  { id: 'distance', name: 'Distance' },
  { id: 'fadeblack', name: 'Fade Black' },
  { id: 'fadewhite', name: 'Fade White' },
  { id: 'radial', name: 'Radial' },
  { id: 'smoothleft', name: 'Smooth Left' },
  { id: 'smoothright', name: 'Smooth Right' },
  { id: 'circleopen', name: 'Circle Open' },
  { id: 'circleclose', name: 'Circle Close' },
  { id: 'vertopen', name: 'Vertical Open' },
  { id: 'vertclose', name: 'Vertical Close' },
  { id: 'horzopen', name: 'Horizontal Open' },
  { id: 'horzclose', name: 'Horizontal Close' },
  { id: 'dissolve', name: 'Dissolve' },
  { id: 'pixelize', name: 'Pixelize' },
  { id: 'diagtl', name: 'Diagonal TL' },
  { id: 'diagtr', name: 'Diagonal TR' },
  { id: 'diagbl', name: 'Diagonal BL' },
  { id: 'diagbr', name: 'Diagonal BR' },
  { id: 'hlslice', name: 'Horizontal Slice' },
  { id: 'hrslice', name: 'Horizontal Reverse Slice' },
  { id: 'vuslice', name: 'Vertical Up Slice' },
  { id: 'vdslice', name: 'Vertical Down Slice' },
];

function App() {
  const [images, setImages] = useState<File[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [startTime, setStartTime] = useState('');
  const [transition, setTransition] = useState('random');
  const [animationType, setAnimationType] = useState('random');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    images.forEach(img => formData.append('images', img));
    formData.append('youtubeUrl', youtubeUrl);
    formData.append('startTime', startTime);
    formData.append('transition', transition);
    formData.append('animationType', animationType);
    formData.append('duration', duration.toString());

    try {
      // Simulate progress for now
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 1000);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate video');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setProgress(100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-10 h-10 text-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              ImageReels
            </h1>
          </div>
          <p className="text-gray-400">Turn your photos into cinematic masterpieces</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Upload Section */}
            <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-violet-400" />
                Upload Images
              </h2>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-[9/16] group">
                    <img 
                      src={URL.createObjectURL(img)} 
                      alt={`Upload ${i}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button 
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-[9/16] flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-violet-500 hover:bg-violet-500/10 transition-colors">
                  <Upload className="w-6 h-6 text-gray-500 mb-2" />
                  <span className="text-xs text-gray-500">Add Photo</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </section>

            {/* Settings Section */}
            <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-pink-400" />
                Audio & Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">YouTube Audio URL (Optional)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-[2]">
                      <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        placeholder="Start (0:00)"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Animation Style</label>
                  <div className="relative">
                    <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      value={animationType}
                      onChange={(e) => setAnimationType(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 transition-colors appearance-none"
                    >
                      <option value="random">Random (Surprise Me)</option>
                      <option value="zoomIn">Zoom In</option>
                      <option value="zoomOut">Zoom Out</option>
                      <option value="panLeft">Pan Left</option>
                      <option value="panRight">Pan Right</option>
                      <option value="panUp">Pan Up</option>
                      <option value="panDown">Pan Down</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Transition Style</label>
                  <div className="relative">
                    <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                      value={transition}
                      onChange={(e) => setTransition(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 transition-colors appearance-none"
                    >
                      {TRANSITIONS.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration: <span className="text-white font-bold">{duration}s</span></label>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>15s</span>
                    <span>60s</span>
                  </div>
                </div>
              </div>
            </section>

            <button
              onClick={handleSubmit}
              disabled={isGenerating || images.length === 0}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-violet-600 rounded-xl font-bold text-lg shadow-lg shadow-violet-900/20 hover:shadow-violet-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Masterpiece... {progress}%
                </span>
              ) : (
                'Generate Reel'
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="relative h-[calc(100vh-12rem)] min-h-[600px] bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            {videoUrl ? (
              <div className="absolute inset-0 flex flex-col">
                <video 
                  src={videoUrl} 
                  controls 
                  className="flex-1 w-full h-full object-contain bg-black"
                  autoPlay
                  loop
                />
                <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Generated Reel</span>
                  <a 
                    href={videoUrl} 
                    download="image-reel.mp4"
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-4">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <p className="text-lg font-medium mb-2">Your masterpiece will appear here</p>
                <p className="text-sm">Upload images and click generate to start</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
