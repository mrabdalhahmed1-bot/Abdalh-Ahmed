import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Bell, Volume2, X } from 'lucide-react';

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ 
  initialSeconds = 60, 
  isOpen, 
  onClose 
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  // Sync with initialSeconds when opened or changed by coach/exercise
  useEffect(() => {
    if (isOpen) {
      const dur = initialSeconds > 0 ? initialSeconds : 60;
      setTotalSeconds(dur);
      setSecondsLeft(dur);
      setIsRunning(true);
    }
  }, [isOpen, initialSeconds]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const isFinished = secondsLeft === 0;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 backdrop-blur-md border-2 border-emerald-500 rounded-3xl p-4 shadow-2xl text-neutral-100 w-[90%] max-w-sm animate-in slide-in-from-bottom duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isFinished ? 'bg-emerald-400' : 'bg-emerald-400 animate-ping'}`} />
          <div className="flex flex-col text-right">
            <span className="text-xs font-black text-white">راحة الجولة المعتمدة من الكوتش</span>
            <span className="text-[10px] text-emerald-400 font-bold">إلزامية ومحددة بدقة ({totalSeconds} ثانية)</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          title="إغلاق النافذة"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Countdown Display */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black font-mono tabular-nums text-emerald-400 tracking-wider">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-neutral-400 font-bold font-mono">
            / {String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:{String(totalSeconds % 60).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isFinished ? (
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all flex items-center gap-1 border border-neutral-700"
              title={isRunning ? 'إيقاف مؤقت' : 'متابعة'}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />}
              <span>{isRunning ? 'إيقاف' : 'استئناف'}</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500 text-neutral-950 font-black text-xs">
              انتهت الراحة ✓
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden mb-2 border border-neutral-800">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      {/* Mandatory Coach Lock Note */}
      <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80 text-[11px] text-neutral-300 flex items-center justify-between">
        <span className="text-neutral-400">فترة الاستشفاء المحددة من المدرب:</span>
        <strong className="text-emerald-400 font-mono font-bold">
          {totalSeconds === 60 ? 'دقيقة كاملة (60s)' : `${totalSeconds} ثانية`}
        </strong>
      </div>

      {isFinished && (
        <button
          onClick={onClose}
          className="mt-3 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-black rounded-xl transition-all shadow-md cursor-pointer"
        >
          ابدأ الجولة التالية الآن 💪
        </button>
      )}

    </div>
  );
};
