import React, { useState } from 'react';
import { TraineeProfile } from '../../types/fitness';
import { TrendingDown, Scale, Trophy, Ruler, Calendar, ArrowLeftRight } from 'lucide-react';
import { WeightProgressChart } from '../common/WeightProgressChart';

interface ProgressAnalyticsProps {
  trainee: TraineeProfile;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ trainee }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  // Checkins sorted chronologically
  const sortedCheckIns = [...trainee.checkIns].sort((a, b) => a.weekNumber - b.weekNumber);
  
  // Calculate total drop
  const totalDrop = (trainee.startingWeightKg - trainee.currentWeightKg).toFixed(1);
  const percentToGoal = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((trainee.startingWeightKg - trainee.currentWeightKg) /
          (trainee.startingWeightKg - trainee.targetWeightKg)) *
          100
      )
    )
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Main Weight Progress & Trend Indicator Chart */}
      <WeightProgressChart trainee={trainee} />

      {/* 2. Interactive Before & After Visual Slider */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">مقارنة التحول الجسدي التفاعلية (Transformation Slider)</h3>
            <p className="text-xs text-neutral-400">اسحب المؤشر لمقارنة الفرق بين نقطة البداية والحالة الحالية</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
            {sliderPosition}% الحالي
          </span>
        </div>

        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden select-none border border-neutral-800 bg-neutral-950">
          
          {/* After Image (Full width background) */}
          <img
            src="/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg"
            alt="Current Condition"
            className="absolute inset-0 w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-bold backdrop-blur-sm z-10">
            الآن ({trainee.currentWeightKg} كغ - نشاف وتقسيم)
          </div>

          {/* Before Image (Clipped by slider position) */}
          <div 
            className="absolute inset-y-0 right-0 overflow-hidden border-l-2 border-emerald-400"
            style={{ width: `${100 - sliderPosition}%` }}
          >
            <img
              src="/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg"
              alt="Before Condition"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-75 contrast-90"
              style={{ width: '100%', minWidth: '100%' }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 bg-neutral-900/90 border border-neutral-700 text-neutral-300 text-xs px-2.5 py-1 rounded-md font-bold backdrop-blur-sm">
              البداية ({trainee.startingWeightKg} كغ)
            </div>
          </div>

          {/* Slider Line & Handle */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />

          <div 
            className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center -translate-x-1/2 z-15"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-xl border-2 border-white">
              <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

        </div>
      </div>

      {/* Weight History Timeline */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">سجل تطور الوزن الأسبوعي (Weekly Weight Progression)</h3>
        
        <div className="space-y-3">
          {sortedCheckIns.map((chk, index) => {
            const prev = sortedCheckIns[index - 1];
            const change = prev ? (chk.weightKg - prev.weightKg).toFixed(1) : '0';

            return (
              <div 
                key={chk.id} 
                className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-white">
                    W{chk.weekNumber}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">الأسبوع {chk.weekNumber}</span>
                    <span className="text-[11px] text-neutral-500 font-mono">{chk.date} · الخصر: {chk.measurements.waistCm} سم</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-white block">{chk.weightKg} كغ</span>
                    <span className={`text-[10px] font-mono font-medium ${
                      parseFloat(change) < 0 ? 'text-emerald-400' : parseFloat(change) > 0 ? 'text-amber-400' : 'text-neutral-500'
                    }`}>
                      {parseFloat(change) < 0 ? `${change} كغ` : `+${change} كغ`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Records Showroom */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">أفضل الأرقام القياسية المحققة في النادي (Personal Records - PR)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trainee.personalRecords.map((pr, i) => (
            <div key={i} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-200 block">{pr.exerciseName}</span>
                <span className="text-[11px] text-neutral-500 font-mono mt-0.5 block">{pr.date}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-mono text-emerald-400">{pr.weightKg} كغ</span>
                <span className="text-[11px] text-neutral-400 block font-mono">{pr.reps} تكرارات</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
