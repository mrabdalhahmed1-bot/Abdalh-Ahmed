import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { X, Send, Scale, Ruler, Camera, CheckCircle2 } from 'lucide-react';

interface CheckInSubmissionModalProps {
  onClose: () => void;
}

export const CheckInSubmissionModal: React.FC<CheckInSubmissionModalProps> = ({ onClose }) => {
  const { activeTrainee, submitWeeklyCheckIn } = useFitness();
  
  const nextWeekNumber = activeTrainee.checkIns.length > 0 
    ? Math.max(...activeTrainee.checkIns.map(c => c.weekNumber)) + 1 
    : 1;

  const [weightKg, setWeightKg] = useState<number>(activeTrainee.currentWeightKg - 0.4);
  const [waistCm, setWaistCm] = useState<number>(81);
  const [chestCm, setChestCm] = useState<number>(104);
  const [thighCm, setThighCm] = useState<number>(58.5);
  const [armCm, setArmCm] = useState<number>(38.5);
  const [hipsCm, setHipsCm] = useState<number>(96);
  
  const [dietAdherenceScore, setDietAdherenceScore] = useState<number>(9);
  const [workoutAdherenceScore, setWorkoutAdherenceScore] = useState<number>(10);
  const [sleepQualityScore, setSleepQualityScore] = useState<number>(8);
  const [hungerLevel, setHungerLevel] = useState<'منخفض' | 'معتدل' | 'مرتفع' | 'شديد'>('معتدل');
  const [digestionStatus, setDigestionStatus] = useState<'ممتاز' | 'طبيعي' | 'انتفاخ خفيف' | 'مشاكل هضمية'>('طبيعي');
  const [traineeNotes, setTraineeNotes] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitWeeklyCheckIn(activeTrainee.id, {
      weekNumber: nextWeekNumber,
      date: new Date().toISOString().split('T')[0],
      weightKg,
      measurements: {
        waistCm,
        chestCm,
        thighCm,
        armCm,
        hipsCm,
      },
      photoFrontUrl: activeTrainee.avatarUrl,
      photoBackUrl: activeTrainee.avatarUrl,
      dietAdherenceScore,
      workoutAdherenceScore,
      sleepQualityScore,
      hungerLevel,
      digestionStatus,
      traineeNotes: traineeNotes || 'أداء ممتاز هذا الأسبوع ولا توجد أي إصابات. بانتظار تقييمك يا كوتش!',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">إرسال تقرير المتابعة الأسبوعية (Check-in)</h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">الأسبوع رقم #{nextWeekNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Weight & Measurements */}
          <div className="space-y-3 bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Ruler className="w-4 h-4 text-emerald-400" />
              <span>الوزن الصباحي والقياسات بالسنتيمتر (على الريق بعد الاستيقاظ)</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">الوزن الصباحي (كغ) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm font-mono font-bold text-emerald-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">محيط الخصر (سم) *</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={waistCm}
                  onChange={(e) => setWaistCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm font-mono font-bold text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">محيط الصدر (سم)</label>
                <input
                  type="number"
                  step="0.5"
                  value={chestCm}
                  onChange={(e) => setChestCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">محيط الفخذ (سم)</label>
                <input
                  type="number"
                  step="0.5"
                  value={thighCm}
                  onChange={(e) => setThighCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">محيط الذراع (سم)</label>
                <input
                  type="number"
                  step="0.5"
                  value={armCm}
                  onChange={(e) => setArmCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">الحوض / الورك (سم)</label>
                <input
                  type="number"
                  step="0.5"
                  value={hipsCm}
                  onChange={(e) => setHipsCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm font-mono text-white"
                />
              </div>
            </div>
          </div>

          {/* Adherence & Biofeedback Scores */}
          <div className="space-y-4 bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
            <span className="text-xs font-bold text-white block">مؤشرات الاستجابة الحيوية والالتزام (1 - 10)</span>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-300">الالتزام بالوجبات والماكروز المقررة:</span>
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
                  <span className="text-neutral-300">الالتزام بتمارين الحديد والكارديو:</span>
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
                  <span className="text-neutral-300">جودة النوم والاستشفاء العضلي:</span>
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

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">مستوى الجوع خلال الأسبوع</label>
                <select
                  value={hungerLevel}
                  onChange={(e) => setHungerLevel(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="منخفض">منخفض (شبع تام)</option>
                  <option value="معتدل">معتدل وطبيعي</option>
                  <option value="مرتفع">مرتفع بعض الأيام</option>
                  <option value="شديد">شديد وصعب التحمل</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">حالة الهضم والقولون</label>
                <select
                  value={digestionStatus}
                  onChange={(e) => setDigestionStatus(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="ممتاز">ممتاز ومريح</option>
                  <option value="طبيعي">طبيعي</option>
                  <option value="انتفاخ خفيف">انتفاخ خفيف</option>
                  <option value="مشاكل هضمية">مشاكل هضمية ملحوظة</option>
                </select>
              </div>
            </div>
          </div>

          {/* Photo attach preview */}
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">صور المتابعة الأسبوعية</span>
                <span className="text-[11px] text-neutral-400">صورة أمامية وجانبية بنفس الإضاءة والتوقيت</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPhotoUploaded(!photoUploaded)}
              className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-semibold"
            >
              {photoUploaded ? '✓ تم تجهيز الصور' : '+ التقاط أو رفع'}
            </button>
          </div>

          {/* Trainee Notes */}
          <div>
            <label className="text-xs font-semibold text-white block mb-1.5">
              ملاحظاتك وأسئلتك للكوتش (كيف كان مستوى الطاقة، الأوزان، هل واجهتك أي صعوبات؟)
            </label>
            <textarea
              rows={3}
              value={traineeNotes}
              onChange={(e) => setTraineeNotes(e.target.value)}
              placeholder="اكتب كل ما تود إخبار الكوتش به عن أسبوعك..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>إرسال التقرير للكوتش الآن</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
