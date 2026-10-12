import React, { useState } from 'react';
import { X, FileText, Calendar, Dumbbell, Utensils, CheckCircle2 } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

interface PastLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PastLogsModal: React.FC<PastLogsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { activeTrainee } = useFitness();
  const [tab, setTab] = useState<'checkins' | 'meals'>('checkins');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">سجل التسجيلات والتقارير السابقة</h3>
              <p className="text-[11px] text-neutral-400">مراجعة تقاريرك ووجباتك السابقة</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-neutral-800 px-6 pt-3 gap-6 bg-neutral-950/60">
          <button
            onClick={() => setTab('checkins')}
            className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
              tab === 'checkins' ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            تقارير المتابعة الأسبوعية ({activeTrainee.checkIns.length})
            {tab === 'checkins' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-500 rounded-full" />}
          </button>
          <button
            onClick={() => setTab('meals')}
            className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
              tab === 'meals' ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            سجل وجبات اليوم ({activeTrainee.loggedMeals.length})
            {tab === 'meals' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-500 rounded-full" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3 max-h-[420px] overflow-y-auto">
          {tab === 'checkins' ? (
            activeTrainee.checkIns.length > 0 ? (
              activeTrainee.checkIns.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-white">الأسبوع {c.weekNumber}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{c.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center bg-neutral-900 p-2.5 rounded-xl text-xs border border-neutral-800">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">الوزن</span>
                      <span className="font-bold text-white">{c.weightKg} كغ</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">الخصر</span>
                      <span className="font-bold text-white">{c.measurements?.waistCm || 82} سم</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">التزام الدايت</span>
                      <span className="font-bold text-emerald-400">{c.dietAdherenceScore || 9}/10</span>
                    </div>
                  </div>
                  {c.coachFeedback && (
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200">
                      <span className="font-bold text-emerald-400 block mb-0.5">رد الكوتش:</span>
                      <p className="text-neutral-300 italic">"{c.coachFeedback.feedbackText}"</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-neutral-400">لا توجد تقارير أسبوعية مسجلة بعد</p>
            )
          ) : (
            activeTrainee.loggedMeals.length > 0 ? (
              activeTrainee.loggedMeals.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{m.name}</span>
                    <span className="text-[10px] text-neutral-400">
                      {m.mealType === 'breakfast' ? 'فطور' : m.mealType === 'lunch' ? 'غداء' : m.mealType === 'dinner' ? 'عشاء' : 'سناك'} • {m.serving}
                    </span>
                  </div>
                  <div className="text-left font-mono">
                    <span className="font-bold text-emerald-400">{m.calories} Cal</span>
                    <span className="text-[10px] text-neutral-400 block">P: {m.protein}g</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-neutral-400">لم يتم تسجيل وجبات اليوم بعد</p>
            )
          )}
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
