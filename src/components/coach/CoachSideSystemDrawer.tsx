import React, { useState, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { TraineeProfile, WorkoutProgram, MacroGoals, WorkoutDay, WorkoutExercise, MasterExercise } from '../../types/fitness';
import { AddExerciseModal } from './AddExerciseModal';
import { 
  X, 
  Dumbbell, 
  Utensils, 
  Zap, 
  Sparkles, 
  Check, 
  Layers, 
  Activity, 
  Flame, 
  Plus, 
  UserCheck,
  Save,
  Trash2,
  Droplets,
  Edit3,
  RefreshCw,
  Search
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
    updateTraineeProfile,
    exerciseCatalog,
    triggerCheer,
    dispatchMotivationalUpdate
  } = useFitness();

  // Active Tab: 'actual' (البرنامج الفعلي للمتدرب) | 'programs' | 'diet' | 'fitness' | 'flexibility'
  const [activeTab, setActiveTab] = useState<'actual' | 'programs' | 'diet' | 'fitness' | 'flexibility'>('actual');
  
  // Selected Trainee for displaying and applying changes
  const [targetTraineeId, setTargetTraineeId] = useState<string>(trainees[0]?.id || 'trainee-4');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Sub-modal for swapping an exercise in the active program (Request 1)
  const [swappingExerciseTarget, setSwappingExerciseTarget] = useState<{ dayIdx: number; exIdx: number } | null>(null);
  const [swapSearchQuery, setSwapSearchQuery] = useState('');

  // Sub-modal for adding exercise to library
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  // Local state for editing the target trainee's actual program manually (Request 2)
  const targetTrainee = trainees.find(t => t.id === targetTraineeId) || trainees[0];
  const [editableProgram, setEditableProgram] = useState<WorkoutProgram | null>(null);
  const [editableMacros, setEditableMacros] = useState<MacroGoals>({
    calories: 2200,
    proteinGrams: 160,
    carbsGrams: 230,
    fatsGrams: 60,
    waterLiters: 3.5,
    fiberGrams: 30,
    cardioMinutesPerWeek: 120,
    cardioType: 'LISS',
    stepGoal: 10000
  });
  const [editableWater, setEditableWater] = useState<number>(3.5);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  // Editable protocols for warm-up, mobility, and cardio (Request 2 & 3)
  const [editableWarmupText, setEditableWarmupText] = useState<string>(
    'روتين الإحماء الديناميكي: تدوير الذراعين، دوران الجذع، إحماء الأكتاف، وتهيئة مفاصل الركبة والحوض (5-7 دقائق).'
  );
  const [editableMobilityText, setEditableMobilityText] = useState<string>(
    'روتين الإطالات الحركية: تدوير الذراعين، إطالة الصدر على الجدار، ومرونة المعصم (15-30 ثانية لكل جانب).'
  );
  const [editableCardioText, setEditableCardioText] = useState<string>(
    'مشي مائل على المشاية (Zone 2) لمدة 20 دقيقة، مع دراجة ثابتة بمقاومة معتدلة لتعزيز الحرق.'
  );
  const [editableStepGoal, setEditableStepGoal] = useState<number>(10000);

  // Synchronize local editable state when target trainee changes or drawer opens
  useEffect(() => {
    if (targetTrainee) {
      if (targetTrainee.program) {
        setEditableProgram(JSON.parse(JSON.stringify(targetTrainee.program)));
      }
      if (targetTrainee.macroGoals) {
        setEditableMacros({ ...targetTrainee.macroGoals });
        setEditableWater(targetTrainee.macroGoals.waterLiters || 3.5);
        setEditableStepGoal(targetTrainee.macroGoals.stepGoal || 10000);
      }
      try {
        const savedProto = localStorage.getItem(`aq_protocols_${targetTrainee.id}`);
        if (savedProto) {
          const parsedProto = JSON.parse(savedProto);
          setEditableWarmupText(parsedProto.warmup || 'روتين الإحماء الديناميكي: تدوير الذراعين، دوران الجذع، إحماء الأكتاف، وتهيئة مفاصل الركبة والحوض (5-7 دقائق).');
          setEditableMobilityText(parsedProto.mobility || 'روتين الإطالات الحركية: تدوير الذراعين، إطالة الصدر على الجدار، ومرونة المعصم (15-30 ثانية لكل جانب).');
          setEditableCardioText(parsedProto.cardio || 'مشي مائل على المشاية (Zone 2) لمدة 20 دقيقة، مع دراجة ثابتة بمقاومة معتدلة لتعزيز الحرق.');
        } else {
          setEditableWarmupText('روتين الإحماء الديناميكي: تدوير الذراعين، دوران الجذع، إحماء الأكتاف، وتهيئة مفاصل الركبة والحوض (5-7 دقائق).');
          setEditableMobilityText('روتين الإطالات الحركية: تدوير الذراعين، إطالة الصدر على الجدار، ومرونة المعصم (15-30 ثانية لكل جانب).');
          setEditableCardioText('مشي مائل على المشاية (Zone 2) لمدة 20 دقيقة، مع دراجة ثابتة بمقاومة معتدلة لتعزيز الحرق.');
        }
      } catch {}
    }
  }, [targetTraineeId, targetTrainee, isOpen]);

  const showNotification = (msg: string) => {
    setAppliedNotification(msg);
    triggerCheer(msg);
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  // Swap exercise handler (Request 1)
  const handleSwapExercise = (dayIdx: number, exIdx: number, selectedMaster: MasterExercise) => {
    if (!editableProgram) return;
    const updated = { ...editableProgram };
    const currentEx = updated.days[dayIdx].exercises[exIdx];
    const oldName = currentEx.nameAr;
    updated.days[dayIdx].exercises[exIdx] = {
      ...currentEx,
      nameAr: selectedMaster.nameAr,
      nameEn: selectedMaster.nameEn,
      primaryMuscle: selectedMaster.primaryMuscle,
      equipment: selectedMaster.equipment,
      thumbnailUrl: selectedMaster.thumbnailUrl || currentEx.thumbnailUrl,
      executionCues: selectedMaster.executionCues || currentEx.executionCues,
    };
    setEditableProgram(updated);
    setSwappingExerciseTarget(null);
    setSwapSearchQuery('');
    if (targetTrainee) {
      dispatchMotivationalUpdate(
        targetTrainee.id,
        'تبديل تمرين وتحديث الخطة',
        `تم استبدال تمرين "${oldName}" بالتمرين البديل "${selectedMaster.nameAr}" لتحفيز النمو العضلي وتجاوز مرحلة الثبات.`
      );
    }
    showNotification(`تم استبدال "${oldName}" بـ "${selectedMaster.nameAr}" بنجاح 🔄`);
  };

  // Set exercise type handler (Super Set Ss / Drop Set Ds / Normal) (Request 1 & 14)
  const handleSetExerciseType = (dayIdx: number, exIdx: number, type: 'normal' | 'superset' | 'dropset') => {
    if (!editableProgram) return;
    const updated = { ...editableProgram };
    const ex = updated.days[dayIdx].exercises[exIdx];
    if (type === 'superset') {
      ex.isSuperSet = true;
      (ex as any).isDropSet = false;
      ex.superSetName = 'سوبر سيت (Ss) 🔥';
    } else if (type === 'dropset') {
      ex.isSuperSet = false;
      (ex as any).isDropSet = true;
      (ex as any).dropSetNotes = 'دروب سيت (Ds) ⚡';
    } else {
      ex.isSuperSet = false;
      (ex as any).isDropSet = false;
      ex.superSetName = undefined;
      (ex as any).dropSetNotes = undefined;
    }
    setEditableProgram(updated);
    showNotification(`تم ضبط نمط التمرين إلى ${type === 'superset' ? 'سوبر سيت (Ss) 🟢' : type === 'dropset' ? 'دروب سيت (Ds) ⚡' : 'عادي'} بنجاح`);
  };

  // Save manual modifications to the trainee's actual workout program (Request 2 & 12)
  const handleSaveActualProgram = () => {
    if (!editableProgram || !targetTrainee) return;
    updateTraineeProgram(targetTrainee.id, editableProgram);
    dispatchMotivationalUpdate(
      targetTrainee.id,
      'الجدول التدريبي المعتمد',
      `تم تحديث وضبط التمارين والجولات والأوزان لليوم ${selectedDayIdx + 1} بنجاح.`
    );
    showNotification(`تم حفظ التعديلات اليدوية لبرنامج تمارين ${targetTrainee.fullName} بنجاح ✅`);
  };

  // Save manual modifications to nutrition and water (Request 2 & 12)
  const handleSaveActualMacros = () => {
    if (!targetTrainee) return;
    const updated: MacroGoals = {
      ...editableMacros,
      waterLiters: editableWater
    };
    updateTraineeMacros(targetTrainee.id, updated);
    dispatchMotivationalUpdate(
      targetTrainee.id,
      'الخطة الغذائية والماكروز',
      `تم تحديث السعرات اليومية (${updated.calories} Cal) والبروتين (${updated.proteinGrams}g) واحتياج الماء (${editableWater} لتر).`
    );
    showNotification(`تم حفظ أهداف التغذية والماء لـ ${targetTrainee.fullName} بنجاح 🥗💧`);
  };

  // Save manual modifications to warm-up, mobility, and cardio protocols (Request 2 & 12)
  const handleSaveProtocols = () => {
    if (!targetTrainee) return;
    try {
      localStorage.setItem(`aq_protocols_${targetTrainee.id}`, JSON.stringify({
        warmup: editableWarmupText,
        mobility: editableMobilityText,
        cardio: editableCardioText,
        stepGoal: editableStepGoal
      }));
    } catch {}
    if (editableStepGoal !== targetTrainee.macroGoals?.stepGoal) {
      updateTraineeMacros(targetTrainee.id, {
        ...editableMacros,
        waterLiters: editableWater,
        stepGoal: editableStepGoal
      });
    }
    dispatchMotivationalUpdate(
      targetTrainee.id,
      'بروتوكولات الإحماء والاستشفاء والكارديو',
      'تم تحديث بروتوكول الإحماء الديناميكي، الاستشفاء الحركي، وهدف الخطوات اليومي.'
    );
    showNotification(`تم حفظ بروتوكولات الإحماء والمرونة واللياقة لـ ${targetTrainee.fullName} بنجاح ✅`);
  };

  // Helper to modify an exercise in the active program
  const handleUpdateExercise = (
    dayIndex: number, 
    exIndex: number, 
    field: 'nameAr' | 'setsCount' | 'reps' | 'targetWeight', 
    val: any
  ) => {
    if (!editableProgram) return;
    const updated = { ...editableProgram };
    const day = updated.days[dayIndex];
    if (!day || !day.exercises[exIndex]) return;

    const ex = day.exercises[exIndex];
    if (field === 'nameAr') {
      ex.nameAr = val;
    } else if (field === 'setsCount') {
      const count = Math.max(1, Math.min(8, Number(val) || 3));
      // Adjust sets array length
      const currentSets = ex.sets || [];
      if (currentSets.length < count) {
        for (let i = currentSets.length; i < count; i++) {
          currentSets.push({
            setNumber: i + 1,
            targetReps: currentSets[0]?.targetReps || '10',
            actualReps: currentSets[0]?.actualReps || 10,
            actualWeight: currentSets[0]?.actualWeight || 50,
            restSeconds: currentSets[0]?.restSeconds || 90,
            completed: false
          });
        }
      } else if (currentSets.length > count) {
        ex.sets = currentSets.slice(0, count);
      }
    } else if (field === 'reps') {
      const repsNum = Number(val) || 10;
      ex.sets = ex.sets.map(s => ({ ...s, targetReps: String(repsNum), actualReps: repsNum }));
    } else if (field === 'targetWeight') {
      const wNum = Number(val) || 0;
      ex.sets = ex.sets.map(s => ({ ...s, actualWeight: wNum }));
    }

    setEditableProgram(updated);
  };

  // Remove exercise from day
  const handleRemoveExercise = (dayIndex: number, exIndex: number) => {
    if (!editableProgram) return;
    const updated = { ...editableProgram };
    updated.days[dayIndex].exercises.splice(exIndex, 1);
    setEditableProgram(updated);
  };

  // Add exercise from library to day
  const handleAddExerciseToDay = (dayIndex: number) => {
    if (!editableProgram || exerciseCatalog.length === 0) return;
    const base = exerciseCatalog[0];
    const newEx: WorkoutExercise = {
      id: `ex-custom-${Date.now()}`,
      nameAr: base.nameAr,
      nameEn: base.nameEn,
      primaryMuscle: base.primaryMuscle,
      equipment: base.equipment,
      thumbnailUrl: base.thumbnailUrl,
      executionCues: base.executionCues,
      sets: [
        { setNumber: 1, targetReps: '10', actualReps: 10, actualWeight: 40, restSeconds: 90, completed: false },
        { setNumber: 2, targetReps: '10', actualReps: 10, actualWeight: 40, restSeconds: 90, completed: false },
        { setNumber: 3, targetReps: '10', actualReps: 10, actualWeight: 40, restSeconds: 90, completed: false },
      ]
    };
    const updated = { ...editableProgram };
    updated.days[dayIndex].exercises.push(newEx);
    setEditableProgram(updated);
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
      waterLiters: 4.0
    },
    {
      id: 'carb-cycle',
      title: 'نظام تدوير الكربوهيدرات (Carb Cycling)',
      deficit: 'متغير حسب أيام التمرين',
      proteinPerKg: '2.2g',
      carbsRatio: 'أيام عالية / منخفضة',
      fatsRatio: '25%',
      desc: 'أيام تمارين الأرجل والظهر كارب عالي، وأيام الراحة كارب منخفض لتسريع الأيض.',
      waterLiters: 3.8
    },
    {
      id: 'clean-bulk',
      title: 'نظام التضخيم النظيف (Lean Hypertrophy Bulk)',
      deficit: '+300 سعرة فائض',
      proteinPerKg: '2.0g',
      carbsRatio: '50%',
      fatsRatio: '25%',
      desc: 'بناء ألياف عضلية صافية وطاقة انفجارية بالأوزان دون اكتساب دهون زائدة.',
      waterLiters: 3.5
    }
  ];

  // 3. Fitness & Cardio Protocols
  const FITNESS_CARDIO_PROTOCOLS = [
    {
      id: 'hiit-tabata',
      title: 'بروتوكول HIIT و Tabata الحارق',
      targetMinutes: '45-60',
      protocol: '20 ثانية سرعة قصوى يتبعها 40 ثانية مشي بطيء لـ 15 دقيقة',
      hrZone: 'المنطقة 4-5 (Zone 4-5: 80-90% نبض)',
      stepsTarget: 10000,
      desc: 'حرق دهون مكثف وتفعيل تأثير ما بعد الحرق (EPOC) لـ 24 ساعة.'
    },
    {
      id: 'liss-zone2',
      title: 'بروتوكول LISS مشي مائل (Zone 2 Cardio)',
      targetMinutes: '120-150',
      protocol: 'مشي على مشاية بزاوية انحدار 8-12 وسرعة 4.5 كم/س لـ 30 دقيقة',
      hrZone: 'المنطقة 2 (Zone 2: 60-70% نبض)',
      stepsTarget: 12000,
      desc: 'المحافظة على المفاصل وأقصى استهلاك للأحماض الدهنية دون إجهاد عصبي.'
    }
  ];

  // 4. Mobility Protocols
  const MOBILITY_ROUTINES = [
    {
      id: 'shoulder-thoracic',
      title: 'روتين تحرير الصدر والكتف (Shoulder & Thoracic)',
      duration: '7-10 دقائق',
      exercises: ['تدوير الذراعين والأكتاف Arm Circles', 'إطالة الصدر على الجدار 30ث', 'Cat-Cow Rotations'],
      desc: 'تحسين المدى الحركي في تمرين البنش بريس والضغط العالي وحماية أوتار الكتف.'
    },
    {
      id: 'hip-ankle',
      title: 'روتين فتح الحوض والكاحل (Hip & Ankle Mobility)',
      duration: '8 دقائق',
      exercises: ['Deep Squat Hold 45s', '90/90 Hip Stretch', 'Ankle Dorsiflexion Wall Drill'],
      desc: 'تحقيق أقصى عمق بالسكوات ومنع تقوس أسفل الظهر أو رفع الكعب.'
    }
  ];

  const handleApplyProgramSplitToTrainee = (split: typeof PROGRAM_SPLIT_TEMPLATES[0]) => {
    if (!targetTrainee) return;
    const newDays: WorkoutDay[] = split.days.map((d, idx) => ({
      id: `day-${idx + 1}-${Date.now()}`,
      dayName: d.dayName,
      focusArea: d.focusArea,
      estimatedMinutes: 60,
      exercises: exerciseCatalog.slice(idx * 4, idx * 4 + d.exercisesCount).map(e => ({
        id: e.id,
        nameAr: e.nameAr,
        nameEn: e.nameEn,
        primaryMuscle: e.primaryMuscle,
        equipment: e.equipment,
        thumbnailUrl: e.thumbnailUrl,
        executionCues: e.executionCues,
        sets: [
          { setNumber: 1, targetReps: '10', actualReps: 10, actualWeight: 50, restSeconds: 90, completed: false },
          { setNumber: 2, targetReps: '10', actualReps: 10, actualWeight: 50, restSeconds: 90, completed: false },
          { setNumber: 3, targetReps: '10', actualReps: 10, actualWeight: 50, restSeconds: 90, completed: false }
        ]
      }))
    }));

    const updatedProgram: WorkoutProgram = {
      id: `prog-${Date.now()}`,
      title: split.title,
      description: split.description,
      splitType: split.splitType,
      daysPerWeek: split.daysPerWeek,
      days: newDays,
      createdDate: new Date().toISOString()
    };

    updateTraineeProgram(targetTrainee.id, updatedProgram);
    showNotification(`تم تطبيق "${split.title}" على ${targetTrainee.fullName} بنجاح!`);
  };

  const handleApplyDietToTrainee = (diet: typeof DIET_SYSTEM_TEMPLATES[0]) => {
    if (!targetTrainee) return;
    const weight = targetTrainee.currentWeightKg || 80;
    const targetCalories = diet.id === 'agg-cut' ? Math.round(weight * 22) :
                           diet.id === 'clean-bulk' ? Math.round(weight * 33) :
                           Math.round(weight * 26);
    const proteinGrams = Math.round(weight * (diet.id === 'agg-cut' ? 2.4 : 2.0));
    const fatsGrams = Math.round((targetCalories * 0.22) / 9);
    const carbsGrams = Math.round((targetCalories - (proteinGrams * 4 + fatsGrams * 9)) / 4);

    updateTraineeMacros(targetTrainee.id, {
      calories: targetCalories,
      proteinGrams,
      carbsGrams,
      fatsGrams,
      waterLiters: diet.waterLiters,
      fiberGrams: 30,
      cardioMinutesPerWeek: 120,
      cardioType: 'LISS',
      stepGoal: 10000
    });

    showNotification(`تم ضبط دايت "${diet.title}" (${targetCalories} سعرة) لـ ${targetTrainee.fullName}!`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      <div 
        className="fixed top-0 bottom-0 right-0 w-full max-w-xl bg-neutral-900 border-l border-neutral-800 shadow-2xl z-50 flex flex-col animate-slideLeft text-right text-white"
        dir="rtl"
      >
        {/* Top Header of Side Panel */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
              ☰
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>لوحة التحكم بالمنظومة الشاملة</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">Coach Control</span>
              </h3>
              <span className="text-[10px] text-neutral-400">
                البرنامج الفعلي للمتدرب · التعديل اليدوي · قوالب الأنظمة
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Trainee Selector Ribbon (Request 2) */}
        <div className="px-4 py-2.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-neutral-300">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">المتدرب المحدد:</span>
          </div>
          <select
            value={targetTraineeId}
            onChange={(e) => setTargetTraineeId(e.target.value)}
            className="bg-neutral-900 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl px-3 py-1.5 text-xs focus:outline-none cursor-pointer"
            dir="rtl"
          >
            {trainees.map(t => (
              <option key={t.id} value={t.id}>
                {t.fullName} ({t.currentWeightKg} كغ) - {t.goalTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Toast / Notification Banner inside drawer */}
        {appliedNotification && (
          <div className="bg-emerald-500 text-neutral-950 px-4 py-2 text-xs font-black flex items-center justify-between animate-fadeIn shrink-0 shadow-md">
            <span>✓ {appliedNotification}</span>
            <button onClick={() => setAppliedNotification(null)} className="text-neutral-900 font-bold">✕</button>
          </div>
        )}

        {/* 5 Core Navigation Tabs with Exact Matching Colors (Request 2 & 3) */}
        <div className="grid grid-cols-5 p-2 bg-neutral-900 border-b border-neutral-800 gap-1 shrink-0 text-center">
          
          {/* Tab 1: Actual Live Program (Request 2) */}
          <button
            onClick={() => setActiveTab('actual')}
            className={`py-2 px-1 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer border ${
              activeTab === 'actual'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50 font-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60 border-transparent'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold truncate max-w-full">برنامجه الفعلي</span>
          </button>

          {/* Tab 2: Workout Split Templates (Emerald) */}
          <button
            onClick={() => setActiveTab('programs')}
            className={`py-2 px-1 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer border ${
              activeTab === 'programs'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60 border-transparent'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] truncate max-w-full">قوالب التمارين</span>
          </button>

          {/* Tab 3: Diet Templates (Amber) */}
          <button
            onClick={() => setActiveTab('diet')}
            className={`py-2 px-1 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer border ${
              activeTab === 'diet'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60 border-transparent'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] truncate max-w-full">قوالب الدايت</span>
          </button>

          {/* Tab 4: Fitness & Cardio Templates (Rose) */}
          <button
            onClick={() => setActiveTab('fitness')}
            className={`py-2 px-1 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer border ${
              activeTab === 'fitness'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60 border-transparent'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] truncate max-w-full">قوالب اللياقة</span>
          </button>

          {/* Tab 5: Flexibility Templates (Teal) */}
          <button
            onClick={() => setActiveTab('flexibility')}
            className={`py-2 px-1 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer border ${
              activeTab === 'flexibility'
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60 border-transparent'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-[10px] truncate max-w-full">قوالب المرونة</span>
          </button>

        </div>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ===================== TAB 0: ACTUAL ACTIVE PROGRAM & MANUAL EDIT (Request 2) ===================== */}
          {activeTab === 'actual' && targetTrainee && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Trainee Banner */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={targetTrainee.avatarUrl}
                    alt={targetTrainee.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30"
                  />
                  <div>
                    <h4 className="text-xs font-black text-white">{targetTrainee.fullName}</h4>
                    <span className="text-[11px] text-emerald-400 font-bold block">
                      {targetTrainee.goalTitle} · {targetTrainee.currentWeightKg} كغ
                    </span>
                  </div>
                </div>
                <div className="text-left text-[11px] text-neutral-400 font-mono">
                  <div>PIN: <strong className="text-emerald-400">{targetTrainee.accessPin}</strong></div>
                  <div>User: <strong className="text-white">{targetTrainee.username}</strong></div>
                </div>
              </div>

              {/* 1. ACTUAL WORKOUT PROGRAM (تعديل يدوي كامل للتمارين) */}
              <div className="bg-neutral-950 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">
                        البرنامج التدريبي الفعلي (تمارين، جولات، أوزان)
                      </h4>
                      <span className="text-[10px] text-neutral-400">
                        {editableProgram?.title || 'الجدول التدريبي الحالي'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveActualProgram}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>احفظ التعديلات</span>
                  </button>
                </div>

                {editableProgram && (
                  <div className="space-y-3">
                    {/* Days selector pill */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {editableProgram.days.map((day, dIdx) => (
                        <button
                          key={dIdx}
                          type="button"
                          onClick={() => setSelectedDayIdx(dIdx)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                            selectedDayIdx === dIdx
                              ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                          }`}
                        >
                          اليوم {dIdx + 1} ({day.exercises.length} تمارين)
                        </button>
                      ))}
                    </div>

                    {/* Day Focus Header */}
                    {editableProgram.days[selectedDayIdx] && (
                      <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-white block font-bold">
                            {editableProgram.days[selectedDayIdx].dayName}
                          </strong>
                          <span className="text-[11px] text-neutral-400">
                            التركيز العضلي: {editableProgram.days[selectedDayIdx].focusArea}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddExerciseToDay(selectedDayIdx)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>إضافة تمرين</span>
                        </button>
                      </div>
                    )}

                    {/* Exercises List in Selected Day */}
                    <div className="space-y-2.5">
                      {editableProgram.days[selectedDayIdx]?.exercises.map((ex, exIdx) => {
                        const targetSet = ex.sets[0] || { targetWeight: 50, targetReps: 10 };
                        const isSuperSet = !!ex.isSuperSet;
                        const isDropSet = !!(ex as any).isDropSet;

                        return (
                          <div
                            key={ex.id || exIdx}
                            className={`border rounded-xl p-3 space-y-2.5 transition-all ${
                              isSuperSet
                                ? 'bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border-emerald-500/50 shadow-sm'
                                : isDropSet
                                ? 'bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 border-amber-500/50 shadow-sm'
                                : 'bg-neutral-900/90 border-neutral-800'
                            }`}
                          >
                            {/* Exercise Header & Actions */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className={`w-5 h-5 rounded-md text-[11px] font-mono font-bold flex items-center justify-center shrink-0 ${
                                  isSuperSet
                                    ? 'bg-emerald-500 text-neutral-950'
                                    : isDropSet
                                    ? 'bg-amber-500 text-neutral-950'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  {exIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={ex.nameAr}
                                  onChange={(e) => handleUpdateExercise(selectedDayIdx, exIdx, 'nameAr', e.target.value)}
                                  className="bg-neutral-950 border border-neutral-750 focus:border-emerald-500 rounded-lg px-2 py-1 text-xs text-white font-bold flex-1"
                                />
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setSwappingExerciseTarget({ dayIdx: selectedDayIdx, exIdx })}
                                  className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                  title="تبديل هذا التمرين بتمرين آخر من مكتبة التمارين مع إمكانية البحث"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>تبديل التمرين</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveExercise(selectedDayIdx, exIdx)}
                                  className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                                  title="حذف التمرين"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Set Type Selector: Normal vs Super Set (Ss) vs Drop Set (Ds) (Request 1 & Request 14) */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800/60 text-[11px]">
                              <span className="text-[10px] text-neutral-400 font-medium">نمط التمرين:</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleSetExerciseType(selectedDayIdx, exIdx, 'normal')}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                    !isSuperSet && !isDropSet
                                      ? 'bg-neutral-700 text-white border border-neutral-600'
                                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                                  }`}
                                >
                                  عادي
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSetExerciseType(selectedDayIdx, exIdx, 'superset')}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                                    isSuperSet
                                      ? 'bg-emerald-500 text-neutral-950 shadow-sm border border-emerald-400'
                                      : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/50'
                                  }`}
                                  title="سوبر سيت (Ss) - باللون الأخضر"
                                >
                                  <span>Ss</span>
                                  <span>سوبر سيت</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSetExerciseType(selectedDayIdx, exIdx, 'dropset')}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                                    isDropSet
                                      ? 'bg-amber-500 text-neutral-950 shadow-sm border border-amber-400'
                                      : 'bg-amber-950/40 text-amber-400 border border-amber-800/60 hover:bg-amber-900/50'
                                  }`}
                                  title="دروب سيت (Ds)"
                                >
                                  <span>Ds</span>
                                  <span>دروب سيت</span>
                                </button>
                              </div>
                            </div>

                            {/* Sets, Reps, Weight inline controls */}
                            <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-neutral-800/60">
                              <div>
                                <span className="text-neutral-400 block mb-0.5 text-[10px]">الجولات:</span>
                                <input
                                  type="number"
                                  value={ex.sets.length}
                                  onChange={(e) => handleUpdateExercise(selectedDayIdx, exIdx, 'setsCount', e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-750 rounded-lg px-2 py-1 text-xs text-center font-mono text-emerald-400 font-bold"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block mb-0.5 text-[10px]">التكرارات:</span>
                                <input
                                  type="number"
                                  value={targetSet.actualReps || parseInt(targetSet.targetReps) || 10}
                                  onChange={(e) => handleUpdateExercise(selectedDayIdx, exIdx, 'reps', e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-750 rounded-lg px-2 py-1 text-xs text-center font-mono text-white font-bold"
                                />
                              </div>
                              <div>
                                <span className="text-neutral-400 block mb-0.5 text-[10px]">الوزن المستهدف (كغ):</span>
                                <input
                                  type="number"
                                  value={targetSet.actualWeight || 0}
                                  onChange={(e) => handleUpdateExercise(selectedDayIdx, exIdx, 'targetWeight', e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-750 rounded-lg px-2 py-1 text-xs text-center font-mono text-amber-400 font-bold"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. ACTUAL NUTRITION & WATER (تعديل يدوي كامل للسعرات والماء) */}
              <div className="bg-neutral-950 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">
                        خطة التغذية والماكروز واحتياج الماء الفعلي
                      </h4>
                      <span className="text-[10px] text-neutral-400">
                        تعديل السعرات والجرامات اليومية المستهدفة
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveActualMacros}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>احفظ التغذية والماء</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 block mb-1">السعرات (Cal)</span>
                    <input
                      type="number"
                      value={editableMacros.calories}
                      onChange={(e) => setEditableMacros(prev => ({ ...prev, calories: Number(e.target.value) || 0 }))}
                      className="w-full bg-neutral-950 border border-neutral-700 text-amber-400 font-black font-mono text-center text-sm py-1 rounded-lg"
                    />
                  </div>

                  <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 block mb-1">البروتين (g)</span>
                    <input
                      type="number"
                      value={editableMacros.proteinGrams}
                      onChange={(e) => setEditableMacros(prev => ({ ...prev, proteinGrams: Number(e.target.value) || 0 }))}
                      className="w-full bg-neutral-950 border border-neutral-700 text-emerald-400 font-black font-mono text-center text-sm py-1 rounded-lg"
                    />
                  </div>

                  <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 block mb-1">الكارب (g)</span>
                    <input
                      type="number"
                      value={editableMacros.carbsGrams}
                      onChange={(e) => setEditableMacros(prev => ({ ...prev, carbsGrams: Number(e.target.value) || 0 }))}
                      className="w-full bg-neutral-950 border border-neutral-700 text-amber-300 font-black font-mono text-center text-sm py-1 rounded-lg"
                    />
                  </div>

                  <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 block mb-1">الدهون الصحية (g)</span>
                    <input
                      type="number"
                      value={editableMacros.fatsGrams}
                      onChange={(e) => setEditableMacros(prev => ({ ...prev, fatsGrams: Number(e.target.value) || 0 }))}
                      className="w-full bg-neutral-950 border border-neutral-700 text-rose-400 font-black font-mono text-center text-sm py-1 rounded-lg"
                    />
                  </div>
                </div>

                {/* Water liters edit */}
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">مستهدف الماء اليومي:</span>
                      <span className="text-[10px] text-neutral-400">لضمان الهيدريشن وضخ الدم</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={editableWater}
                      onChange={(e) => setEditableWater(Number(e.target.value) || 3.0)}
                      className="w-20 bg-neutral-950 border border-cyan-500/40 text-cyan-400 font-black font-mono text-center text-sm py-1 rounded-lg"
                    />
                    <span className="text-xs text-neutral-400 font-bold">لتر/يوم</span>
                  </div>
                </div>
              </div>

              {/* 3. ACTUAL WARMUP, MOBILITY & FITNESS PROTOCOLS (Request 2 & 3) */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">
                        بروتوكولات الإحماء والمرونة واللياقة الفعلية
                      </h4>
                      <span className="text-[10px] text-neutral-400">
                        تعديل التعليمات والروتين الحركي الخاص بالمتدرب
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveProtocols}
                    className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>احفظ البروتوكولات</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Warmup Protocol (Amber) */}
                  <div className="p-3 bg-neutral-900 rounded-xl border border-amber-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                        <Zap className="w-3.5 h-3.5" />
                        <span>بروتوكول الإحماء الديناميكي الفعلي:</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">5 - 7 دقائق</span>
                    </div>
                    <textarea
                      value={editableWarmupText}
                      onChange={(e) => setEditableWarmupText(e.target.value)}
                      rows={2}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500/50 rounded-lg p-2 text-xs text-neutral-200 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Mobility Protocol (Teal) */}
                  <div className="p-3 bg-neutral-900 rounded-xl border border-teal-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs">
                        <Activity className="w-3.5 h-3.5" />
                        <span>بروتوكول المرونة والاستشفاء الحركي الفعلي:</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">15 - 30 ثانية لكل جانب</span>
                    </div>
                    <textarea
                      value={editableMobilityText}
                      onChange={(e) => setEditableMobilityText(e.target.value)}
                      rows={2}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-teal-500/50 rounded-lg p-2 text-xs text-neutral-200 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Cardio & Conditioning Protocol (Rose) */}
                  <div className="p-3 bg-neutral-900 rounded-xl border border-rose-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                        <Flame className="w-3.5 h-3.5" />
                        <span>بروتوكول اللياقة والكارديو وحرق الدهون:</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-neutral-400">مستهدف الخطوات:</span>
                        <input
                          type="number"
                          step="500"
                          value={editableStepGoal}
                          onChange={(e) => setEditableStepGoal(Number(e.target.value) || 10000)}
                          className="w-16 bg-neutral-950 border border-rose-500/40 text-rose-400 font-black font-mono text-center text-xs py-0.5 rounded"
                        />
                      </div>
                    </div>
                    <textarea
                      value={editableCardioText}
                      onChange={(e) => setEditableCardioText(e.target.value)}
                      rows={2}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-rose-500/50 rounded-lg p-2 text-xs text-neutral-200 outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ===================== TAB 1: TRAINING PROGRAMS PRESET TEMPLATES ===================== */}
          {activeTab === 'programs' && (
            <div className="space-y-4 animate-in fade-in duration-150">
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
                  className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
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
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 hover:border-emerald-500/40 transition-all space-y-2.5"
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
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 font-black rounded-lg text-[11px] border border-emerald-500/40 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>تطبيق للمتدرب المحدد</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 2: DIET & NUTRITION TEMPLATES ===================== */}
          {activeTab === 'diet' && (
            <div className="space-y-4 animate-in fade-in duration-150">
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
                      className="w-full py-2 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 font-black rounded-lg text-[11px] border border-amber-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>تطبيق هذا النظام على المتدرب</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 3: FITNESS & CARDIO TEMPLATES ===================== */}
          {activeTab === 'fitness' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
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
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 hover:border-rose-500/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-white">{protocol.title}</h5>
                        <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">{protocol.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/80 shrink-0">
                        {protocol.targetMinutes} د/أسبوع
                      </span>
                    </div>

                    <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-850 space-y-1 text-[10px]">
                      <div className="text-neutral-300">
                        <strong className="text-rose-400">البروتوكول:</strong> {protocol.protocol}
                      </div>
                      <div className="text-neutral-400">
                        <strong className="text-neutral-300">المنطقة المستهدفة:</strong> {protocol.hrZone}
                      </div>
                      <div className="text-emerald-400 font-mono">
                        <strong>مستهدف الخطوات:</strong> {protocol.stepsTarget.toLocaleString()} خطوة/يوم
                      </div>
                    </div>

                    <button
                      onClick={() => showNotification(`تم تطبيق خطة الكارديو لـ ${targetTrainee?.fullName} بنجاح!`)}
                      className="w-full py-2 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-neutral-950 font-black rounded-lg text-[11px] border border-rose-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>تطبيق خطة الكارديو والخطوات للمتدرب</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 4: FLEXIBILITY & MOBILITY TEMPLATES ===================== */}
          {activeTab === 'flexibility' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
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
                    className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 hover:border-teal-500/40 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-white">{mob.title}</h5>
                        <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">{mob.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/80 shrink-0">
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
                      onClick={() => showNotification(`تم إرسال بروتوكول المرونة إلى ${targetTrainee?.fullName} بنجاح!`)}
                      className="w-full py-2 bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-neutral-950 font-black rounded-lg text-[11px] border border-teal-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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

      {/* Swap Exercise Modal with Live Search and Flexible Dropdown Selection (Request 1) */}
      {swappingExerciseTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span>تبديل التمرين واختيار بديل مناسب</span>
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  اختر التمرين الجديد من القائمة المنسدلة أو ابحث باسم العضلة أو التمرين
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSwappingExerciseTarget(null);
                  setSwapSearchQuery('');
                }}
                className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 bg-neutral-950/60 border-b border-neutral-800">
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={swapSearchQuery}
                  onChange={(e) => setSwapSearchQuery(e.target.value)}
                  placeholder="ابحث باسم التمرين (صدر، بنش، باي، سحب، أرجل)..."
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-emerald-500 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
                />
              </div>
            </div>

            {/* Exercises List */}
            <div className="p-3 overflow-y-auto space-y-1.5 flex-1">
              {exerciseCatalog
                .filter(ex => {
                  if (!swapSearchQuery.trim()) return true;
                  const q = swapSearchQuery.toLowerCase();
                  return (
                    ex.nameAr.toLowerCase().includes(q) ||
                    ex.nameEn.toLowerCase().includes(q) ||
                    ex.primaryMuscle.toLowerCase().includes(q)
                  );
                })
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSwapExercise(swappingExerciseTarget.dayIdx, swappingExerciseTarget.exIdx, item)}
                    className="w-full p-2.5 rounded-xl bg-neutral-950/70 hover:bg-neutral-800 border border-neutral-850 hover:border-emerald-500/50 flex items-center justify-between text-right transition-all group cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">
                        {item.nameAr}
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{item.nameEn}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{item.primaryMuscle}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-all shrink-0">
                      اختيار البديل ✓
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Submodal for creating exercises */}
      <AddExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
      />
    </>
  );
};
