import React, { useState } from 'react';
import { X, RefreshCw, Send, AlertCircle, Check, Dumbbell } from 'lucide-react';

interface ExerciseSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseNameAr: string;
  exerciseNameEn: string;
  category: 'workout' | 'mobility' | 'cardio';
  primaryMuscle?: string;
  onConfirmSwap: (newExerciseName: string, reason: string) => void;
}

// Muscle-specific verified alternative exercises (English Only, Professional, No Duplicates)
const MUSCLE_SPECIFIC_ALTERNATIVES: Record<string, string[]> = {
  chest: [
    'Incline Dumbbell Press',
    'Barbell Flat Bench Press',
    'Smith Machine Incline Press',
    'Weighted Dips (Chest Lean)',
    'Cable Chest Flyes',
    'Machine Chest Press',
    'Flat Dumbbell Bench Press',
    'Decline Dumbbell Press'
  ],
  back: [
    'Wide-Grip Lat Pulldown',
    'Barbell Bent-Over Row',
    'Seated Cable Row (Close Grip)',
    'Single-Arm Dumbbell Row',
    'Chest-Supported T-Bar Row',
    'Neutral-Grip Pull-ups',
    'Straight-Arm Cable Pulldown'
  ],
  shoulders: [
    'Seated Dumbbell Shoulder Press',
    'Standing Barbell Overhead Press',
    'Dumbbell Lateral Raise',
    'Cable Lateral Raise',
    'Rear Delt Cable Flyes',
    'Face Pulls',
    'Dumbbell Front Raise'
  ],
  legs_quads: [
    'Barbell Back Squat',
    'Leg Press Machine',
    'Hack Squat',
    'Bulgarian Split Squat',
    'Goblet Squat',
    'Leg Extension Machine',
    'Walking Dumbbell Lunges'
  ],
  legs_hamstrings: [
    'Romanian Deadlift (RDL)',
    'Lying Leg Curl',
    'Seated Leg Curl',
    'Dumbbell Romanian Deadlift',
    'Barbell Good Mornings',
    'Hip Thrust'
  ],
  biceps: [
    'Incline Dumbbell Biceps Curl',
    'Barbell Biceps Curl',
    'Hammer Curl',
    'Cable Preacher Curl',
    'Concentration Curl',
    'EZ-Bar Biceps Curl'
  ],
  triceps: [
    'Triceps Rope Pushdown',
    'Overhead Cable Triceps Extension',
    'Skull Crushers (EZ-Bar)',
    'Close-Grip Barbell Bench Press',
    'Dumbbell Triceps Kickback'
  ],
  core: [
    'Hanging Leg Raise',
    'Cable Woodchoppers',
    'Ab Wheel Rollout',
    'Plank Hold'
  ],
  mobility: [
    'Thoracic Spine Foam Rolling',
    'Dynamic Arm Circles',
    'World Greatest Stretch',
    'Cat-Cow Mobility Flow',
    'Deep Squat & Ankle Mobilization'
  ],
  cardio: [
    'Incline Treadmill Walk (Zone 2 LISS)',
    'Stationary Cycling (Moderate Resistance)',
    'Rowing Machine Intervals',
    'Stair Climber (Moderate Pace)'
  ]
};

const detectMuscleGroup = (nameEn: string, nameAr: string, primaryMuscle?: string): string => {
  const text = `${nameEn} ${nameAr} ${primaryMuscle || ''}`.toLowerCase();
  
  if (text.includes('chest') || text.includes('bench') || text.includes('صدر') || text.includes('بنش') || text.includes('fly') || text.includes('dips')) {
    return 'chest';
  }
  if (text.includes('lat') || text.includes('row') || text.includes('pulldown') || text.includes('back') || text.includes('ظهر') || text.includes('سحب')) {
    return 'back';
  }
  if (text.includes('shoulder') || text.includes('lateral') || text.includes('delt') || text.includes('كتف') || text.includes('أكتاف') || text.includes('military')) {
    return 'shoulders';
  }
  if (text.includes('deadlift') || text.includes('rdl') || text.includes('hamstring') || text.includes('خلفي') || text.includes('leg curl') || text.includes('thrust')) {
    return 'legs_hamstrings';
  }
  if (text.includes('squat') || text.includes('quad') || text.includes('leg press') || text.includes('extension') || text.includes('أرجل') || text.includes('فخذ')) {
    return 'legs_quads';
  }
  if (text.includes('bicep') || text.includes('باي')) {
    return 'biceps';
  }
  if (text.includes('tricep') || text.includes('تراي')) {
    return 'triceps';
  }
  if (text.includes('core') || text.includes('abs') || text.includes('بطن') || text.includes('plank')) {
    return 'core';
  }
  
  return 'chest';
};

const REASON_CHOICES = [
  'غير متوفر في الجيم',
  'إصابة/ألم',
  'سهل جداً',
  'صعب جداً'
];

export const ExerciseSwapModal: React.FC<ExerciseSwapModalProps> = ({
  isOpen,
  onClose,
  exerciseNameAr,
  exerciseNameEn,
  category,
  primaryMuscle,
  onConfirmSwap
}) => {
  const muscleKey = category === 'workout' 
    ? detectMuscleGroup(exerciseNameEn, exerciseNameAr, primaryMuscle)
    : category;

  const rawList = MUSCLE_SPECIFIC_ALTERNATIVES[muscleKey] || MUSCLE_SPECIFIC_ALTERNATIVES.chest;
  // Filter out the current exercise so user can pick other alternatives of the same muscle group
  const alternativesList = rawList.filter(item => 
    item.toLowerCase() !== exerciseNameEn.toLowerCase()
  );

  const [selectedAlternative, setSelectedAlternative] = useState<string>(alternativesList[0] || '');
  const [selectedReasonChoice, setSelectedReasonChoice] = useState<string>('');
  const [extraNotes, setExtraNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalExercise = selectedAlternative || alternativesList[0] || 'Alternative Exercise';
    const chosenReason = selectedReasonChoice || 'طلب استبدال عام';
    const finalReason = extraNotes.trim() 
      ? `${chosenReason} - ${extraNotes.trim()}` 
      : chosenReason;

    onConfirmSwap(finalExercise, finalReason);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  const getMuscleLabelAr = (k: string) => {
    switch (k) {
      case 'chest': return 'تمارين الصدر فقط (Chest)';
      case 'back': return 'تمارين الظهر فقط (Back)';
      case 'shoulders': return 'تمارين الأكتاف فقط (Shoulders)';
      case 'legs_quads': return 'تمارين الأرجل الأمامية (Quads)';
      case 'legs_hamstrings': return 'تمارين الأرجل الخلفية (Hamstrings/Glutes)';
      case 'biceps': return 'تمارين البايسبس فقط (Biceps)';
      case 'triceps': return 'تمارين الترايسبس فقط (Triceps)';
      case 'core': return 'تمارين عضلات البطن (Core)';
      case 'mobility': return 'تمارين المرونة والإطالة (Mobility)';
      case 'cardio': return 'تمارين اللياقة القلبية (Cardio)';
      default: return 'تمارين العضلة المستهدفة';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">استبدال التمرين وإرسال للمدرب</h3>
              <p className="text-[11px] text-neutral-400">البدائل المقترحة لنفس العضلة المستهدفة فقط</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Exercise Badge (English Name Only) */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-neutral-400 block font-medium">التمرين الحالي المطلوب استبداله:</span>
            <span className="text-white font-black text-sm font-mono mt-0.5 block">{exerciseNameEn || exerciseNameAr}</span>
            <span className="text-[11px] text-emerald-400 font-medium mt-0.5 block">
              العضلة المستهدفة: {getMuscleLabelAr(muscleKey)}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
            طلب استبدال
          </span>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-base font-black text-white">تم الإرسال بنجاح ✓</h4>
            <p className="text-xs text-neutral-400">
              تم إرسال طلب استبدال التمرين وتفاصيل السبب لكوتش عبدالله قاسم بنجاح.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            
            {/* 1. Choose from muscle-specific suggested alternatives (English Only) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تمارين بديلة معتمدة لنفس العضلة فقط:</span>
                </label>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                  {alternativesList.length} بدائل مطابقة
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {alternativesList.map((alt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAlternative(alt)}
                    className={`w-full text-right p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedAlternative === alt
                        ? 'bg-emerald-500/15 border-emerald-500 text-white font-black shadow-sm'
                        : 'bg-neutral-950/70 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span className="font-mono text-[12px]">{alt}</span>
                    {selectedAlternative === alt ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-700" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Reason Choices (سبب استبدال هذا التمرين ضروري للكوتش) */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <label className="text-xs font-bold text-white">
                  سبب استبدال هذا التمرين (ضروري للكوتش) *:
                </label>
              </div>

              {/* 4 Choices Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2.5">
                {REASON_CHOICES.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setSelectedReasonChoice(choice)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      selectedReasonChoice === choice
                        ? 'bg-emerald-500 text-neutral-950 border-emerald-500 shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>

              {/* Trainee free-form explanation textarea */}
              <textarea
                rows={2}
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder="اكتب أي ملاحظات أو تفاصيل إضافية للكوتش (اختياري)..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال للمدرب</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
