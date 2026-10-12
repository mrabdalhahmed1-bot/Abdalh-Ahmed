import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { TraineeProfile, WorkoutProgram, MacroGoals } from '../../types/fitness';
import { AddExerciseModal } from './AddExerciseModal';
import { 
  X, 
  Dumbbell, 
  Utensils, 
  Zap, 
  Sparkles, 
  ChevronRight, 
  Check, 
  Layers, 
  Activity, 
  Flame, 
  Heart, 
  Shield, 
  Plus, 
  Sliders, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface CoachSideSystemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoachSideSystemDrawer: React.FC<CoachSideSystemDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    trainees, 
    updateTraineeProgram, 
    updateTraineeMacros, 
    exerciseCatalog,
    triggerCheer 
  } = useFitness();

  // Active Hub Tab: 'programs' | 'diet' | 'fitness' | 'flexibility'
  const [activeTab, setActiveTab] = useState<'programs' | 'diet' | 'fitness' | 'flexibility'>('programs');
  
  // Selected Trainee for applying changes
  const [targetTraineeId, setTargetTraineeId] = useState<string>(trainees[0]?.id || '');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Sub-modal for adding exercise to library
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  // Diet Calculator inside drawer
  const [drawerWeight, setDrawerWeight] = useState(80);
  const [drawerGoal, setDrawerGoal] = useState<'cut' | 'bulk' | 'recomp'>('cut');

  // Preview split
  const [selectedSplitIndex, setSelectedSplitIndex] = useState(0);

  const showNotification = (msg: string) => {
    setAppliedNotification(msg);
    triggerCheer(msg);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  // 1. Program Templates Hub
  const PROGRAM_SPLIT_TEMPLATES: Array<{
    title: string;
    description: string;
    splitType: 'push_pull_legs' | 'upper_lower' | 'custom';
    daysPerWeek: number;
    days: Array<{ dayName: string; focusArea: string; exercisesCount: number }>;
  }> = [
    {
      title: 'نظام Push / Pull / Legs (دفع - سحب - أرجل)',
      description: 'التقسيم العلمي الأقوى للضخامة والقوة مع توزيع متوازن للاستشفاء.',
      splitType: 'push_pull_legs',
      daysPerWeek: 4,
      days: [
        { dayName: 'اليوم 1: دفع (صدر وأكتاف أمامية وترايسبس)', focusArea: 'صدر، أكتاف، ترايسبس', exercisesCount: 5 },
        { dayName: 'اليوم 2: سحب (ظهر وبايسبس وأكتاف خلفية)', focusArea: 'ظهر، بايسبس، كتف خلفي', exercisesCount: 5 },
        { dayName: 'اليوم 3: أرجل شاملة وبطن', focusArea: 'أرجل أمامية وخلفية وسمانة', exercisesCount: 5 },
        { dayName: 'اليوم 4: تركيز نقاط الضعف والذراعين', focusArea: 'بايسبس، ترايسبس، أكتاف جانبية', exercisesCount: 4 }
      ]
    },
    {
      title: 'نظام Upper / Lower (جزء علوي - جزء سفلي)',
      description: 'مثالي للاعبي القوة والتنشيف الذكي بـ 4 أيام أسبوعياً بتردد مضاعف.',
      splitType: 'upper_lower',
      daysPerWeek: 4,
      days: [
        { dayName: 'اليوم 1: جزء علوي قوة (Upper Heavy)', focusArea: 'صدر، ظهر، أكتاف بقوة', exercisesCount: 5 },
        { dayName: 'اليوم 2: جزء سفلي قوة (Lower Heavy)', focusArea: 'سكوات، ديدلفت، سمانة', exercisesCount: 4 },
        { dayName: 'اليوم 3: جزء علوي تضخيم (Upper Hypertrophy)', focusArea: 'صدر عالي، لود ظهر، ذراعين', exercisesCount: 6 },
        { dayName: 'اليوم 4: جزء سفلي تضخيم (Lower Hypertrophy)', focusArea: 'مكبس، طعنات، بطن', exercisesCount: 5 }
      ]
    },
    {
      title: 'نظام Arnold Classic Split (التقسيم الذهبي)',
      description: 'تقسيم أرنولد الكلاسيكي لضخامة الصدر والظهر معاً والذراعين بيوم مستقل.',
      splitType: 'custom',
      daysPerWeek: 4,
      days: [
        { dayName: 'اليوم 1: سوبرست صدر وظهر (Chest & Back Antagonist)', focusArea: 'صدر مستوي، بنش عالي، سحب ظهر', exercisesCount: 6 },
        { dayName: 'اليوم 2: أكتاف وذراعين كاملة (Shoulders & Arms)', focusArea: 'ضغط أكتاف، رفرفة، بايسبس، ترايسبس', exercisesCount: 6 },
        { dayName: 'اليوم 3: أرجل ثقيلة وبطن (Legs & Abs)', focusArea: 'سكوات، هاك سكوات، هامسترينغ', exercisesCount: 5 },
        { dayName: 'اليوم 4: تكرار صدر وظهر بمقاومة الكابلات', focusArea: 'كابلات وأجهزة عزل متقدم', exercisesCount: 5 }
      ]
    },
    {
      title: 'نظام 4-Day Bodybuilding Split (عضلة أساسية يومياً)',
      description: 'عزل كامل لكل مجموعة عضلية مع كثافة عالية وسرعة استشفاء فائقة.',
      splitType: 'custom',
      daysPerWeek: 4,
      days: [
        { dayName: 'اليوم 1: صدر وترايسبس (Chest & Triceps)', focusArea: 'بنش بار، دمبل عالي، فراشة، تراي كيبل', exercisesCount: 5 },
        { dayName: 'اليوم 2: ظهر وبايسبس (Back & Biceps)', focusArea: 'سحب بار، سحب كيبل، ديدلفت، هامر كيرل', exercisesCount: 5 },
        { dayName: 'اليوم 3: أكتاف وترابيز وبطن (Shoulders & Traps)', focusArea: 'ضغط دمبل، رفرفة جانبي وخلفي، شروجز', exercisesCount: 5 },
        { dayName: 'اليوم 4: أرجل كاملة وسمانة (Complete Legs)', focusArea: 'سكوات، مكبس أرجل، فرد وثني', exercisesCount: 5 }
      ]
    }
  ];

  // 2. Diet Systems Hub
  const DIET_SYSTEM_TEMPLATES = [
    {
      id: 'agg-cut',
      title: 'نظام التنشيف القاسي (Aggressive Cut)',
      deficit: '-500 سعرة',
      proteinPerKg: '2.4g',
      carbsRatio: '25%',
      fatsRatio: '20%',
      desc: 'حرق الدهون العنيدة مع أقصى حماية للكتلة العضلية بتكثيف البروتين الصافي.',
      waterLiters: 4.0,
      baseCaloriesMultiplier: 22 // weight * 22 approx
    },
    {
      id: 'carb-cycle',
      title: 'نظام تدوير الكربوهيدرات (Carb Cycling)',
      deficit: 'متغير حسب أيام التمرين',
      proteinPerKg: '2.2g',
      carbsRatio: 'أيام عالية / منخفضة',
      fatsRatio: '25%',
      desc: 'أيام تمارين الأرجل والظهر كارب عالي، وأيام الراحة كارب منخفض لتسريع الأيض.',
      waterLiters: 3.8,
      baseCaloriesMultiplier: 25
    },
    {
      id: 'clean-bulk',
      title: 'نظام التضخيم النظيف (Lean Hypertrophy Bulk)',
      deficit: '+300 سعرة فائض',
      proteinPerKg: '2.0g',
      carbsRatio: '50%',
      fatsRatio: '25%',
      desc: 'بناء ألياف عضلية صافية وطاقة انفجارية بالأوزان دون اكتساب دهون زائدة.',
      waterLiters: 3.5,
      baseCaloriesMultiplier: 32
    },
    {
      id: 'recomp',
      title: 'نظام إعادة التشكيل العضلي (Body Recomposition)',
      deficit: 'سعرات المحافظة المتوازنة',
      proteinPerKg: '2.2g',
      carbsRatio: '40%',
      fatsRatio: '25%',
      desc: 'حرق دهون خفيف وبناء متزامن للمبتدئين أو العائدين من انقطاع.',
      waterLiters: 3.5,
      baseCaloriesMultiplier: 28
    }
  ];

  // 3. Fitness & Cardio Hub
  const FITNESS_CARDIO_PROTOCOLS = [
    {
      id: 'liss-incline',
      title: 'بروتوكول الكارديو الثابت المنخفض (LISS Incline Walk)',
      targetMinutes: 150,
      protocol: '30 دقيقة، 5 أيام أسبوعياً، سرعة 4.8 إلى 5.2، انحدار 10% إلى 12%',
      hrZone: 'منطقة حرق الدهون (Zone 2: 120-135 نبضة/دقيقة)',
      stepsTarget: 10000,
      desc: 'لا يهدم العضلات، يحافظ على استشفاء الساقين، ويحرق الدهون بكفاءة عالية.'
    },
    {
      id: 'hiit-tabata',
      title: 'بروتوكول التدريب المتقطع عالي الكثافة (HIIT / Tabata)',
      targetMinutes: 60,
      protocol: '15-20 دقيقة، 3 مرات أسبوعياً: سبرنت 30 ثانية بأقصى سرعة / راحة 60 ثانية مشي',
      hrZone: 'منطقة التحمل الأكسجيني القصوى (Zone 4/5: 160+ نبضة/دقيقة)',
      stepsTarget: 8000,
      desc: 'يرفع معدل الأيض لساعات بعد التمرين (EPOC Afterburn Effect).'
    },
    {
      id: 'neat-steps',
      title: 'بروتوكول النشاط غير الرياضي اليومي (NEAT Step Protocol)',
      targetMinutes: 90,
      protocol: 'مشي 12,000 خطوة يومياً موزع على 3 جولات بعد الوجبات الرئيسية (10-15 دقيقة كل جولة)',
      hrZone: 'النشاط الحركي الطبيعي (Zone 1)',
      stepsTarget: 12000,
      desc: 'يحسن حساسية الإنسولين ويمنع خمول الجسم دون أي إجهاد للجهاز العصبي.'
    },
    {
      id: 'fasted-cardio',
      title: 'بروتوكول كارديو الصباح على الريق (Fasted Morning LISS)',
      targetMinutes: 120,
      protocol: '25 دقيقة مشي خفيف صباحاً بعد شرب 500 مل ماء وكوب قهوة سوداء',
      hrZone: 'منطقة 115-125 نبضة/دقيقة',
      stepsTarget: 10000,
      desc: 'تنشيط الدورة الدموية واستغلال مخازن الجليكوجين المنخفضة لحرق الدهون.'
    }
  ];

  // 4. Flexibility & Mobility Hub
  const MOBILITY_ROUTINES = [
    {
      id: 'shoulder-rotator',
      title: 'روتين تحرير وإحماء مفاصل الكتف والصدر (Shoulder & Rotator Cuff)',
      duration: '8 دقائق قبل تمارين الدفع والعلوي',
      exercises: [
        'Band Dislocates (دوران حبل المقاومة حول الكتف 15 تكرار)',
        'External Rotations (تدوير مفصل الكوع للخارج بالكيبل الخفيف 15 تكرار)',
        'Wall Slides (انزلاق الذراعين على الجدار لتفعيل الترابيز السفلي 12 تكرار)',
        'Scapular Push-ups (ضغط لوحي الكتف بدون ثني الكوع 12 تكرار)'
      ],
      desc: 'حماية كاملة من إصابات أوتار الكتف (Rotator Cuff Impingement) وزيادة ثبات البنش برس.'
    },
    {
      id: 'hip-opener',
      title: 'روتين مرونة الحوض والورك قبل السكوات (Hip Opener & Mobility)',
      duration: '10 دقائق قبل تمارين الأرجل',
      exercises: [
        '90/90 Hip Stretch (إطالة الحوض بزاوية 90 درجة بالتبادل)',
        'Deep Goblet Squat Pry (جلسة قرفصاء عميقة مع فتح الركبتين بالكوعين 45 ثانية)',
        'Glute Bridges (تفعيل عضلات المؤخرة بالأرض 15 تكرار)',
        'Ankle Dorsiflexion (مرونة مفصل الكاحل باتجاه الجدار لتسهيل النزول العميق)'
      ],
      desc: 'يضمن نزول السكوات الموازي أو العميق بدون تقوس أسفل الظهر (Butt Wink).'
    },
    {
      id: 't-spine-spine',
      title: 'روتين مرونة العمود الفقري والصدر (Thoracic Spine Decompression)',
      duration: '6 دقائق قبل أي حصة تدريبية',
      exercises: [
        'Cat-Cow Stretch (إطالة القطة والبقرة لتحرير فقرات الظهر 12 دورة)',
        'Thread the Needle (تمرير الذراع لأسفل الصدر لتدوير القفص الصدري 10 تكرار لكل جهة)',
        'Foam Roller Upper Back Extension (تمدد أعلى الظهر فوق أسطوانة الفوم)'
      ],
      desc: 'علاج انحناء الأكتاف المكتبي وتحسين التنفس والتوازن في تمارين الرفعات الحرة.'
    },
    {
      id: 'post-stretch',
      title: 'روتين إطالات الاستشفاء الثابتة بعد انتهاء التمرين (Cool-down Stretch)',
      duration: '8-10 دقائق بعد نهاية التمرين مباشرة',
      exercises: [
        'Doorway Chest Stretch (إطالة الصدر في إطار الباب 30 ثانية)',
        'Hanging Lat Stretch (تعلق حر بالعقلة لإطالة اللاتس وتفريغ الضغط عن الفقرات)',
        'Seated Hamstring & Calves Stretch (إطالة عضلات الفخذ الخلفية والسمانة)',
        'Couch Stretch (إطالة عضلات الكوادز ومثنيات الحوض العميقة)'
      ],
      desc: 'تقليل حمض اللاكتيك وألم العضلات المتأخر (DOMS) وتسريع تدفق الدم الاستشفائي.'
    }
  ];

  // Actions to apply to selected trainee
  const handleApplyDietToTrainee = (template: typeof DIET_SYSTEM_TEMPLATES[0]) => {
    const target = trainees.find(t => t.id === targetTraineeId);
    if (!target) return;

    const weight = target.currentWeightKg || drawerWeight;
    const calories = Math.round(weight * template.baseCaloriesMultiplier);
    const protein = Math.round(weight * parseFloat(template.proteinPerKg));
    const fats = Math.round((calories * 0.25) / 9);
    const carbs = Math.max(50, Math.round((calories - (protein * 4 + fats * 9)) / 4));

    const updatedMacros: MacroGoals = {
      ...target.macroGoals,
      calories,
      proteinGrams: protein,
      carbsGrams: carbs,
      fatsGrams: fats,
      waterLiters: template.waterLiters,
    };

    updateTraineeMacros(target.id, updatedMacros);
    showNotification(`تم تطبيق "${template.title}" على المتدرب ${target.fullName} (${calories} سعرة)!`);
  };

  const handleApplyCardioToTrainee = (protocol: typeof FITNESS_CARDIO_PROTOCOLS[0]) => {
    const target = trainees.find(t => t.id === targetTraineeId);
    if (!target) return;

    const updatedMacros: MacroGoals = {
      ...target.macroGoals,
      cardioMinutesPerWeek: protocol.targetMinutes,
      stepGoal: protocol.stepsTarget,
    };

    updateTraineeMacros(target.id, updatedMacros);
    showNotification(`تم تحديث خطة الكارديو (${protocol.targetMinutes} د/أسبوع) للمتدرب ${target.fullName}!`);
  };

  const handleApplyProgramSplitToTrainee = (split: typeof PROGRAM_SPLIT_TEMPLATES[0]) => {
    const target = trainees.find(t => t.id === targetTraineeId);
    if (!target) return;

    // Build workout days populated from exerciseCatalog according to category
    const days = split.days.map((d, dIdx) => {
      // Pick matching exercises from library
      let selectedExercises = exerciseCatalog.slice(dIdx * 4, dIdx * 4 + d.exercisesCount);
      if (selectedExercises.length < d.exercisesCount) {
        selectedExercises = exerciseCatalog.slice(0, d.exercisesCount);
      }

      return {
        id: `day-${dIdx + 1}-${Date.now()}`,
        dayName: d.dayName,
        dayOfWeek: dIdx,
        focusArea: d.focusArea,
        estimatedMinutes: 65,
        exercises: selectedExercises.map((ex, exIdx) => ({
          id: `split-ex-${ex.id}-${exIdx}`,
          nameAr: ex.nameAr,
          nameEn: ex.nameEn,
          primaryMuscle: ex.primaryMuscle,
          equipment: ex.equipment,
          category: ex.category,
          thumbnailUrl: ex.thumbnailUrl,
          executionCues: ex.executionCues,
          sets: [
            { setNumber: 1, targetReps: ex.defaultReps || '10', targetRpe: 8, restSeconds: ex.restSeconds || 90 },
            { setNumber: 2, targetReps: ex.defaultReps || '10', targetRpe: 8.5, restSeconds: ex.restSeconds || 90 },
            { setNumber: 3, targetReps: ex.defaultReps || '10', targetRpe: 9, restSeconds: ex.restSeconds || 90 },
          ]
        }))
      };
    });

    const newProgram: WorkoutProgram = {
      id: `prog-${Date.now()}`,
      title: split.title,
      description: split.description,
      splitType: split.splitType,
      daysPerWeek: split.daysPerWeek,
      createdDate: new Date().toISOString().split('T')[0],
      days
    };

    updateTraineeProgram(target.id, newProgram);
    showNotification(`تم تفعيل وتعيين "${split.title}" بنجاح للمتدرب ${target.fullName}! 🔥`);
  };

  const handleApplyMobilityToTrainee = (mob: typeof MOBILITY_ROUTINES[0]) => {
    const target = trainees.find(t => t.id === targetTraineeId);
    if (!target) return;

    showNotification(`تم إرسال توجيهات "${mob.title}" إلى المتدرب ${target.fullName}! 🧘`);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Slide-out Side Drawer (Right side for RTL) */}
      <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col text-neutral-100 transform transition-transform duration-300 ease-out">
        
        {/* Top Header of Side Panel */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
              ☰
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>لوحة التحكم بالمنظومة الشاملة</span>
              </h3>
              <span className="text-[10px] text-neutral-400">
                برامج التدريب · الدايت · الفيتنس · المرونة
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Trainee Selector Ribbon (Quick apply) */}
        <div className="px-4 py-2 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-neutral-400">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>المتدرب المستهدف للتطبيق:</span>
          </div>
          <select
            value={targetTraineeId}
            onChange={(e) => setTargetTraineeId(e.target.value)}
            className="bg-neutral-900 border border-neutral-750 text-emerald-400 font-bold rounded-lg px-2 py-1 text-xs focus:outline-none"
            dir="rtl"
          >
            {trainees.map(t => (
              <option key={t.id} value={t.id}>{t.fullName} ({t.currentWeightKg} كغ)</option>
            ))}
          </select>
        </div>

        {/* Toast / Notification Banner inside drawer */}
        {appliedNotification && (
          <div className="bg-emerald-500 text-neutral-950 px-4 py-2 text-xs font-bold flex items-center justify-between animate-fadeIn shrink-0">
            <span>✓ {appliedNotification}</span>
            <button onClick={() => setAppliedNotification(null)} className="text-neutral-900 font-bold">✕</button>
          </div>
        )}

        {/* 4 Core Navigation Tabs with Small Neat Icons (لا تؤثر على الشاشة) */}
        <div className="grid grid-cols-4 p-2 bg-neutral-900 border-b border-neutral-800 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('programs')}
            className={`py-2 px-1 rounded-lg text-center flex flex-col items-center gap-1 transition-all ${
              activeTab === 'programs'
                ? 'bg-neutral-800 text-emerald-400 border border-neutral-700 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span className="text-[10px] truncate max-w-full">برامج التدريب</span>
          </button>

          <button
            onClick={() => setActiveTab('diet')}
            className={`py-2 px-1 rounded-lg text-center flex flex-col items-center gap-1 transition-all ${
              activeTab === 'diet'
                ? 'bg-neutral-800 text-amber-400 border border-neutral-700 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span className="text-[10px] truncate max-w-full">خانة الدايت</span>
          </button>

          <button
            onClick={() => setActiveTab('fitness')}
            className={`py-2 px-1 rounded-lg text-center flex flex-col items-center gap-1 transition-all ${
              activeTab === 'fitness'
                ? 'bg-neutral-800 text-cyan-400 border border-neutral-700 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[10px] truncate max-w-full">خانة الفيتنس</span>
          </button>

          <button
            onClick={() => setActiveTab('flexibility')}
            className={`py-2 px-1 rounded-lg text-center flex flex-col items-center gap-1 transition-all ${
              activeTab === 'flexibility'
                ? 'bg-neutral-800 text-purple-400 border border-neutral-700 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] truncate max-w-full">خانة المرونة</span>
          </button>
        </div>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ===================== TAB 1: TRAINING PROGRAMS ===================== */}
          {activeTab === 'programs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>أنظمة وتقسيمات التدريب الجاهزة</span>
                  </h4>
                  <p className="text-[10px] text-neutral-400">
                    قوالب متكاملة مع إمكانية التعيين بنقرة واحدة
                  </p>
                </div>
                <button
                  onClick={() => setIsAddExerciseModalOpen(true)}
                  className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>إضافة تمرين للمكتبة</span>
                </button>
              </div>

              {/* Programs List */}
              <div className="space-y-3">
                {PROGRAM_SPLIT_TEMPLATES.map((split, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 hover:border-neutral-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-white">{split.title}</h5>
                        <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">{split.description}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-emerald-400 border border-neutral-800 shrink-0">
                        {split.daysPerWeek} أيام
                      </span>
                    </div>

                    {/* Days overview */}
                    <div className="space-y-1 bg-neutral-900/60 p-2 rounded-lg border border-neutral-850">
                      {split.days.map((d, dIdx) => (
                        <div key={dIdx} className="text-[10px] text-neutral-300 flex items-center justify-between">
                          <span className="truncate max-w-[220px]">• {d.dayName}</span>
                          <span className="text-neutral-500 font-mono">{d.exercisesCount} تمارين</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-neutral-500 font-mono">
                        تعبئة تلقائية من مكتبة التمارين
                      </span>
                      <button
                        onClick={() => handleApplyProgramSplitToTrainee(split)}
                        className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 font-bold rounded-lg text-[11px] border border-emerald-500/30 transition-all flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>تطبيق للمتدرب المحدد</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Exercise Library Stats */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 space-y-2">
                <span className="text-[11px] font-bold text-white block">تصنيف مكتبة التمارين المتاحة:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <span className="text-amber-400">🏋️ تمارين البار</span>
                    <strong className="text-white">{exerciseCatalog.filter(e => e.category === 'barbell').length}</strong>
                  </div>
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <span className="text-blue-400">⚖️ تمارين الدانبل</span>
                    <strong className="text-white">{exerciseCatalog.filter(e => e.category === 'dumbbell').length}</strong>
                  </div>
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <span className="text-emerald-400">🔄 تمارين الكابل</span>
                    <strong className="text-white">{exerciseCatalog.filter(e => e.category === 'cable').length}</strong>
                  </div>
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <span className="text-purple-400">🦾 الأجهزة والماكينات</span>
                    <strong className="text-white">{exerciseCatalog.filter(e => e.category === 'machine').length}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: DIET & NUTRITION ===================== */}
          {activeTab === 'diet' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  <span>منظومة الدايت والأنظمة الغذائية المتخصصة</span>
                </h4>
                <p className="text-[10px] text-neutral-400">
                  حدد النظام الغذائي المطلوب وطبّق السعرات والماكروز مباشرة على المتدرب
                </p>
              </div>

              <div className="space-y-3">
                {DIET_SYSTEM_TEMPLATES.map((diet) => (
                  <div
                    key={diet.id}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 hover:border-amber-500/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-white">{diet.title}</h5>
                        <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">{diet.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 shrink-0">
                        {diet.deficit}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono bg-neutral-900/60 p-2 rounded-lg border border-neutral-850">
                      <div>
                        <span className="text-neutral-500 block">بروتين</span>
                        <strong className="text-emerald-400">{diet.proteinPerKg}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">كاربوهيدرات</span>
                        <strong className="text-amber-400">{diet.carbsRatio}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">الماء</span>
                        <strong className="text-cyan-400">{diet.waterLiters} لتر</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyDietToTrainee(diet)}
                      className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 font-bold rounded-lg text-[11px] border border-amber-500/40 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3 h-3" />
                      <span>تطبيق هذا النظام على المتدرب</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Fast Guidelines */}
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] text-neutral-300 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-400 block">💡 إرشادات تغذية المدرب:</span>
                <p>• احرص على توفير 20-30 غرام بروتين في وجبة ما بعد التمرين مباشرة لتفعيل تخليق البروتين العضلي (MPS).</p>
                <p>• مراعاة 3-4 لتر ماء يومياً لضمان ضخ الدم ونقل المغذيات للخلايا العضلية.</p>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: FITNESS & CARDIO ===================== */}
          {activeTab === 'fitness' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>منظومة الفيتنس والكارديو وحرق الدهون</span>
                </h4>
                <p className="text-[10px] text-neutral-400">
                  بروتوكولات الكارديو ومعدل نبضات القلب والنشاط اليومي
                </p>
              </div>

              <div className="space-y-3">
                {FITNESS_CARDIO_PROTOCOLS.map((protocol) => (
                  <div
                    key={protocol.id}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 hover:border-cyan-500/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-white">{protocol.title}</h5>
                        <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">{protocol.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 shrink-0">
                        {protocol.targetMinutes} د/أسبوع
                      </span>
                    </div>

                    <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-850 space-y-1 text-[10px]">
                      <div className="text-neutral-300">
                        <strong className="text-cyan-400">البروتوكول:</strong> {protocol.protocol}
                      </div>
                      <div className="text-neutral-400">
                        <strong className="text-neutral-300">المنطقة المستهدفة:</strong> {protocol.hrZone}
                      </div>
                      <div className="text-emerald-400 font-mono">
                        <strong>مستهدف الخطوات:</strong> {protocol.stepsTarget.toLocaleString()} خطوة/يوم
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyCardioToTrainee(protocol)}
                      className="w-full py-1.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-neutral-950 font-bold rounded-lg text-[11px] border border-cyan-500/40 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3 h-3" />
                      <span>تطبيق خطة الكارديو والخطوات للمتدرب</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 4: FLEXIBILITY & MOBILITY ===================== */}
          {activeTab === 'flexibility' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>منظومة المرونة والاستشفاء وتجهيز المفاصل</span>
                </h4>
                <p className="text-[10px] text-neutral-400">
                  روتينات الإحماء الديناميكي، حماية الأوتار، وإطالات الاستشفاء
                </p>
              </div>

              <div className="space-y-3">
                {MOBILITY_ROUTINES.map((mob) => (
                  <div
                    key={mob.id}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 hover:border-purple-500/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-white">{mob.title}</h5>
                        <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">{mob.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/80 shrink-0">
                        {mob.duration}
                      </span>
                    </div>

                    <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-850 space-y-1">
                      <span className="text-[10px] font-bold text-neutral-400 block mb-0.5">الحركات الموصى بها:</span>
                      {mob.exercises.map((item, i) => (
                        <p key={i} className="text-[10px] text-neutral-300 leading-relaxed">
                          ✓ {item}
                        </p>
                      ))}
                    </div>

                    <button
                      onClick={() => handleApplyMobilityToTrainee(mob)}
                      className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-neutral-950 font-bold rounded-lg text-[11px] border border-purple-500/40 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3 h-3" />
                      <span>إرسال بروتوكول المرونة للمتدرب</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Submodal for creating exercises */}
      <AddExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
      />
    </>
  );
};
