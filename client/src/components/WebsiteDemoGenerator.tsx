import React, { useState } from 'react';
import { Globe, Video, Loader2, Play, Download, Key } from 'lucide-react';

export function WebsiteDemoGenerator() {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a website URL');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setStatus('Initializing...');

    try {
      // Simulate progress steps for better UX
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) {
            setStatus('Analyzing website structure...');
            return prev + 2;
          } else if (prev < 60) {
            setStatus('Generating script and audio...');
            return prev + 1;
          } else if (prev < 90) {
            setStatus('Recording video demonstration...');
            return prev + 0.5;
          }
          return prev;
        });
      }, 1000);

      const response = await fetch('/api/generate-website-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, apiKey }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate demo');
      }

      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      setVideoUrl(videoUrl);
      setProgress(100);
      setStatus('Complete!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-8">
        <section className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Website Details
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">OpenAI API Key (Optional)</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Required for AI analysis. If omitted, a basic demo will be generated.
              </p>
            </div>
          </div>
        </section>

        <button
          onClick={handleSubmit}
          disabled={isGenerating || !url}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              {status} ({Math.round(progress)}%)
            </span>
          ) : (
            'Generate Website Demo'
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
              <span className="text-sm text-gray-400">Generated Demo</span>
              <a 
                href={videoUrl} 
                download="website-demo.mp4"
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
              <Video className="w-8 h-8 ml-1" />
            </div>
            <p className="text-lg font-medium mb-2">Your website demo will appear here</p>
            <p className="text-sm">Enter a URL and click generate to start</p>
          </div>
        )}
      </div>
    </div>
  );
}
