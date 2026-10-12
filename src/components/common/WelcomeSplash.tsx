import React, { useEffect, useState } from 'react';

interface WelcomeSplashProps {
  onFinish: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth 1.6s display timer + 250ms fadeout for instant crisp experience
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1500);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div 
      onClick={onFinish}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center text-white px-6 select-none cursor-pointer transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#070a0e' }}
    >
      {/* Background Subtle Radial Glow & Deep Navy/Leather Tone */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d1b2a]/60 via-[#070a0e] to-[#040608] pointer-events-none" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center justify-center text-center space-y-6 max-w-sm">
        
        {/* The Golden Dumbbell with Neon Heartbeat Pulse from User Reference */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Neon Glow Aura */}
          <div className="absolute -inset-4 rounded-3xl bg-emerald-500/25 blur-2xl animate-pulse" />
          
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-neutral-950 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/30 overflow-hidden p-1 flex items-center justify-center">
            <img 
              src="/images/icon-512.png" 
              alt="Built for Performance Dumbbell" 
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.currentTarget.src = '/images/brand-banner.jpg';
              }}
            />
          </div>

          {/* Luxury Gold Typography: Built for Performance */}
          <div className="mt-4 flex flex-col items-center">
            <span className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 drop-shadow-[0_2px_8px_rgba(234,179,8,0.35)]">
              Built for Performance
            </span>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1" />
          </div>
        </div>

        {/* Name and Branding */}
        <div className="space-y-1 pt-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
            Abdullah Qasim
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span className="text-xs sm:text-sm font-bold text-emerald-400 tracking-wider">
              Online Personal Trainer
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          </div>
        </div>

        {/* Minimalist Progress Bar */}
        <div className="w-36 h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-amber-400 rounded-full" 
            style={{
              animation: 'fillProgress 1.6s ease-in-out forwards'
            }}
          />
        </div>

      </div>

      <style>{`
        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
