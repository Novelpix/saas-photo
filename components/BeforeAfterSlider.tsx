import React, { useState, useRef, useEffect } from 'react';
import { ChevronsLeftRight, ImageOff } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string | null;
  isProcessing?: boolean;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  isProcessing,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [imageError, setImageError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e as React.MouseEvent).clientX || (e as MouseEvent).clientX) - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setSliderPosition(position);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove as any);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, []);

  const handleError = (imgName: string) => {
    setImageError(`Impossible de charger l'image : ${imgName}`);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-slate-900 flex items-center justify-center rounded-lg shadow-2xl border border-slate-700/50"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* ERROR STATE */}
      {imageError && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-center p-6">
          <ImageOff className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-400 font-semibold mb-2">Erreur de chargement</p>
          <p className="text-slate-400 text-xs font-mono break-all bg-black/30 p-2 rounded">
            {imageError}
          </p>
          <p className="text-slate-500 text-xs mt-4">
            Vérifiez que le fichier existe bien dans le dossier public.
          </p>
        </div>
      )}

      {/* --- AFTER IMAGE (Background Layer - visible à droite) --- */}
      {afterImage && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={afterImage}
            alt="Après (Fini)"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            onError={() => handleError(afterImage)}
          />
        </div>
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/70 z-30 flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-500">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            </div>
          </div>
          <p className="mt-4 text-indigo-300 font-medium tracking-wider animate-pulse">GÉNÉRATION EN COURS...</p>
        </div>
      )}

      {/* --- BEFORE IMAGE (Foreground Layer - visible à gauche) --- */}
      {!isProcessing && (
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={afterImage ? { clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` } : undefined}
        >
          <img
            src={beforeImage}
            alt="Avant (Chantier)"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            onError={() => handleError(beforeImage)}
          />
        </div>
      )}

      {/* Slider Handle */}
      {afterImage && !isProcessing && !imageError && (
        <div
          className="absolute inset-y-0 z-20 w-1 bg-white/80 cursor-ew-resize hover:bg-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.5)]"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={() => isDragging.current = true}
          onTouchEnd={() => isDragging.current = false}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-ew-resize group">
            <ChevronsLeftRight className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </div>
        </div>
      )}

      {/* Labels */}
      {!imageError && (
        <>
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-10 shadow-lg">
            <span className="text-xs font-bold text-white tracking-widest uppercase">Avant Travaux</span>
          </div>
          {afterImage && !isProcessing && (
            <div className="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-400/30 z-10 shadow-lg">
              <span className="text-xs font-bold text-white tracking-widest uppercase">Projet Fini</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};