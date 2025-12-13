import React, { useState } from 'react';
import { Upload, Youtube, Music, Download, Loader2, X, Play, Clock, Wand2 } from 'lucide-react';
import { TEMPLATES } from '../data/templates';

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

interface ImageItem {
  file: File;
  animation: string;
  id: string;
}

export function ImageReelGenerator() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [startTime, setStartTime] = useState('');
  const [selectedTransitions, setSelectedTransitions] = useState<string[]>(['random']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(30);
  const [bpm, setBpm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [optimizeSize, setOptimizeSize] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(templateId);
    setSelectedTransitions(template.config.transitions);
    setDuration(template.config.duration);
    setBpm(template.config.bpm || '');
    setYoutubeUrl(template.config.youtubeUrl || '');
    
    // Apply animation to existing images
    if (images.length > 0) {
      setImages(prev => prev.map(img => ({ ...img, animation: template.config.imageAnimation })));
    }
  };

  const handleInstagramImport = async () => {
    if (!instagramUrl) return;
    
    setIsImporting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/import-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: instagramUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to import Instagram reel');
      }

      const data = await response.json();
      
      // Set the audio URL to the imported file (we'll need to handle this in the backend to support local files vs youtube)
      // For now, let's assume the backend can handle a relative path or full URL in the youtubeUrl field
      // Or we add a new field for 'audioFile'
      
      // HACK: We'll put the server URL in the youtubeUrl field and update the backend to handle it
      setYoutubeUrl(`http://localhost:3000${data.audioUrl}`);
      setDuration(data.duration);
      setInstagramUrl('');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Determine default animation based on selected template
      let defaultAnimation = 'random';
      if (selectedTemplate) {
        const template = TEMPLATES.find(t => t.id === selectedTemplate);
        if (template) {
          defaultAnimation = template.config.imageAnimation;
        }
      }

      const newImages = Array.from(e.target.files).map(file => ({
        file,
        animation: defaultAnimation,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const updateImageAnimation = (id: string, animation: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, animation } : img
    ));
  };

  const applyAnimationToAll = (animation: string) => {
    setImages(prev => prev.map(img => ({ ...img, animation })));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null) return;
    
    const items = [...images];
    const draggedItemContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedItemContent);
    
    setImages(items);
    setDraggedItem(null);
  };

  const toggleTransition = (transitionId: string) => {
    if (transitionId === 'random') {
      setSelectedTransitions(['random']);
      return;
    }
    
    setSelectedTransitions(prev => {
      const newSelection = prev.filter(t => t !== 'random');
      if (newSelection.includes(transitionId)) {
        const filtered = newSelection.filter(t => t !== transitionId);
        return filtered.length === 0 ? ['random'] : filtered;
      } else {
        return [...newSelection, transitionId];
      }
    });
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
    images.forEach(img => formData.append('images', img.file));
    formData.append('youtubeUrl', youtubeUrl);
    formData.append('startTime', startTime);
    formData.append('transitions', JSON.stringify(selectedTransitions));
    formData.append('imageAnimations', JSON.stringify(images.map(img => img.animation)));
    formData.append('duration', duration.toString());
    formData.append('optimizeSize', optimizeSize.toString());
    if (bpm) formData.append('bpm', bpm);

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
    <div className="grid md:grid-cols-12 gap-8">
      {/* Left Sidebar - Settings & Templates */}
      <div className="md:col-span-5 space-y-6">
        {/* Template Selection Button */}
        <button
          onClick={() => setShowTemplateModal(true)}
          className="w-full bg-gray-900/50 p-4 rounded-2xl border border-gray-800 backdrop-blur-sm flex items-center justify-between hover:bg-gray-800/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
              <Wand2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-gray-200">Choose a Template</h2>
              <p className="text-xs text-gray-400">
                {selectedTemplate 
                  ? TEMPLATES.find(t => t.id === selectedTemplate)?.name 
                  : 'Select a style for your reel'}
              </p>
            </div>
          </div>
          <div className="text-cyan-400 text-sm font-medium">Browse</div>
        </button>

        {/* Template Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowTemplateModal(false)}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-cyan-400" />
                  Select Template
                </h2>
                <button 
                  onClick={() => setShowTemplateModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => {
                      applyTemplate(template.id);
                      setShowTemplateModal(false);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all group relative overflow-hidden ${
                      selectedTemplate === template.id
                        ? 'bg-cyan-900/20 border-cyan-500/50 shadow-lg shadow-cyan-900/10'
                        : 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="font-medium text-base mb-1 text-gray-200 group-hover:text-cyan-400 transition-colors">
                        {template.name}
                      </div>
                      <div className="text-sm text-gray-400 leading-relaxed">
                        {template.description}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
                          {template.config.duration}s
                        </span>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
                          {template.config.transitions.length > 1 ? 'Mixed Transitions' : 'Single Transition'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Section */}
        <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-pink-400" />
            Audio & Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Import Audio from Instagram</label>
              <div className="flex gap-2">
                <div className="relative flex-[2]">
                  <input 
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/reels/..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-3 pr-4 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <button
                  onClick={handleInstagramImport}
                  disabled={isImporting || !instagramUrl}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Import'}
                </button>
              </div>
            </div>

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
              <label className="block text-sm text-gray-400 mb-1">Beat Sync (BPM)</label>
              <div className="relative">
                <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(e.target.value)}
                  placeholder="Enter BPM (e.g. 120) to sync transitions"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Overrides total duration. Each image will last 1 beat.</p>
            </div>

            <div>
              <label className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                <input
                  type="checkbox"
                  checked={optimizeSize}
                  onChange={(e) => setOptimizeSize(e.target.checked)}
                  className="rounded border-gray-600 text-pink-500 focus:ring-pink-500 bg-gray-700 w-4 h-4"
                />
                <div>
                  <span className="text-sm text-gray-300 font-medium">Optimize for Size</span>
                  <p className="text-xs text-gray-500">Ensure video is under 10MB (may reduce quality)</p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Transition Styles</label>
              <div className="relative">
                <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {TRANSITIONS.map(t => (
                    <label key={t.id} className="flex items-center gap-2 p-2 hover:bg-gray-700/50 rounded cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedTransitions.includes(t.id)}
                        onChange={() => toggleTransition(t.id)}
                        className="rounded border-gray-600 text-pink-500 focus:ring-pink-500 bg-gray-700 w-4 h-4"
                      />
                      <span className="text-sm text-gray-300">{t.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Select multiple to randomize between them</p>
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

      {/* Right Content - Uploads & Preview */}
      <div className="md:col-span-7 space-y-6">
        {/* Upload Section */}
        <section className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 backdrop-blur-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Upload className="w-4 h-4 text-violet-400" />
            Upload Images
          </h2>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4 content-start">
            {images.map((img, i) => (
              <div 
                key={img.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                className={`relative aspect-[9/16] group cursor-move transition-opacity ${draggedItem === i ? 'opacity-50' : ''}`}
              >
                <img 
                  src={URL.createObjectURL(img.file)} 
                  alt={`Upload`}
                  className="w-full h-full object-cover rounded-lg pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1 rounded-lg">
                  <button 
                    onClick={() => removeImage(img.id)}
                    className="self-end p-0.5 bg-red-500/80 rounded-full hover:bg-red-600 transition-colors text-white"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                  <div className="w-full" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={img.animation}
                      onChange={(e) => updateImageAnimation(img.id, e.target.value)}
                      className="w-full bg-black/60 text-[10px] border border-gray-600 rounded px-0.5 py-0.5 focus:outline-none focus:border-pink-500 text-white mb-0.5"
                    >
                      <option value="random">Random</option>
                      <option value="zoomIn">Zoom In</option>
                      <option value="zoomOut">Zoom Out</option>
                      <option value="panLeft">Pan Left</option>
                      <option value="panRight">Pan Right</option>
                      <option value="panUp">Pan Up</option>
                      <option value="panDown">Pan Down</option>
                      <option value="diagTLBR">Diag TL-BR</option>
                      <option value="diagTRBL">Diag TR-BL</option>
                      <option value="pulse">Pulse</option>
                      <option value="shake">Shake</option>
                      <option value="spiral">Spiral</option>
                      <option value="sway">Sway</option>
                      <option value="bounce">Bounce</option>
                      <option value="dramaticZoom">Dram. Zoom</option>
                    </select>
                    <button
                      onClick={() => applyAnimationToAll(img.animation)}
                      className="w-full text-[8px] bg-violet-600/80 hover:bg-violet-600 text-white rounded px-1 py-0.5 transition-colors"
                      title="Apply this animation to all images"
                    >
                      Apply All
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <label className="aspect-[9/16] flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-violet-500 hover:bg-violet-500/10 transition-colors">
              <Upload className="w-5 h-5 text-gray-500 mb-1" />
              <span className="text-[10px] text-gray-500">Add</span>
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

        {/* Preview Section - Only show when video is ready */}
        {videoUrl && (
          <div className="relative aspect-[9/16] max-h-[600px] bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mx-auto w-full max-w-md">
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
          </div>
        )}
      </div>
    </div>
  );
}
