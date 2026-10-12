import React, { useState, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { 
  ChevronLeft, 
  Dumbbell, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Activity, 
  Sparkles, 
  Check, 
  Plus, 
  RotateCcw,
  RefreshCw,
  Play,
  Video,
  Zap,
  X
} from 'lucide-react';
import { RestTimer } from './RestTimer';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { ExerciseSwapModal } from './ExerciseSwapModal';
import { MobilityCardioDetailModal } from './MobilityCardioDetailModal';

interface TraineeTrainingTabProps {
  onOpenRestTimer: () => void;
}

const WARMUP_DRILLS = [
  {
    id: 'w1',
    nameEn: 'Dynamic Arm Circles & Shoulder Dislocates',
    duration: '15 تكرار للأمام و 15 تكرار للخلف',
    instructions: 'تدوير الذراعين في دوائر واسعة ببطء وتحكم لتزييت مفصل الكتف وتنشيط الكفة المدورة.',
    videoYtId: '3VcKaXpzqRo'
  },
  {
    id: 'w2',
    nameEn: 'Cat-Cow & Thoracic Rotations',
    duration: '10 إلى 12 تكرار كامل',
    instructions: 'تقويس وفتح فقرات الظهر الصدرية وأسفل الظهر لتحرير مفاصل العمود الفقري وتحسين المدى الحركي.',
    videoYtId: 'w_UKp_a0V9w'
  },
  {
    id: 'w3',
    nameEn: 'Bodyweight Deep Squats & Hip Openers',
    duration: '12 تكرار مع ثبات ثانيتين بالأسفل',
    instructions: 'النزول لعمق مريح مع فتح الركبتين للخارج لتهيئة مفصل الحوض والركبتين والكاحل لضغط الأوزان.',
    videoYtId: 'bEv6CCg2BC8'
  },
  {
    id: 'w4',
    nameEn: 'Leg Swings (Front-to-Back & Lateral)',
    duration: '10 تكرارات لكل ساق',
    instructions: 'أرجحة محكومة بدون حركة عشوائية في الحوض لإطالة أوتار الركبة والعضلة الضامة وتنشيط الساقين.',
    videoYtId: '6C90v2u0s-w'
  },
  {
    id: 'w5',
    nameEn: 'Glute Bridges & Scapular Retractions',
    duration: '15 تكرار مع عصر ثانية في القمة',
    instructions: 'رفع الحوض مع عصر عضلات المؤخرة والبطن واللوح الكتفي لتفعيل عضلات السلسلة الخلفية قبل التمارين المركبة.',
    videoYtId: 'wPM8icPu6H8'
  }
];

export const TraineeTrainingTab: React.FC<TraineeTrainingTabProps> = ({
  onOpenRestTimer
}) => {
  const { 
    activeTrainee, 
    toggleExerciseSetCompleted, 
    completeExerciseSet, 
    sendMessage,
    triggerCheer,
    triggerFullCompletion,
    registerBackHandler
  } = useFitness();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<'warmup' | 'workout' | 'mobility' | 'cardio'>('workout');
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);
  const [restDuration, setRestDuration] = useState(90);

  // Warmup completion state
  const [warmupLogs, setWarmupLogs] = useState<Record<string, boolean>>({
    w1: false,
    w2: false,
    w3: false,
    w4: false,
    w5: false
  });

  // Modals state for Exercise Detail, Video & Swap
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<any | null>(null);
  const [swapModalData, setSwapModalData] = useState<{
    exerciseNameAr: string;
    exerciseNameEn: string;
    category: 'workout' | 'mobility' | 'cardio';
    primaryMuscle?: string;
  } | null>(null);

  // Back button handling inside Training Tab
  useEffect(() => {
    if (selectedExerciseForModal) {
      return registerBackHandler(() => {
        setSelectedExerciseForModal(null);
        return true;
      });
    }
  }, [selectedExerciseForModal, registerBackHandler]);

  useEffect(() => {
    if (swapModalData) {
      return registerBackHandler(() => {
        setSwapModalData(null);
        return true;
      });
    }
  }, [swapModalData, registerBackHandler]);

  useEffect(() => {
    if (isRestTimerOpen) {
      return registerBackHandler(() => {
        setIsRestTimerOpen(false);
        return true;
      });
    }
  }, [isRestTimerOpen, registerBackHandler]);

  useEffect(() => {
    if (activeSection !== 'workout' && !selectedExerciseForModal && !swapModalData && !isRestTimerOpen) {
      return registerBackHandler(() => {
        setActiveSection('workout');
        return true;
      });
    }
  }, [activeSection, selectedExerciseForModal, swapModalData, isRestTimerOpen, registerBackHandler]);

  const [mobilityCardioModalData, setMobilityCardioModalData] = useState<{
    type: 'mobility' | 'cardio';
    item: {
      id: string;
      title: string;
      subtitle: string;
      description: string;
      recommended: string;
      tips: string[];
    };
    id: string;
  } | null>(null);

  const [selectedWarmupVideo, setSelectedWarmupVideo] = useState<{
    id: string;
    nameEn: string;
    instructions: string;
    videoYtId: string;
  } | null>(null);

  useEffect(() => {
    if (mobilityCardioModalData) {
      return registerBackHandler(() => {
        setMobilityCardioModalData(null);
        return true;
      });
    }
  }, [mobilityCardioModalData, registerBackHandler]);

  useEffect(() => {
    if (selectedWarmupVideo) {
      return registerBackHandler(() => {
        setSelectedWarmupVideo(null);
        return true;
      });
    }
  }, [selectedWarmupVideo, registerBackHandler]);

  // Local state for set inputs: { [setKey]: { weight: number, reps: number } }
  const [setInputs, setSetInputs] = useState<Record<string, { weight: string; reps: string }>>({});

  // Local state for mobility completion: { [id]: { completed: boolean, count: string } }
  const [mobilityLogs, setMobilityLogs] = useState<Record<string, { completed: boolean; value: string; title: string; subtitle: string; tips: string[] }>>({
    m1: { 
      completed: false, 
      value: '15', 
      title: '1. تدوير الكتف والكفة المدورة (Arm Circles)', 
      subtitle: 'تحفيز مفصل الكتف ومنع الإصابات أثناء ضغط الأوزان',
      tips: ['تحريك الذراع في دوائر واسعة ببطء وتحكم', 'الحفاظ على استقامة الجذع والرقبة', 'التركيز على تنشيط عضلات الكفة المدورة Rotator Cuff']
    },
    m2: { 
      completed: false, 
      value: '30', 
      title: '2. إطالة الصدر على الباب أو الجدار (Chest Stretch)', 
      subtitle: 'زيادة مرونة الصدر لتحقيق تمدد كامل وتفادي الشد',
      tips: ['ثبّت الساعد على الجدار بزاوية 90 درجة', 'ادر جذعك للجهة المعاكسة بلطف حتى تشعر بتمدد مريح في ألياف الصدر', 'تنفس بعمق واستمر لمدة 30 ثانية لكل جانب']
    },
    m3: { 
      completed: false, 
      value: '20', 
      title: '3. إطالة المعصم والأوتار (Wrist Mobility)', 
      subtitle: 'تخفيف الحمل على مفاصل اليدين أثناء حمل البار الثقيل',
      tips: ['مد ذراعك للأمام واثنِ معصمك للأسفل ثم للأعلى بمساعدة اليد الأخرى', 'تجنب تطبيق قوة زائدة أو ألم حاد', 'كرر 10-15 مرة لكل يد قبل بدء البنش بريس']
    }
  });

  // Local state for cardio completion: { [id]: { completed: boolean, minutes: string, distance: string } }
  const [cardioLogs, setCardioLogs] = useState<Record<string, { completed: boolean; minutes: string; distance: string; title: string; subtitle: string; tips: string[] }>>({
    c1: { 
      completed: false, 
      minutes: '20', 
      distance: '1.8', 
      title: 'المشي السريع على سير الميل (Incline Walk)', 
      subtitle: 'سرعة 4.5 إلى 5.0 · ميلان 8% (حرق دهون بدون خسارة عضلية Zone 2)',
      tips: ['اضبط الميلان على 8% والسرعة بين 4.5 إلى 5.0 كم/س', 'امشِ بخطى واثقة دون الإمساك بالمقابض لتفعيل عضلات الجذع', 'تنفس من الأنف وحافظ على دقات قلب في نطاق حرق الدهون 120-135 نبضة']
    },
    c2: { 
      completed: false, 
      minutes: '15', 
      distance: '5.0', 
      title: 'الدراجة الهوائية الثابتة (Stationary Bike)', 
      subtitle: 'مقاومة متوسطة لرفع اللياقة القلبية وتحسين تدفق الدم للأرجل',
      tips: ['اضبط ارتفاع المقعد ليكون مناسباً لامتداد الساق بزاوية خفيفة', 'حافظ على دوران منتظم (RPM 70-85)', 'ابدأ بدقيقتين إحماء ثم زد المقاومة لمستوى متوسط']
    }
  });

  const days = activeTrainee.program?.days || [];
  const currentDay = days[selectedDayIndex] || days[0];

  const getSetKey = (exerciseId: string, setNumber: number) => `${exerciseId}-${setNumber}`;

  const handleWeightChange = (exerciseId: string, setNumber: number, val: string) => {
    const key = getSetKey(exerciseId, setNumber);
    setSetInputs(prev => ({
      ...prev,
      [key]: {
        weight: val,
        reps: prev[key]?.reps || ''
      }
    }));
  };

  const handleRepsChange = (exerciseId: string, setNumber: number, val: string) => {
    const key = getSetKey(exerciseId, setNumber);
    setSetInputs(prev => ({
      ...prev,
      [key]: {
        weight: prev[key]?.weight || '',
        reps: val
      }
    }));
  };

  const handleSaveSet = (exerciseId: string, setNumber: number, defaultReps: string | number, defaultWeight: number, restSec: number) => {
    const key = getSetKey(exerciseId, setNumber);
    const enteredWeight = setInputs[key]?.weight !== undefined && setInputs[key].weight !== ''
      ? parseFloat(setInputs[key].weight)
      : (defaultWeight || 50);
    const parsedDefaultReps = typeof defaultReps === 'number' ? defaultReps : (parseInt(defaultReps) || 10);
    const enteredReps = setInputs[key]?.reps !== undefined && setInputs[key].reps !== ''
      ? parseInt(setInputs[key].reps)
      : parsedDefaultReps;

    completeExerciseSet(
      activeTrainee.id,
      currentDay.id,
      exerciseId,
      setNumber,
      enteredReps,
      enteredWeight
    );

    triggerCheer('أحسنت 🔥🔥');

    // Check if all exercises are done in current workout
    const allSets = currentDay.exercises.flatMap(e => e.sets);
    const completedSetsCount = allSets.filter(s => s.completed || (s.setNumber === setNumber)).length;
    if (completedSetsCount >= allSets.length) {
      triggerFullCompletion('أتممت جدول تمرين اليوم بالكامل بنجاح');
    }

    setRestDuration(restSec || 90);
    setIsRestTimerOpen(true);
  };

  const handleToggleSet = (exerciseId: string, setNumber: number) => {
    toggleExerciseSetCompleted(activeTrainee.id, currentDay.id, exerciseId, setNumber);
    triggerCheer('أحسنت 🔥🔥');
  };

  const handleSaveMobility = (id: string) => {
    setMobilityLogs(prev => {
      const willBeCompleted = !prev[id]?.completed;
      if (willBeCompleted) triggerCheer('أحسنت 🔥🔥');
      return {
        ...prev,
        [id]: {
          ...prev[id],
          completed: willBeCompleted
        }
      };
    });
  };

  const handleSaveCardio = (id: string) => {
    setCardioLogs(prev => {
      const willBeCompleted = !prev[id]?.completed;
      if (willBeCompleted) triggerCheer('أحسنت 🔥🔥');
      return {
        ...prev,
        [id]: {
          ...prev[id],
          completed: willBeCompleted
        }
      };
    });
  };

  // Today Date formatted in Arabic (e.g. الاثنين، 28 سبتمبر)
  const todayDateStr = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <div className="w-full space-y-4 pb-24 text-neutral-100">
      
      {/* Header with Dark Luxury Styling */}
      <div className="bg-neutral-900/90 rounded-2xl p-4 shadow-sm border border-neutral-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-neutral-400 block mb-0.5">
            {todayDateStr}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            جدول التدريب والتمارين
          </h1>
        </div>

        {/* Emerald Fitness Icon */}
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center p-2 shadow-xs">
          <Dumbbell className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* 4 Section Selector Tabs in Dark Theme */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        <button
          onClick={() => setActiveSection('warmup')}
          className={`py-3 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer border ${
            activeSection === 'warmup'
              ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-black shadow-md shadow-emerald-500/20'
              : 'bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>الإحماء</span>
        </button>

        <button
          onClick={() => setActiveSection('workout')}
          className={`py-3 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer border ${
            activeSection === 'workout'
              ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-black shadow-md shadow-emerald-500/20'
              : 'bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>التمرين</span>
        </button>

        <button
          onClick={() => setActiveSection('mobility')}
          className={`py-3 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer border ${
            activeSection === 'mobility'
              ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-black shadow-md shadow-emerald-500/20'
              : 'bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>المرونة</span>
        </button>

        <button
          onClick={() => setActiveSection('cardio')}
          className={`py-3 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer border ${
            activeSection === 'cardio'
              ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-black shadow-md shadow-emerald-500/20'
              : 'bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>اللياقة</span>
        </button>
      </div>

      {/* SECTION 0: WARMUP (الإحماء الديناميكي وتهيئة المفاصل) */}
      {activeSection === 'warmup' && (
        <div className="space-y-4">
          <div className="bg-neutral-900/90 p-4 rounded-2xl border border-neutral-800 text-xs text-neutral-300 space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white">بروتوكول الإحماء الديناميكي وتهيئة المفاصل</h3>
            </div>
            <p className="text-[11px] text-neutral-400">
              قم بأداء هذه التمارين من 5 إلى 7 دقائق قبل البدء برفع الأوزان لرفع حرارة العضلات وتزييت المفاصل وتفادي الإصابات.
            </p>
          </div>

          {/* Warmup items */}
          <div className="space-y-3">
            {WARMUP_DRILLS.map((item, idx) => {
              const isDone = !!warmupLogs[item.id];
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-neutral-900/90 border-neutral-800 text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-mono font-bold text-sm text-white tracking-tight">{item.nameEn}</h4>
                        <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">{item.duration}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isDone;
                        setWarmupLogs(prev => ({ ...prev, [item.id]: nextState }));
                        if (nextState) triggerCheer('أحسنت في الإحماء 🔥');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isDone ? 'مكتمل ✓' : 'تم الإحماء'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-neutral-400 pr-8 leading-relaxed mb-3">
                    {item.instructions}
                  </p>

                  <div className="flex items-center gap-2 pr-8">
                    <button
                      type="button"
                      onClick={() => setSelectedWarmupVideo(item)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>فيديو أداء الحركة والتكنيك (15ث)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action button to proceed to workout schedule */}
          <div className="pt-2">
            <button
              onClick={() => {
                setActiveSection('workout');
                triggerCheer('جاهز للتمرين بقوة 💪🔥');
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>الانتقال إلى جدول التمارين اليومية</span>
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: WORKOUT (التمرين) */}
      {activeSection === 'workout' && (
        <div className="space-y-4">
          
          {/* Day Selector Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {days.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedDayIndex === idx
                    ? 'bg-neutral-800 text-emerald-400 border-emerald-500/40 shadow-xs'
                    : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
              >
                {day.dayName.split(':')[0] || `اليوم ${idx + 1}`}
              </button>
            ))}
          </div>

          {/* Current Day Details Banner */}
          <div className="bg-neutral-900/90 p-4 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <h3 className="font-black text-white text-sm">{currentDay.dayName}</h3>
              {currentDay.targetMuscleGroup && (
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <span className="font-black text-amber-400">🎯 العضلة المستهدفة اليوم:</span>
                  <span className="text-white font-bold">{currentDay.targetMuscleGroup}</span>
                </div>
              )}
              <span className="text-neutral-400 text-[11px] block">
                التركيز: <strong className="text-emerald-400">{currentDay.focusArea}</strong> · {currentDay.estimatedMinutes} دقيقة تقريباً
              </span>
            </div>
            <button
              onClick={() => setIsRestTimerOpen(true)}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>مؤقت الراحة</span>
            </button>
          </div>

          {/* Instructions Notice for Trainee */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>اكتب الوزن والتكرار الفعلي لكل جولة واضغط <strong>"إضافة"</strong> لتسجيل الجولة بعلامة صح خضراء وبدء مؤقت الراحة.</span>
          </div>

          {/* Exercises List */}
          <div className="space-y-4">
            {currentDay.exercises.map((ex, exIdx) => {
              const completedSetsCount = ex.sets.filter(s => s.completed).length;
              const isAllDone = completedSetsCount === ex.sets.length;

              return (
                <div 
                  key={ex.id}
                  className={`p-4 rounded-2xl border transition-all shadow-xs space-y-3 ${
                    ex.isSuperSet
                      ? 'border-rose-500/40 bg-gradient-to-b from-neutral-900 via-rose-950/10 to-neutral-900 shadow-rose-950/20'
                      : 'border-neutral-800 bg-neutral-900/90'
                  }`}
                >
                  {/* Super-Set Top Badge */}
                  {ex.isSuperSet && (
                    <div className="flex items-center justify-between pb-2 border-b border-rose-500/20 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-neutral-950 text-[10px] font-black flex items-center gap-1">
                          <span>🔥</span>
                          <span>سوبر سيت (Super-Set)</span>
                        </span>
                        <span className="text-rose-300 font-bold text-xs">{ex.superSetName || 'تمرينان مدمجان في خانة واحدة'}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">دون راحة بين التمرينين</span>
                    </div>
                  )}

                  {/* Exercise Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-neutral-800/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center ${
                          ex.isSuperSet 
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {exIdx + 1}
                        </span>
                        <div>
                          <h4 className="font-black text-sm text-white font-mono tracking-tight">{ex.nameEn || ex.nameAr}</h4>
                          <span className="text-[11px] text-neutral-400 block">{ex.nameAr}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSwapModalData({
                          exerciseNameAr: ex.nameAr,
                          exerciseNameEn: ex.nameEn || ex.nameAr,
                          category: 'workout',
                          primaryMuscle: ex.primaryMuscle
                        })}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-emerald-400 border border-neutral-700 transition-colors cursor-pointer"
                        title="استبدال التمرين مع كتابة السبب للكوتش"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedExerciseForModal(ex)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="عرض فيديو التكنيك الصحيح والنصائح وتسجيل الأوزان"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>الفيديو والتكنيك</span>
                      </button>

                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                        isAllDone 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}>
                        {completedSetsCount}/{ex.sets.length}
                      </span>
                    </div>
                  </div>

                  {/* Sets Input & Completion Table */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 text-[10px] font-bold text-neutral-400 px-2">
                      <span className="col-span-2">الجولة</span>
                      <span className="col-span-3 text-center">الوزن الفعلي (كغ)</span>
                      <span className="col-span-3 text-center">التكرارات</span>
                      <span className="col-span-4 text-center">التسجيل والإتمام</span>
                    </div>

                    {ex.sets.map((set) => {
                      const setKey = getSetKey(ex.id, set.setNumber);
                      const currentWeightVal = setInputs[setKey]?.weight !== undefined 
                        ? setInputs[setKey].weight 
                        : (set.actualWeight ? set.actualWeight.toString() : '');
                      const currentRepsVal = setInputs[setKey]?.reps !== undefined 
                        ? setInputs[setKey].reps 
                        : (set.actualReps ? set.actualReps.toString() : (set.targetReps ? set.targetReps.toString() : ''));

                      return (
                        <div 
                          key={set.setNumber}
                          className={`grid grid-cols-12 items-center p-2.5 rounded-xl text-xs transition-colors border ${
                            set.completed 
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                              : 'bg-neutral-950/70 border-neutral-800 text-neutral-200'
                          }`}
                        >
                          {/* Set Number */}
                          <span className="col-span-2 font-black text-neutral-300 flex items-center gap-1">
                            {set.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="text-neutral-500 font-mono">#{set.setNumber}</span>
                            )}
                          </span>

                          {/* Actual Weight Input */}
                          <div className="col-span-3 px-1">
                            <input
                              type="number"
                              step="0.5"
                              value={currentWeightVal}
                              onChange={(e) => handleWeightChange(ex.id, set.setNumber, e.target.value)}
                              disabled={set.completed}
                              placeholder={set.actualWeight ? `${set.actualWeight}` : "كغ"}
                              className={`w-full py-1.5 px-2 rounded-lg text-center font-mono font-bold text-xs border outline-none transition-all ${
                                set.completed
                                  ? 'bg-neutral-900/90 border-emerald-500/30 text-emerald-400 font-black'
                                  : 'bg-neutral-900 border-neutral-700 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                              }`}
                            />
                          </div>

                          {/* Actual Reps Input */}
                          <div className="col-span-3 px-1">
                            <input
                              type="number"
                              value={currentRepsVal}
                              onChange={(e) => handleRepsChange(ex.id, set.setNumber, e.target.value)}
                              disabled={set.completed}
                              placeholder={set.targetReps ? `${set.targetReps}` : "عدة"}
                              className={`w-full py-1.5 px-2 rounded-lg text-center font-mono font-bold text-xs border outline-none transition-all ${
                                set.completed
                                  ? 'bg-neutral-900/90 border-emerald-500/30 text-emerald-400 font-black'
                                  : 'bg-neutral-900 border-neutral-700 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                              }`}
                            />
                          </div>

                          {/* Add / Prominent Green Checkmark Action Button */}
                          <div className="col-span-4 flex items-center justify-center gap-1.5">
                            {set.completed ? (
                              <button
                                onClick={() => handleToggleSet(ex.id, set.setNumber)}
                                className="w-full py-1.5 px-2 rounded-xl bg-emerald-500 text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition-all cursor-pointer"
                                title="الجولة مكتملة بعلامة صح خضراء - اضغط للتعديل"
                              >
                                <Check className="w-4 h-4 stroke-[3] text-neutral-950" />
                                <span>تم (صح) ✓</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSaveSet(ex.id, set.setNumber, set.targetReps, set.actualWeight || 50, set.restSeconds)}
                                className="w-full py-1.5 px-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                                title="إضافة وتسجيل الجولة بالأوزان والتكرارات الفعلية"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>إضافة</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SECTION 2: MOBILITY (المرونة) */}
      {activeSection === 'mobility' && (
        <div className="space-y-3">
          
          <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300">
            <span className="font-bold text-emerald-400 block mb-1">
              بروتوكول الإحماء والمرونة الحركية:
            </span>
            <p className="text-[11px] text-neutral-400">
              أدخل التكرارات أو الثواني التي أنجزتها، ثم اضغط <strong>"إضافة"</strong> لتفعيل علامة الصح الخضراء.
            </p>
          </div>

          {/* Mobility Exercise 1 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            mobilityLogs.m1.completed
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-neutral-900/90 border-neutral-800'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-sm text-white">{mobilityLogs.m1.title}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{mobilityLogs.m1.subtitle}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSwapModalData({
                    exerciseNameAr: mobilityLogs.m1.title,
                    exerciseNameEn: 'Arm Circles',
                    category: 'mobility'
                  })}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-emerald-400 border border-neutral-700 transition-colors"
                  title="استبدال تمرين المرونة"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMobilityCardioModalData({
                    type: 'mobility',
                    id: 'm1',
                    item: {
                      id: 'm1',
                      title: mobilityLogs.m1.title,
                      subtitle: mobilityLogs.m1.subtitle,
                      description: 'إحماء ديناميكي للكتف والصدر',
                      recommended: '15-20 تكرار دائري لكل جانب',
                      tips: mobilityLogs.m1.tips
                    }
                  })}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Video className="w-3 h-3" />
                  <span>الفيديو</span>
                </button>
                {mobilityLogs.m1.completed && (
                  <span className="p-1 rounded-lg bg-emerald-500 text-neutral-950">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">التكرارات المنجزة:</span>
                <input
                  type="number"
                  value={mobilityLogs.m1.value}
                  onChange={(e) => setMobilityLogs(prev => ({ ...prev, m1: { ...prev.m1, value: e.target.value } }))}
                  disabled={mobilityLogs.m1.completed}
                  className="w-16 py-1 px-2 text-center rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs font-bold font-mono"
                />
              </div>

              <button
                onClick={() => handleSaveMobility('m1')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  mobilityLogs.m1.completed
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-emerald-500/20 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {mobilityLogs.m1.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم الإنجاز ✓</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobility Exercise 2 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            mobilityLogs.m2.completed
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-neutral-900/90 border-neutral-800'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-sm text-white">{mobilityLogs.m2.title}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{mobilityLogs.m2.subtitle}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSwapModalData({
                    exerciseNameAr: mobilityLogs.m2.title,
                    exerciseNameEn: 'Chest Stretch',
                    category: 'mobility'
                  })}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-emerald-400 border border-neutral-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMobilityCardioModalData({
                    type: 'mobility',
                    id: 'm2',
                    item: {
                      id: 'm2',
                      title: mobilityLogs.m2.title,
                      subtitle: mobilityLogs.m2.subtitle,
                      description: 'إطالة العضلة الصدرية الكبرى والصغرى',
                      recommended: '30 ثانية لكل جانب',
                      tips: mobilityLogs.m2.tips
                    }
                  })}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Video className="w-3 h-3" />
                  <span>الفيديو</span>
                </button>
                {mobilityLogs.m2.completed && (
                  <span className="p-1 rounded-lg bg-emerald-500 text-neutral-950">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">المدة بالثواني:</span>
                <input
                  type="number"
                  value={mobilityLogs.m2.value}
                  onChange={(e) => setMobilityLogs(prev => ({ ...prev, m2: { ...prev.m2, value: e.target.value } }))}
                  disabled={mobilityLogs.m2.completed}
                  className="w-16 py-1 px-2 text-center rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs font-bold font-mono"
                />
              </div>

              <button
                onClick={() => handleSaveMobility('m2')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  mobilityLogs.m2.completed
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-emerald-500/20 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {mobilityLogs.m2.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم الإنجاز ✓</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobility Exercise 3 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            mobilityLogs.m3.completed
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-neutral-900/90 border-neutral-800'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-sm text-white">{mobilityLogs.m3.title}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{mobilityLogs.m3.subtitle}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSwapModalData({
                    exerciseNameAr: mobilityLogs.m3.title,
                    exerciseNameEn: 'Wrist Mobility',
                    category: 'mobility'
                  })}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-emerald-400 border border-neutral-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMobilityCardioModalData({
                    type: 'mobility',
                    id: 'm3',
                    item: {
                      id: 'm3',
                      title: mobilityLogs.m3.title,
                      subtitle: mobilityLogs.m3.subtitle,
                      description: 'مرونة مفصل المعصم والأوتار الساعدية',
                      recommended: '15-20 تكرار خفيف',
                      tips: mobilityLogs.m3.tips
                    }
                  })}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Video className="w-3 h-3" />
                  <span>الفيديو</span>
                </button>
                {mobilityLogs.m3.completed && (
                  <span className="p-1 rounded-lg bg-emerald-500 text-neutral-950">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">التكرارات:</span>
                <input
                  type="number"
                  value={mobilityLogs.m3.value}
                  onChange={(e) => setMobilityLogs(prev => ({ ...prev, m3: { ...prev.m3, value: e.target.value } }))}
                  disabled={mobilityLogs.m3.completed}
                  className="w-16 py-1 px-2 text-center rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs font-bold font-mono"
                />
              </div>

              <button
                onClick={() => handleSaveMobility('m3')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  mobilityLogs.m3.completed
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-emerald-500/20 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {mobilityLogs.m3.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم الإنجاز ✓</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 3: CARDIO & FITNESS (اللياقة) */}
      {activeSection === 'cardio' && (
        <div className="space-y-3">
          
          <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300">
            <span className="font-bold text-emerald-400 block mb-1">
              بروتوكول اللياقة والكارديو اليومي:
            </span>
            <p className="text-[11px] text-neutral-400">
              سجل مدتك ومسافتك المنجزة واضغط <strong>"إضافة"</strong> لتثبيت التقرير بعلامة صح خضراء.
            </p>
          </div>

          {/* Cardio Exercise 1: Incline Treadmill */}
          <div className={`p-4 rounded-2xl border transition-all ${
            cardioLogs.c1.completed
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-neutral-900/90 border-neutral-800'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-sm text-white">{cardioLogs.c1.title}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{cardioLogs.c1.subtitle}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSwapModalData({
                    exerciseNameAr: cardioLogs.c1.title,
                    exerciseNameEn: 'Incline Treadmill Walk',
                    category: 'cardio'
                  })}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-emerald-400 border border-neutral-700 transition-colors"
                  title="استبدال تمرين الكارديو"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMobilityCardioModalData({
                    type: 'cardio',
                    id: 'c1',
                    item: {
                      id: 'c1',
                      title: cardioLogs.c1.title,
                      subtitle: cardioLogs.c1.subtitle,
                      description: 'جهد هوائي معتدل لحرق الدهون مع الحفاظ على الكتلة العضلية',
                      recommended: '20-30 دقيقة ميل 8% وسرعة 4.8 كم/س',
                      tips: cardioLogs.c1.tips
                    }
                  })}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Video className="w-3 h-3" />
                  <span>الفيديو</span>
                </button>
                {cardioLogs.c1.completed && (
                  <span className="p-1 rounded-lg bg-emerald-500 text-neutral-950">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-3 items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-neutral-400">المدة (د):</span>
                <input
                  type="number"
                  value={cardioLogs.c1.minutes}
                  onChange={(e) => setCardioLogs(prev => ({ ...prev, c1: { ...prev.c1, minutes: e.target.value } }))}
                  disabled={cardioLogs.c1.completed}
                  className="w-16 py-1 px-2 text-center rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs font-bold font-mono"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-neutral-400">المسافة (كم):</span>
                <input
                  type="number"
                  step="0.1"
                  value={cardioLogs.c1.distance}
                  onChange={(e) => setCardioLogs(prev => ({ ...prev, c1: { ...prev.c1, distance: e.target.value } }))}
                  disabled={cardioLogs.c1.completed}
                  className="w-16 py-1 px-2 text-center rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs font-bold font-mono"
                />
              </div>

              <button
                onClick={() => handleSaveCardio('c1')}
                className={`col-span-2 sm:col-span-1 px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  cardioLogs.c1.completed
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-emerald-500/20 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {cardioLogs.c1.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم الإنجاز ✓</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cardio Exercise 2: Stationary Bike */}
          <div className={`p-4 rounded-2xl border transition-all ${
            cardioLogs.c2.completed
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-neutral-900/90 border-neutral-800'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-sm text-white">{cardioLogs.c2.title}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{cardioLogs.c2.subtitle}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSwapModalData({
                    exerciseNameAr: cardioLogs.c2.title,
                    exerciseNameEn: 'Stationary Bike',
                    category: 'cardio'
                  })}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-emerald-400 border border-neutral-700 transition-colors"
                  title="استبدال الدراجة"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMobilityCardioModalData({
                    type: 'cardio',
                    id: 'c2',
                    item: {
                      id: 'c2',
                      title: cardioLogs.c2.title,
                      subtitle: cardioLogs.c2.subtitle,
                      description: 'تنشيط الدورة الدموية وحرق السعرات مع الحفاظ على المفاصل',
                      recommended: '15-20 دقيقة بمقاومة متوسطة',
                      tips: cardioLogs.c2.tips
                    }
                  })}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Video className="w-3 h-3" />
                  <span>الفيديو</span>
                </button>
                {cardioLogs.c2.completed && (
                  <span className="p-1 rounded-lg bg-emerald-500 text-neutral-950">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-3 items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-neutral-400">المدة (د):</span>
                <input
                  type="number"
                  value={cardioLogs.c2.minutes}
                  onChange={(e) => setCardioLogs(prev => ({ ...prev, c2: { ...prev.c2, minutes: e.target.value } }))}
                  disabled={cardioLogs.c2.completed}
                  className="w-16 py-1 px-2 text-center rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs font-bold font-mono"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-neutral-400">المسافة (كم):</span>
                <input
                  type="number"
                  step="0.1"
                  value={cardioLogs.c2.distance}
                  onChange={(e) => setCardioLogs(prev => ({ ...prev, c2: { ...prev.c2, distance: e.target.value } }))}
                  disabled={cardioLogs.c2.completed}
                  className="w-16 py-1 px-2 text-center rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs font-bold font-mono"
                />
              </div>

              <button
                onClick={() => handleSaveCardio('c2')}
                className={`col-span-2 sm:col-span-1 px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  cardioLogs.c2.completed
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-emerald-500/20 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {cardioLogs.c2.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم الإنجاز ✓</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Exercise Detail, Video & In-Exercise Logging Modal */}
      {selectedExerciseForModal && (
        <ExerciseDetailModal
          isOpen={true}
          onClose={() => setSelectedExerciseForModal(null)}
          exercise={selectedExerciseForModal}
          setInputs={setInputs}
          onWeightChange={(setNum, val) => handleWeightChange(selectedExerciseForModal.id, setNum, val)}
          onRepsChange={(setNum, val) => handleRepsChange(selectedExerciseForModal.id, setNum, val)}
          onSaveSet={(setNum, defaultReps, defaultWeight, restSec) => {
            handleSaveSet(selectedExerciseForModal.id, setNum, defaultReps, defaultWeight, restSec);
          }}
          onToggleSet={(setNum) => handleToggleSet(selectedExerciseForModal.id, setNum)}
          onOpenSwap={() => {
            const ex = selectedExerciseForModal;
            setSelectedExerciseForModal(null);
            setSwapModalData({
              exerciseNameAr: ex.nameAr,
              exerciseNameEn: ex.nameEn || ex.nameAr,
              category: 'workout',
              primaryMuscle: ex.primaryMuscle
            });
          }}
        />
      )}

      {/* Exercise Swap Modal with Reason for Coach */}
      {swapModalData && (
        <ExerciseSwapModal
          isOpen={true}
          onClose={() => setSwapModalData(null)}
          exerciseNameAr={swapModalData.exerciseNameAr}
          exerciseNameEn={swapModalData.exerciseNameEn}
          category={swapModalData.category}
          primaryMuscle={swapModalData.primaryMuscle}
          onConfirmSwap={(newEx, reason) => {
            sendMessage(
              activeTrainee.id,
              `🔄 طلب استبدال تمرين: "${swapModalData.exerciseNameEn}"\nالتمرين البديل المختار: "${newEx}"\nالسبب: "${reason}"`
            );
          }}
        />
      )}

      {/* Mobility & Cardio Detail & Tips Modal */}
      {mobilityCardioModalData && (
        <MobilityCardioDetailModal
          isOpen={true}
          onClose={() => setMobilityCardioModalData(null)}
          type={mobilityCardioModalData.type}
          item={mobilityCardioModalData.item}
          value={
            mobilityCardioModalData.type === 'mobility'
              ? (mobilityLogs[mobilityCardioModalData.id]?.value || '15')
              : (cardioLogs[mobilityCardioModalData.id]?.minutes || '20')
          }
          completed={
            mobilityCardioModalData.type === 'mobility'
              ? !!mobilityLogs[mobilityCardioModalData.id]?.completed
              : !!cardioLogs[mobilityCardioModalData.id]?.completed
          }
          onValueChange={(val) => {
            if (mobilityCardioModalData.type === 'mobility') {
              setMobilityLogs(prev => ({
                ...prev,
                [mobilityCardioModalData.id]: {
                  ...prev[mobilityCardioModalData.id],
                  value: val
                }
              }));
            } else {
              setCardioLogs(prev => ({
                ...prev,
                [mobilityCardioModalData.id]: {
                  ...prev[mobilityCardioModalData.id],
                  minutes: val
                }
              }));
            }
          }}
          onToggleComplete={() => {
            if (mobilityCardioModalData.type === 'mobility') {
              handleSaveMobility(mobilityCardioModalData.id);
            } else {
              handleSaveCardio(mobilityCardioModalData.id);
            }
          }}
          onOpenSwap={() => {
            const data = mobilityCardioModalData;
            setMobilityCardioModalData(null);
            setSwapModalData({
              exerciseNameAr: data.item.title,
              exerciseNameEn: data.item.subtitle,
              category: data.type
            });
          }}
        />
      )}

      {/* Warmup Drill Technique Video Modal */}
      {selectedWarmupVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-6">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
              <div>
                <h3 className="text-base font-black text-white font-mono">{selectedWarmupVideo.nameEn}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">تكنيك الإحماء الحركي الصحيح 15 ثانية</p>
              </div>
              <button
                onClick={() => setSelectedWarmupVideo(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative w-full aspect-video bg-black border-b border-neutral-800 overflow-hidden">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedWarmupVideo.videoYtId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${selectedWarmupVideo.videoYtId}&playsinline=1&rel=0&modestbranding=1`}
                title={selectedWarmupVideo.nameEn}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 space-y-3">
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
                <strong className="text-white block mb-1">تعليمات الأداء:</strong>
                {selectedWarmupVideo.instructions}
              </div>
              <button
                onClick={() => setSelectedWarmupVideo(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs transition-colors cursor-pointer"
              >
                إغلاق مقطع الإحماء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Rest Timer Modal */}
      <RestTimer
        isOpen={isRestTimerOpen}
        onClose={() => setIsRestTimerOpen(false)}
        initialSeconds={restDuration}
      />

    </div>
  );
};
