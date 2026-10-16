import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { X, Send, Scale, Ruler, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

interface CheckInSubmissionModalProps {
  onClose: () => void;
}

export const CheckInSubmissionModal: React.FC<CheckInSubmissionModalProps> = ({ onClose }) => {
  const { activeTrainee, submitWeeklyCheckIn, triggerCheer } = useFitness();
  
  const nextWeekNumber = activeTrainee.checkIns && activeTrainee.checkIns.length > 0 
    ? Math.max(...activeTrainee.checkIns.map(c => c.weekNumber)) + 1 
    : 1;

  // Measurement form inputs - strictly blank (empty strings) as requested by user
  const [weightKg, setWeightKg] = useState<string>('');
  const [neckCm, setNeckCm] = useState<string>('');
  const [chestCm, setChestCm] = useState<string>('');
  const [armRightCm, setArmRightCm] = useState<string>('');
  const [armLeftCm, setArmLeftCm] = useState<string>('');
  const [waistCm, setWaistCm] = useState<string>('');
  const [lowerBellyCm, setLowerBellyCm] = useState<string>('');
  const [thighRightCm, setThighRightCm] = useState<string>('');
  const [thighLeftCm, setThighLeftCm] = useState<string>('');
  const [calfCm, setCalfCm] = useState<string>('');

  // Adherence and biofeedback
  const [dietAdherenceScore, setDietAdherenceScore] = useState<number>(10);
  const [workoutAdherenceScore, setWorkoutAdherenceScore] = useState<number>(10);
  const [sleepQualityScore, setSleepQualityScore] = useState<number>(8);
  const [sleepHours, setSleepHours] = useState<string>('');
  const [hungerLevel, setHungerLevel] = useState<'منخفض' | 'معتدل' | 'مرتفع' | 'شديد'>('معتدل');
  const [digestionStatus, setDigestionStatus] = useState<'ممتاز' | 'طبيعي' | 'انتفاخ خفيف' | 'مشاكل هضمية'>('طبيعي');
  const [traineeNotes, setTraineeNotes] = useState<string>('');
  const [photoUploaded, setPhotoUploaded] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedWeight = parseFloat(weightKg) || activeTrainee.currentWeightKg || 75;
    const parsedWaist = parseFloat(waistCm) || 80;
    const parsedChest = parseFloat(chestCm) || 100;
    const parsedThigh = parseFloat(thighRightCm) || 55;
    const parsedArm = parseFloat(armRightCm) || 35;

    submitWeeklyCheckIn(activeTrainee.id, {
      weekNumber: nextWeekNumber,
      date: new Date().toISOString().split('T')[0],
      weightKg: parsedWeight,
      measurements: {
        waistCm: parsedWaist,
        chestCm: parsedChest,
        thighCm: parsedThigh,
        armCm: parsedArm,
        hipsCm: 0, // Item 11 removed as requested
      },
      photoFrontUrl: activeTrainee.avatarUrl,
      photoBackUrl: activeTrainee.avatarUrl,
      dietAdherenceScore,
      workoutAdherenceScore,
      sleepQualityScore,
      hungerLevel,
      digestionStatus,
      traineeNotes: traineeNotes || `تقرير القياسات للأسبوع ${nextWeekNumber} - الأوزان والقياسات مسجلة وجاهزة للتقييم.`,
    });

    triggerCheer('تم إرسال تقرير القياسات (Check-In) للكوتش عبدالله بنجاح! 🚀📊');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-neutral-100 my-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black text-white">
                استمارة تقرير القياسات الدوري (Check-In الدوري)
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono mt-0.5 block">
              تقرير كل أسبوعين · الأسبوع رقم #{nextWeekNumber}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Note Banner */}
          <div className="p-3.5 bg-neutral-950/80 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-xs text-neutral-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="leading-relaxed">
              يرجى إدخال القياسات صباحاً على الريق بعد الاستيقاظ مباشرة للحصول على أدق قراءات لتطور نسبة الدهون والكتلة العضلية.
            </p>
          </div>

          {/* Section: Numbered Measurements (Ordered & Clean, Inbody #3 removed, Pelvis #11 removed) */}
          <div className="space-y-3 bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
            <span className="text-xs font-black text-white flex items-center gap-2">
              <Ruler className="w-4 h-4 text-emerald-400" />
              <span>جدول القياسات الدورية (فارغ للإدخال المباشر)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Field 1: Weight */}
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  1. الوزن صباحاً على الريق (كغ) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="مثال: 78.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold text-emerald-400 outline-none placeholder:text-neutral-600"
                />
              </div>

              {/* Field 2: Neck */}
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  2. محيط الرقبة (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="مثال: 39"
                  value={neckCm}
                  onChange={(e) => setNeckCm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none placeholder:text-neutral-600"
                />
              </div>

              {/* Field 3: Chest */}
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  3. محيط الصدر عند الحلمتين (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="مثال: 104"
                  value={chestCm}
                  onChange={(e) => setChestCm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none placeholder:text-neutral-600"
                />
              </div>

              {/* Field 4: Arm Right */}
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  4. محيط الذراع الأيمن (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="مثال: 38"
                  value={armRightCm}
                  onChange={(e) => setArmRightCm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none placeholder:text-neutral-600"
                />
              </div>

              {/* Field 5: Arm Left */}
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  5. محيط الذراع الأيسر (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="مثال: 37.5"
                  value={armLeftCm}
                  onChange={(e) => setArmLeftCm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none placeholder:text-neutral-600"
                />
              </div>

              {/* Field 6: Waist at navel */}
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  6. محيط الخصر عند السرة (سم) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="مثال: 81"
                  value={waistCm}
                  onChange={(e) => setWaistCm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none placeholder:text-neutral-600"
                />
              </div>

              {/* Field 7: Lower belly */}
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  7. محيط البطن السفلي تحت السرة (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="مثال: 84"
                  value={lowerBellyCm}
                  onChange={(e) => setLowerBellyCm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none placeholder:text-neutral-600"
                />
              </div>

              {/* Field 8: Thigh Right */}
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  8. محيط الفخذ الأيمن (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="مثال: 58"
                  value={thighRightCm}
                  onChange={(e) => setThighRightCm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none placeholder:text-neutral-600"
                />
              </div>

              {/* Field 9: Thigh Left */}
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  9. محيط الفخذ الأيسر (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="مثال: 58"
                  value={thighLeftCm}
                  onChange={(e) => setThighLeftCm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none placeholder:text-neutral-600"
                />
              </div>

              {/* Field 10: Calf */}
              <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  10. محيط بطة الساق / السمانة (سم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="مثال: 38"
                  value={calfCm}
                  onChange={(e) => setCalfCm(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold text-white outline-none placeholder:text-neutral-600"
                />
              </div>

            </div>
          </div>

          {/* Field 11: Progress Photos */}
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  11. صور المتابعة الدورية (أمامية - جانبية - خلفية)
                </span>
                <span className="text-[11px] text-neutral-400">بنفس الإضاءة والزاوية صباحاً على الريق</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPhotoUploaded(!photoUploaded)}
              className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-black cursor-pointer"
            >
              {photoUploaded ? '✓ تم تجهيز الصور' : '+ التقاط أو رفع'}
            </button>
          </div>

          {/* Fields 12, 13, 14, 15: Adherence & Biofeedback Scores */}
          <div className="space-y-4 bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
            <span className="text-xs font-black text-white block">
              12 - 15. مؤشرات الالتزام والاستجابة الحيوية
            </span>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-300">12. الالتزام بالوجبات والماكروز المقررة:</span>
                  <span className="font-mono text-emerald-400 font-bold">{dietAdherenceScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={dietAdherenceScore}
                  onChange={(e) => setDietAdherenceScore(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-300">13. الالتزام بجدول التمارين والكارديو:</span>
                  <span className="font-mono text-emerald-400 font-bold">{workoutAdherenceScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={workoutAdherenceScore}
                  onChange={(e) => setWorkoutAdherenceScore(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-300">14. جودة النوم والاستشفاء العضلي:</span>
                  <span className="font-mono text-emerald-400 font-bold">{sleepQualityScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleepQualityScore}
                  onChange={(e) => setSleepQualityScore(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">15. أ. مستوى الجوع والشهية</label>
                <select
                  value={hungerLevel}
                  onChange={(e) => setHungerLevel(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white"
                >
                  <option value="منخفض">منخفض (شبع تام)</option>
                  <option value="معتدل">معتدل وطبيعي</option>
                  <option value="مرتفع">مرتفع بعض الأيام</option>
                  <option value="شديد">شديد وصعب التحمل</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">15. ب. حالة الهضم والقولون</label>
                <select
                  value={digestionStatus}
                  onChange={(e) => setDigestionStatus(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white"
                >
                  <option value="ممتاز">ممتاز ومريح</option>
                  <option value="طبيعي">طبيعي</option>
                  <option value="انتفاخ خفيف">انتفاخ خفيف</option>
                  <option value="مشاكل هضمية">مشاكل هضمية ملحوظة</option>
                </select>
              </div>
            </div>
          </div>

          {/* Field 16: Trainee Notes */}
          <div>
            <label className="text-xs font-bold text-white block mb-1.5">
              16. ملاحظاتك وأسئلتك للكوتش (الأوزان، مستويات الطاقة، أو أي استفسار)
            </label>
            <textarea
              rows={3}
              value={traineeNotes}
              onChange={(e) => setTraineeNotes(e.target.value)}
              placeholder="اكتب ملاحظاتك وتطور أوزانك واستفساراتك للكوتش هنا..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال تقرير القياسات للكوتش الآن</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
