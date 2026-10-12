import React, { useState } from 'react';
import { WeeklyCheckIn, TraineeProfile } from '../../types/fitness';
import { useFitness } from '../../context/FitnessContext';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  ArrowDownRight, 
  ArrowUpRight, 
  Scale, 
  Ruler, 
  MessageSquare,
  Mic,
  Calendar,
  Volume2
} from 'lucide-react';

interface CheckInReviewModalProps {
  checkIn: WeeklyCheckIn;
  trainee: TraineeProfile;
  onClose: () => void;
}

export const CheckInReviewModal: React.FC<CheckInReviewModalProps> = ({ checkIn, trainee, onClose }) => {
  const { reviewCheckIn } = useFitness();
  const [feedbackText, setFeedbackText] = useState(
    checkIn.coachFeedback?.feedbackText || ''
  );
  const [targetAdjustment, setTargetAdjustment] = useState(
    checkIn.coachFeedback?.nextWeekTargetAdjustment || ''
  );
  const [photoViewMode, setPhotoViewMode] = useState<'sideBySide' | 'frontOnly'>('sideBySide');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(false);

  // Find previous check-in for comparison
  const previousCheckIn = trainee.checkIns.find(c => c.weekNumber === checkIn.weekNumber - 1) 
    || trainee.checkIns.find(c => c.id !== checkIn.id);

  const weightDiff = previousCheckIn 
    ? (checkIn.weightKg - previousCheckIn.weightKg).toFixed(1)
    : (checkIn.weightKg - trainee.startingWeightKg).toFixed(1);

  const waistDiff = previousCheckIn?.measurements?.waistCm
    ? (checkIn.measurements.waistCm - previousCheckIn.measurements.waistCm).toFixed(1)
    : null;

  const handleGenerateAiFeedback = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const dropAmount = Math.abs(parseFloat(weightDiff));
      const text = `عاش يا ${trainee.fullName.split(' ')[0]}! تقرير أسبوعي متميز للأسبوع ${checkIn.weekNumber}. النزول بمقدار ${dropAmount} كغ مع قياس الخصر (${checkIn.measurements.waistCm} سم) يعكس حرق دهون نقي والتزام 100% بالخطة الغذائية. مستويات الطاقة وجودة النوم ممتازة ومطمئنة، وسنستمر في دفع الأوزان بالتمارين الأساسية بنفس القوة.`;
      setFeedbackText(text);
      setTargetAdjustment(`المحافظة على السعرات (${trainee.macroGoals.calories} سعرة) وإضافة 5 دقائق كارب منخفض الشدة بعد تمرين الأرجل.`);
      setIsAiGenerating(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    reviewCheckIn(checkIn.id, feedbackText, targetAdjustment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-500/40">
              <img 
                src={trainee.avatarUrl} 
                alt={trainee.fullName} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">مراجعة المتابعة الأسبوعية</h3>
                <span className="text-xs text-emerald-400 font-mono">الأسبوع {checkIn.weekNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>{trainee.fullName}</span>
                <span>·</span>
                <span>تاريخ التقرير: {checkIn.date}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Key Metrics Comparison Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>الوزن الحالي</span>
                <Scale className="w-3.5 h-3.5 text-neutral-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono tabular-nums text-white">
                  {checkIn.weightKg} <span className="text-xs font-normal text-neutral-400">كغ</span>
                </span>
                <span className={`text-xs font-mono font-medium flex items-center ${
                  parseFloat(weightDiff) < 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {parseFloat(weightDiff) < 0 ? <ArrowDownRight className="w-3.5 h-3.5 ml-0.5" /> : <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />}
                  {weightDiff} كغ
                </span>
              </div>
              <span className="text-[11px] text-neutral-500">مقارنة بالأسبوع السابق</span>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>محيط الخصر</span>
                <Ruler className="w-3.5 h-3.5 text-neutral-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono tabular-nums text-white">
                  {checkIn.measurements.waistCm} <span className="text-xs font-normal text-neutral-400">سم</span>
                </span>
                {waistDiff && (
                  <span className="text-xs font-mono font-medium text-emerald-400 flex items-center">
                    <ArrowDownRight className="w-3.5 h-3.5 ml-0.5" />
                    {waistDiff} سم
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-500">مؤشر فقدان الدهون الحشوية</span>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>التزام التغذية والدايت</span>
                <span className="text-[11px] font-mono text-emerald-400">{checkIn.dietAdherenceScore * 10}%</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-white">
                {checkIn.dietAdherenceScore} / 10
              </div>
              <span className="text-[11px] text-neutral-500">مستوى الجوع: {checkIn.hungerLevel}</span>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>التزام التمارين والنوم</span>
                <span className="text-[11px] font-mono text-emerald-400">{checkIn.workoutAdherenceScore * 10}%</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-white">
                {checkIn.workoutAdherenceScore} / 10
              </div>
              <span className="text-[11px] text-neutral-500">جودة النوم: {checkIn.sleepQualityScore}/10</span>
            </div>
          </div>

          {/* Measurements Deep Matrix */}
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              تفاصيل قياسات الجسم بالسنتيمتر (Body Measurements)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800/80">
                <span className="text-xs text-neutral-400 block mb-0.5">الصدر</span>
                <span className="text-base font-bold font-mono tabular-nums text-white">{checkIn.measurements.chestCm} سم</span>
              </div>
              <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800/80">
                <span className="text-xs text-neutral-400 block mb-0.5">الذراع</span>
                <span className="text-base font-bold font-mono tabular-nums text-white">{checkIn.measurements.armCm} سم</span>
              </div>
              <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800/80">
                <span className="text-xs text-neutral-400 block mb-0.5">الفخذ</span>
                <span className="text-base font-bold font-mono tabular-nums text-white">{checkIn.measurements.thighCm} سم</span>
              </div>
              <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800/80">
                <span className="text-xs text-neutral-400 block mb-0.5">الورك / الحوض</span>
                <span className="text-base font-bold font-mono tabular-nums text-white">{checkIn.measurements.hipsCm || '-'} سم</span>
              </div>
            </div>
          </div>

          {/* Trainee Notes Section */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-semibold text-white">ملاحظات المتدرب للأسبوع</h4>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-900/60 p-3 rounded-lg border border-neutral-800">
              "{checkIn.traineeNotes || 'لم يكتب المتدرب ملاحظات إضافية لهذا الأسبوع.'}"
            </p>
          </div>

          {/* Visual Transformation / Photos Comparison */}
          <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-white">صور المتابعة وتطور الجسم</h4>
              <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPhotoViewMode('sideBySide')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    photoViewMode === 'sideBySide' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
                  }`}
                >
                  مقارنة البداية بالآن
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoViewMode('frontOnly')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    photoViewMode === 'frontOnly' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
                  }`}
                >
                  صور الأسبوع الحالي
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-center">
                <span className="text-xs text-neutral-400 block">
                  {photoViewMode === 'sideBySide' ? 'نقطة البداية (الأسبوع 1)' : 'صورة أمامية'}
                </span>
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
                  <img
                    src={trainee.avatarUrl}
                    alt="Start condition"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[11px] font-mono text-neutral-500">
                  {photoViewMode === 'sideBySide' ? `${trainee.startingWeightKg} كغ` : `${checkIn.weightKg} كغ`}
                </span>
              </div>

              <div className="space-y-1.5 text-center">
                <span className="text-xs text-emerald-400 font-medium block">
                  {photoViewMode === 'sideBySide' ? `الحالة الحالية (الأسبوع ${checkIn.weekNumber})` : 'صورة جانبية / خلفية'}
                </span>
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-emerald-500/40 bg-neutral-900 shadow-md">
                  <img
                    src={trainee.avatarUrl}
                    alt="Current condition"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  {checkIn.weightKg} كغ (فرق {weightDiff} كغ)
                </span>
              </div>
            </div>
          </div>

          {/* Coach Feedback Form & AI Assist */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <span>تقييم وتوجيهات الكوتش للمتدرب</span>
                <span className="text-xs font-normal text-neutral-400">(يصل المتدرب في إشعاراته والمحادثة)</span>
              </label>

              {/* AI Feedback Assistant Button */}
              <button
                type="button"
                onClick={handleGenerateAiFeedback}
                disabled={isAiGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiGenerating ? 'جاري صياغة التقييم الذكي...' : 'صياغة تقييم ذكي فوري'}</span>
              </button>
            </div>

            <div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="اكتب ملاحظاتك التشجيعية وتوجيهات التمرين والتغذية هنا..."
                rows={4}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                تعديل خطة الأسبوع القادم (إن وجد - مثل تعديل سعرات أو كارديو أو شدة التمرين):
              </label>
              <input
                type="text"
                value={targetAdjustment}
                onChange={(e) => setTargetAdjustment(e.target.value)}
                placeholder="مثال: خفض 100 سعرة من الكارب، أو رفع الكارديو إلى 120 دقيقة أسبوعياً"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Audio Note Simulator */}
            <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                <span className="text-neutral-300">إرفاق رسالة صوتية للمتدرب (Voice Note)</span>
              </div>
              <button
                type="button"
                onClick={() => setAudioRecorded(!audioRecorded)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  audioRecorded 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                }`}
              >
                {audioRecorded ? '✓ تم إرفاق مقطع صوتي (0:48)' : 'تسجيل ملاحظة صوتية'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعتماد التقييم وإرسال التغذية الراجعة</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
