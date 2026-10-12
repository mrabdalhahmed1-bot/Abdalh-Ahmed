import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, HeartPulse, Activity, Zap, ArrowLeft } from 'lucide-react';

interface BiologicalAgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  actualAge: number;
}

export const BiologicalAgeModal: React.FC<BiologicalAgeModalProps> = ({
  isOpen,
  onClose,
  actualAge = 26
}) => {
  const [step, setStep] = useState(1);
  const [sleepQuality, setSleepQuality] = useState<'good' | 'average' | 'poor'>('good');
  const [activityDays, setActivityDays] = useState<number>(4);
  const [hydrationLiters, setHydrationLiters] = useState<number>(3);
  const [stressLevel, setStressLevel] = useState<'low' | 'moderate' | 'high'>('low');
  const [isCalculated, setIsCalculated] = useState(false);

  if (!isOpen) return null;

  // Simple biological age algorithm
  let ageDelta = 0;
  if (sleepQuality === 'good') ageDelta -= 2;
  if (sleepQuality === 'poor') ageDelta += 3;
  if (activityDays >= 4) ageDelta -= 3;
  if (activityDays <= 1) ageDelta += 3;
  if (hydrationLiters >= 2.5) ageDelta -= 1;
  if (stressLevel === 'low') ageDelta -= 1;
  if (stressLevel === 'high') ageDelta += 2;

  const biologicalAge = Math.max(18, actualAge + ageDelta);

  const handleFinish = () => {
    setIsCalculated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-950 via-emerald-950/80 to-neutral-950 p-6 text-white relative border-b border-neutral-800">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center transition-colors text-neutral-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-3">
            <HeartPulse className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-black text-white">اختبار العمر البيولوجي</h3>
          <p className="text-neutral-400 text-xs mt-1">
            اكتشف العمر الحقيقي لخلايا جسمك ومستوى حيويتك مقارنة بعمرك الزمني
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isCalculated ? (
            <div className="space-y-5">
              
              {/* Question 1: Sleep */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">
                  1. كيف تصف جودة نومك اليومي؟
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['good', 'average', 'poor'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setSleepQuality(q)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        sleepQuality === q
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      {q === 'good' ? 'ممتاز (7-8 س)' : q === 'average' ? 'متوسط (5-6 س)' : 'متقطع وقليل'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Workout Activity */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">
                  2. كم يوماً تمارس الرياضة بالأسبوع؟
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 4, 6].map((days) => (
                    <button
                      key={days}
                      onClick={() => setActivityDays(days)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        activityDays === days
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      {days === 1 ? 'يوم' : days === 3 ? '3 أيام' : days === 4 ? '4-5 أيام' : '6+ أيام'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Hydration */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">
                  3. معدل شرب الماء اليومي:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1.5, 2.5, 3.5].map((liters) => (
                    <button
                      key={liters}
                      onClick={() => setHydrationLiters(liters)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        hydrationLiters === liters
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      {liters} لتر
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Stress */}
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">
                  4. مستوى الضغط والتوتر في يومك:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'moderate', 'high'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStressLevel(s)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        stressLevel === s
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      {s === 'low' ? 'هادئ ومسيطر' : s === 'moderate' ? 'متوسط' : 'مرتفع وضغط'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>احسب عمري البيولوجي الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-24 h-24 rounded-full bg-neutral-950 border-4 border-emerald-500 mx-auto flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-3xl font-black text-emerald-400">{biologicalAge}</span>
                <span className="text-[10px] font-bold text-neutral-400">سنة</span>
              </div>

              <div>
                <h4 className="text-lg font-black text-white">
                  {biologicalAge <= actualAge 
                    ? '🎉 ممتاز! عمرك البيولوجي أصغر من عمرك الحقيقي'
                    : '⚡ جسمك يحتاج تعزيز الالتزام بالخطة والاستشفاء!'}
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  عمرك الزمني: {actualAge} سنة · عمرك البيولوجي المحسوب: {biologicalAge} سنة
                </p>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-right space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>توصيات الكوتش لتحسين عمرك الحيوي:</span>
                </div>
                <p>• الالتزام بـ 8 ساعات نوم واستكمال الماء اليومي (3 لتر).</p>
                <p>• إكمال جدول المقاومة 4 أيام أسبوعياً مع تمارين المرونة.</p>
                <p>• تجنب السكريات المكررة والالتزام بماكروز البروتين.</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                العودة للتطبيق ومواصلة التدريب
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
