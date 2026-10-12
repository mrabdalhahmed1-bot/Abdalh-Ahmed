import React from 'react';
import { useFitness } from '../../context/FitnessContext';
import { Sparkles, Trophy, Flame } from 'lucide-react';

export const CelebrationToast: React.FC = () => {
  const { toastCheer } = useFitness();

  if (!toastCheer) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-[99999] pointer-events-none px-4 w-full max-w-md flex justify-center animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-300">
      {toastCheer.type === 'individual' ? (
        <div className="bg-neutral-950/95 backdrop-blur-xl border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.55)] text-emerald-300 px-6 py-3 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-current animate-bounce" />
          </div>
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block font-bold">تسجيل إنجاز فوري:</span>
            <span className="text-base font-black text-white tracking-wide flex items-center gap-1.5">
              <span className="text-emerald-400 font-extrabold">{toastCheer.message}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950 via-neutral-950 to-neutral-900 backdrop-blur-xl border-2 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.65)] text-white p-4 sm:p-5 rounded-3xl flex items-center gap-4 text-center w-full">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-neutral-950 flex items-center justify-center shrink-0 shadow-xl shadow-amber-500/30">
            <Trophy className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div className="text-right flex-1">
            <span className="text-[10px] sm:text-xs font-black text-amber-300 uppercase tracking-widest block">
              🏆 إنجاز بطولي مكتمل اليوم!
            </span>
            <span className="text-sm sm:text-base font-black text-white block mt-0.5 leading-snug">
              {toastCheer.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
