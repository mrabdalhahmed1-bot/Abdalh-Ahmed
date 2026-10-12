import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Activity, 
  Flame, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

interface MobilityCardioDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'mobility' | 'cardio';
  item: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    recommended: string;
    tips: string[];
  };
  value: string;
  completed: boolean;
  onValueChange: (val: string) => void;
  onToggleComplete: () => void;
  onOpenSwap: () => void;
}

export const MobilityCardioDetailModal: React.FC<MobilityCardioDetailModalProps> = ({
  isOpen,
  onClose,
  type,
  item,
  value,
  completed,
  onValueChange,
  onToggleComplete,
  onOpenSwap
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              {type === 'mobility' ? <Activity className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">{item.title}</h3>
                {completed && (
                  <span className="p-1 rounded-md bg-emerald-500 text-neutral-950">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">{item.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSwap}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استبدال</span>
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Box - Pure Technique Video */}
        <div className="relative w-full aspect-video bg-black border-b border-neutral-800 overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${
              type === 'mobility' ? 'FDwpXvS4q4s' : '9E_yH_oT-6s'
            }?autoplay=1&mute=1&controls=1&loop=1&playlist=${
              type === 'mobility' ? 'FDwpXvS4q4s' : '9E_yH_oT-6s'
            }&playsinline=1&rel=0&modestbranding=1`}
            title={`تكنيك ${item.title}`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Content & Inputs */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[50vh] overflow-y-auto">
          {/* Coaching Tips */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-black text-white">إرشادات الكوتش للأداء السليم:</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-neutral-300 pr-2 list-disc list-inside">
              {item.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Value Logging Inside Modal */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">
                {type === 'mobility' ? 'التكرار / المدة المنجزة (ثانية/عدة):' : 'المدة الزمنية المنجزة (دقيقة):'}
              </span>
              <span className="text-[10px] text-neutral-400">سجل الإنجاز لتأكيد التمرين</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-20 py-1.5 px-2 bg-neutral-900 border border-neutral-700 rounded-lg text-center font-mono font-bold text-sm text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={onToggleComplete}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  completed
                    ? 'bg-emerald-500 text-neutral-950 shadow-emerald-500/20'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-neutral-950'
                }`}
              >
                {completed ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>تم الإنجاز ✓</span>
                  </>
                ) : (
                  <span>إضافة وتأكيد</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={onOpenSwap}
            className="text-xs text-neutral-400 hover:text-emerald-400 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>استبدال مع كتابة السبب</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs shadow-md transition-all cursor-pointer"
          >
            حفظ وإغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
