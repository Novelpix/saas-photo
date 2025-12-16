import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Settings, 
  Wand2, 
  AlertCircle, 
  CheckCircle2, 
  Home,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  InteriorStyle, 
  DesignFormData, 
  INITIAL_FORM_STATE, 
  FURNITURE_TYPES,
  Page
} from '../types';
import { generateInteriorDesign } from '../services/api';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface StudioPageProps {
  onNavigate: (page: Page) => void;
}

export const StudioPage: React.FC<StudioPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<DesignFormData>(INITIAL_FORM_STATE);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      setError("Veuillez télécharger un fichier image valide (JPG/PNG).");
      return;
    }
    setError(null);
    setFormData(prev => ({ ...prev, image: file }));
    setResultUrl(null); // Reset result on new upload
    
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.image) {
      setError("Veuillez d'abord télécharger une image.");
      return;
    }

    if (!formData.email) {
      setError("Veuillez fournir une adresse email.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await generateInteriorDesign(formData);
      setResultUrl(result);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la génération.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Render ---

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* LEFT PANEL: Canvas / Visualization */}
      <div className="flex-1 relative flex flex-col h-full bg-slate-900/50">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full z-10 p-4 flex justify-between items-center bg-gradient-to-b from-slate-900/90 to-transparent">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}
            className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight hidden sm:block">NovelPix<span className="text-indigo-400">Studio</span></span>
          </a>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Espace de travail v2.1</div>
        </header>

        {/* Main Display Area */}
        <div className="flex-1 p-4 lg:p-8 flex items-center justify-center pt-20">
          <div className="w-full h-full max-w-5xl bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-700/50 relative overflow-hidden flex items-center justify-center group transition-all duration-300 hover:border-slate-600/50">
            
            {!previewUrl ? (
              // Empty State / Drop Zone
              <div 
                className="text-center p-10 cursor-pointer w-full h-full flex flex-col items-center justify-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-black/20">
                  <Upload className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Chargez votre espace</h3>
                <p className="text-slate-400 mb-6 max-w-xs mx-auto">Glissez-déposez votre photo ici, ou cliquez pour parcourir. JPG & PNG supportés.</p>
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">
                  Choisir un fichier
                </button>
              </div>
            ) : (
              // Image Loaded / Result Display
              <div className="w-full h-full p-2">
                 <BeforeAfterSlider 
                    beforeImage={previewUrl} 
                    afterImage={resultUrl} 
                    isProcessing={isProcessing} 
                 />
                 
                 {/* Re-upload overlay button (small) */}
                 {!isProcessing && (
                   <button 
                    onClick={() => {
                        setResultUrl(null);
                        setPreviewUrl(null);
                        setFormData(prev => ({...prev, image: null}));
                    }}
                    className="absolute top-6 right-6 bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-lg border border-slate-700 backdrop-blur-md transition-all z-20"
                    title="Réinitialiser / Nouvelle image"
                   >
                     <RefreshCw className="w-4 h-4" />
                   </button>
                 )}
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg" 
              onChange={handleFileChange} 
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Controls */}
      <div className="w-full lg:w-[400px] bg-slate-900 border-l border-slate-800 flex flex-col h-[50vh] lg:h-full z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Settings className="w-5 h-5 mr-2 text-indigo-500" />
            Configuration
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Style Selection - Animated Grid */}
          <section>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Style de Design</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(InteriorStyle).map((style) => (
                <label 
                  key={style}
                  className={`
                    relative cursor-pointer rounded-xl p-4 border flex flex-col items-center justify-center text-center gap-2 overflow-hidden group
                    transition-all duration-300 ease-out
                    ${formData.style === style 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02] ring-1 ring-indigo-500/50' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600 hover:scale-[1.01] hover:text-slate-300'}
                  `}
                >
                  <input 
                    type="radio" 
                    name="style" 
                    value={style} 
                    checked={formData.style === style}
                    onChange={(e) => setFormData({...formData, style: e.target.value as InteriorStyle})}
                    className="hidden"
                  />
                  
                  {/* Active Indicator Checkmark */}
                  <div className={`
                    absolute top-3 right-3 transition-all duration-300 ease-in-out
                    ${formData.style === style ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-2'}
                  `}>
                    <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {/* Icon Placeholder (Optional - adds nice touch) */}
                  <div className={`
                    p-2 rounded-full mb-1 transition-all duration-300
                    ${formData.style === style ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700/50 text-slate-500 group-hover:bg-slate-700'}
                  `}>
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <span className="font-medium text-sm relative z-10">{style}</span>
                  
                  {/* Subtle Background Glow for Active State */}
                  {formData.style === style && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
                  )}
                </label>
              ))}
            </div>
          </section>

          {/* Furniture Type */}
          <section>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Type de Pièce</label>
             <div className="relative group">
               <select 
                 value={formData.furniture_type}
                 onChange={(e) => setFormData({...formData, furniture_type: e.target.value})}
                 className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition-colors group-hover:border-slate-600"
               >
                 {FURNITURE_TYPES.map(type => (
                   <option key={type} value={type}>{type}</option>
                 ))}
               </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-white transition-colors">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </div>
             </div>
          </section>

          {/* Intensity Slider */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Intensité Créative</label>
              <span className={`text-xs font-mono font-bold px-2 py-1 rounded transition-colors ${formData.intensity > 80 ? 'text-purple-400 bg-purple-500/10' : 'text-indigo-400 bg-indigo-500/10'}`}>
                {formData.intensity}%
              </span>
            </div>
            <div className="relative h-6 flex items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={formData.intensity}
                onChange={(e) => setFormData({...formData, intensity: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 z-10"
              />
              <div 
                className="absolute h-2 bg-indigo-500 rounded-l-lg pointer-events-none" 
                style={{ width: `${formData.intensity}%` }} 
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2">
              <span>Subtil</span>
              <span>Équilibré</span>
              <span>Extrême</span>
            </div>
          </section>

          {/* Options Checkboxes */}
          <section className="space-y-3">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Options d'Amélioration</label>
             
             <label className={`
               flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
               ${formData.renovate_walls ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}
             `}>
               <div className={`
                 w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 
                 ${formData.renovate_walls ? 'bg-indigo-600 border-indigo-600 scale-110' : 'border-slate-500'}
               `}>
                 <CheckCircle2 className={`w-3.5 h-3.5 text-white transition-opacity ${formData.renovate_walls ? 'opacity-100' : 'opacity-0'}`} />
               </div>
               <input 
                 type="checkbox" 
                 checked={formData.renovate_walls}
                 onChange={(e) => setFormData({...formData, renovate_walls: e.target.checked})}
                 className="hidden"
               />
               <span className={`text-sm transition-colors ${formData.renovate_walls ? 'text-white' : 'text-slate-300'}`}>Rénover les murs</span>
             </label>

             <label className={`
               flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
               ${formData.change_floor ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}
             `}>
               <div className={`
                 w-5 h-5 rounded border flex items-center justify-center transition-all duration-200
                 ${formData.change_floor ? 'bg-indigo-600 border-indigo-600 scale-110' : 'border-slate-500'}
               `}>
                 <CheckCircle2 className={`w-3.5 h-3.5 text-white transition-opacity ${formData.change_floor ? 'opacity-100' : 'opacity-0'}`} />
               </div>
               <input 
                 type="checkbox" 
                 checked={formData.change_floor}
                 onChange={(e) => setFormData({...formData, change_floor: e.target.checked})}
                 className="hidden"
               />
               <span className={`text-sm transition-colors ${formData.change_floor ? 'text-white' : 'text-slate-300'}`}>Changer le sol</span>
             </label>
          </section>

          {/* Description */}
          <section>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Description / Demandes</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Ex: Plus lumineux, ajouter des plantes, éclairage chaleureux..."
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-lg p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 resize-none transition-all"
            />
          </section>

           {/* Email */}
           <section>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Email pour recevoir le rendu</label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="nom@exemple.com"
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </section>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-2 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 sticky bottom-0 z-10">
          <button 
            onClick={handleSubmit}
            disabled={isProcessing || !formData.image}
            className={`
              w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-300 shadow-lg relative overflow-hidden group
              ${isProcessing 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-indigo-500/25 transform hover:-translate-y-0.5'}
            `}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Générer le rendu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};