import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Award } from 'lucide-react';
import { ThreeBackground } from './ThreeBackground';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Page } from '../types';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  
  // --- CONFIGURATION DES IMAGES ---
  
  // Les images doivent être placées physiquement à la racine du projet 
  // (au même niveau que le fichier index.html).
  // On les appelle simplement par leur nom de fichier.
  const AFTER_IMAGE = "/apres.jpg";
  const BEFORE_IMAGE = "/avant.jpg";

  return (
    <div className="relative w-full min-h-screen bg-[#050511] overflow-hidden text-white flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* 3D Background (Cubes imbriqués) */}
      <ThreeBackground />

      {/* Navbar Minimaliste */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">NovelPix<span className="text-indigo-400">Studio</span></span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
           <span className="text-sm font-medium text-slate-400 hover:text-white cursor-pointer transition-colors">Showcase</span>
           <span className="text-sm font-medium text-slate-400 hover:text-white cursor-pointer transition-colors">Tarifs</span>
           <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate('studio'); }}
            className="text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/5 px-5 py-2 rounded-full transition-all"
           >
            Connexion
          </a>
        </div>
      </nav>

      {/* Main Layout: Split or Centered Focus */}
      <main className="relative z-20 flex-grow flex flex-col items-center justify-center px-4 lg:px-8 pt-10 pb-20">
        
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-bottom-10 duration-1000">
            
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-indigo-950/30 border border-indigo-500/30 rounded-full pl-2 pr-4 py-1.5 backdrop-blur-md mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-semibold text-indigo-200 tracking-wide uppercase">Neural Engine v2.4</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
              Révélez le potentiel <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                de l'Invisible.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Transformez instantanément des espaces vides en intérieurs d'exception. 
              L'outil ultime pour architectes et promoteurs. Laissez l'IA meubler vos rêves.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a 
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate('studio'); }}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="mr-2 w-5 h-5 animate-pulse" />
                Lancer le Studio
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-white/40 transition-all" />
              </a>
              
              <button className="text-sm font-semibold text-slate-400 hover:text-white px-6 py-4 flex items-center transition-colors">
                Voir la démo <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-xs font-medium text-slate-500 uppercase tracking-widest">
              <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" /> Sécurisé</div>
              <div className="flex items-center"><Zap className="w-4 h-4 mr-2 text-purple-500" /> Rendu &lt; 10s</div>
              <div className="flex items-center"><Award className="w-4 h-4 mr-2 text-pink-500" /> Qualité premium</div>
            </div>
          </div>

          {/* Right Column: The "Window" Widget */}
          <div className="relative w-full max-w-[500px] mx-auto perspective-1000 animate-in fade-in zoom-in duration-1000 delay-300">
            
            {/* Decorative Glow behind the window */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 rounded-[2rem] blur-2xl -z-10" />
            
            {/* The Main Window Card */}
            <div className="relative bg-[#0f111a]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5 transform transition-transform hover:scale-[1.01] duration-500">
              
              {/* Window Header (MacOS style) */}
              <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-white/5">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="text-[10px] font-mono text-slate-500">Aperçu</div>
                <div className="w-12"></div> {/* Spacer for center alignment */}
              </div>

              {/* The Slider Content */}
              {/* Aspect ratio 3/2 plus adapté aux photos standard d'immobilier */}
              <div className="relative aspect-[3/2] w-full bg-slate-900">
                <BeforeAfterSlider 
                  beforeImage={BEFORE_IMAGE}
                  afterImage={AFTER_IMAGE}
                  isProcessing={false}
                />
                
                {/* Floating "AI Ready" Badge inside image */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-2 border border-white/10 pointer-events-none z-20">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold tracking-wider text-green-400">AI READY</span>
                </div>
              </div>

              {/* Window Footer / Caption */}
              <div className="p-4 bg-[#0a0a12] border-t border-white/5 flex justify-between items-center">
                <div>
                   <h3 className="text-sm font-semibold text-white">Séjour de Caractère</h3>
                   <p className="text-xs text-slate-500">Généré par Lumina Neural Engine</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                </div>
              </div>

            </div>

            {/* Decorative elements around window */}
            <div className="absolute -right-12 -top-12 opacity-20 hidden lg:block">
               <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="text-white animate-spin-slow">
                 <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
               </svg>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};