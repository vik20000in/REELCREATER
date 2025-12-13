import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { SUNGLASSES } from '../data/sunglasses';
import { Loader2, Check, X, Glasses } from 'lucide-react';

interface SunglassesEditorProps {
  imageFile: File;
  onSave: (newFile: File) => void;
  onCancel: () => void;
}

export function SunglassesEditor({ imageFile, onSave, onCancel }: SunglassesEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [faces, setFaces] = useState<faceapi.FaceDetection[]>([]);
  const [landmarks, setLandmarks] = useState<faceapi.FaceLandmarks68[]>([]);
  const [scale, setScale] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Use local models for better performance and reliability
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading models:', error);
        // Fallback to CDN if local fails
        try {
          const CDN_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(CDN_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(CDN_URL),
          ]);
          setIsLoading(false);
        } catch (cdnError) {
          console.error('Error loading models from CDN:', cdnError);
          setIsLoading(false);
        }
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const detectFaces = async () => {
    if (!imageRef.current) return;
    
    setIsDetecting(true);
    try {
      // Ensure models are loaded
      if (!faceapi.nets.tinyFaceDetector.params) {
        throw new Error('Models not loaded');
      }

      // Small delay to allow UI to render loading state
      await new Promise(resolve => setTimeout(resolve, 100));

      const detections = await faceapi.detectAllFaces(
        imageRef.current, 
        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 })
      ).withFaceLandmarks();
      
      setFaces(detections.map(d => d.detection));
      setLandmarks(detections.map(d => d.landmarks));
      
      if (detections.length > 0 && !selectedStyle) {
        setSelectedStyle(SUNGLASSES[0].id);
      }
    } catch (error) {
      console.error('Error detecting faces:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    if (!isLoading && imageRef.current) {
      detectFaces();
    }
  }, [isLoading, previewUrl]);

  useEffect(() => {
    drawCanvas();
  }, [selectedStyle, landmarks, scale, offsetY, selectedColor]);

  const drawCanvas = async () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = imageRef.current.naturalWidth;
    canvas.height = imageRef.current.naturalHeight;

    // Draw original image
    ctx.drawImage(imageRef.current, 0, 0);

    if (selectedStyle && landmarks.length > 0) {
      const glassesSvg = SUNGLASSES.find(s => s.id === selectedStyle)?.svg;
      if (glassesSvg) {
        const coloredSvg = glassesSvg.replace(/currentColor/g, selectedColor);
        const glassesImg = new Image();
        const svgBlob = new Blob([coloredSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        glassesImg.onload = () => {
          landmarks.forEach(landmark => {
            const leftEye = landmark.getLeftEye();
            const rightEye = landmark.getRightEye();
            
            // Calculate eye centers
            const leftEyeCenter = leftEye.reduce((acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }), { x: 0, y: 0 });
            leftEyeCenter.x /= leftEye.length;
            leftEyeCenter.y /= leftEye.length;
            
            const rightEyeCenter = rightEye.reduce((acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }), { x: 0, y: 0 });
            rightEyeCenter.x /= rightEye.length;
            rightEyeCenter.y /= rightEye.length;

            // Calculate angle and width
            const dx = rightEyeCenter.x - leftEyeCenter.x;
            const dy = rightEyeCenter.y - leftEyeCenter.y;
            const angle = Math.atan2(dy, dx);
            const eyeDistance = Math.sqrt(dx * dx + dy * dy);
            
            // Glasses width should be wider than eye distance (approx 2x)
            const width = eyeDistance * 2.2 * scale;
            const height = width * 0.5; // Aspect ratio of SVG viewBox 200:100 = 2:1
            
            // Center point between eyes
            const centerX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
            const centerY = ((leftEyeCenter.y + rightEyeCenter.y) / 2) + (offsetY * eyeDistance);

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.drawImage(glassesImg, -width / 2, -height / 2, width, height);
            ctx.restore();
          });
          URL.revokeObjectURL(url);
        };
        glassesImg.src = url;
      }
    }
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const newFile = new File([blob], imageFile.name, { type: imageFile.type });
        onSave(newFile);
      }
    }, imageFile.type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Glasses className="w-5 h-5 text-violet-400" />
            Add Sunglasses
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Canvas Area */}
          <div className="flex-1 bg-black/50 relative flex items-center justify-center p-4 overflow-auto">
            {(isLoading || isDetecting) && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm gap-3 text-violet-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span>{isLoading ? 'Loading AI Models...' : 'Detecting Faces...'}</span>
              </div>
            )}
            
            {!isLoading && (
              <>
                <img 
                  ref={imageRef}
                  src={previewUrl}
                  alt="Original"
                  className="hidden"
                  onLoad={() => detectFaces()}
                  crossOrigin="anonymous"
                />
                <canvas 
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
                {landmarks.length === 0 && !isDetecting && !isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white pointer-events-none">
                    No faces detected
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar Controls */}
          <div className="w-full md:w-64 bg-gray-800/30 border-l border-gray-800 p-4 overflow-y-auto flex flex-col gap-6">
            
            {/* Adjustments */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Adjustments</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Size</span>
                    <span>{Math.round(scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Vertical Position</span>
                    <span>{offsetY > 0 ? '+' : ''}{Math.round(offsetY * 100)}</span>
                  </div>
                  <input
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.05"
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {['#000000', '#4B5563', '#DC2626', '#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777'].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="relative group">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer opacity-0 absolute inset-0 z-10"
                  />
                  <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center bg-gradient-to-br from-red-500 via-green-500 to-blue-500 group-hover:scale-105 transition-transform" />
                </div>
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Select Style</h3>
              <div className="grid grid-cols-2 gap-2">
                {SUNGLASSES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                      selectedStyle === style.id
                        ? 'bg-violet-600/20 border-violet-500'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div 
                      className="w-full aspect-[2/1] bg-white/10 rounded flex items-center justify-center p-1"
                      dangerouslySetInnerHTML={{ __html: style.svg.replace(/currentColor/g, selectedColor) }}
                    />
                    <span className="text-xs text-gray-300">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={landmarks.length === 0}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
}
