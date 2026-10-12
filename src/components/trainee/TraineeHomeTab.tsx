import React, { useState, useEffect, useCallback } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { 
  Bell, 
  Flame, 
  Dumbbell, 
  Droplet, 
  Moon, 
  Footprints, 
  Calendar, 
  ArrowLeft, 
  Sparkles, 
  Play, 
  Plus, 
  CheckCircle2,
  HeartPulse,
  TrendingUp,
  Target,
  ShieldCheck,
  Scale,
  Activity,
  Zap
} from 'lucide-react';
import { BiologicalAgeModal } from './BiologicalAgeModal';
import { usePhoneStepTracker } from '../../hooks/usePhoneStepTracker';

interface TraineeHomeTabProps {
  onNavigateTab: (tab: 'home' | 'training' | 'community' | 'nutrition' | 'menu') => void;
  onOpenCheckIn: () => void;
  onOpenChat: () => void;
}

export const TraineeHomeTab: React.FC<TraineeHomeTabProps> = ({
  onNavigateTab,
  onOpenCheckIn,
  onOpenChat
}) => {
  const { 
    activeTrainee, 
    coachInfo, 
    updateDailyHabits, 
    updateTraineeProfile,
    weeklySleepHours,
    setWeeklySleepHours,
    triggerCheer,
    triggerFullCompletion,
    registerBackHandler
  } = useFitness();
  const [isBioAgeOpen, setIsBioAgeOpen] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState<string>(activeTrainee.currentWeightKg?.toString() || '78.4');

  // Back button handling in Home Tab
  useEffect(() => {
    if (isBioAgeOpen) {
      return registerBackHandler(() => {
        setIsBioAgeOpen(false);
        return true;
      });
    }
  }, [isBioAgeOpen, registerBackHandler]);

  useEffect(() => {
    if (showWeightModal) {
      return registerBackHandler(() => {
        setShowWeightModal(false);
        return true;
      });
    }
  }, [showWeightModal, registerBackHandler]);

  // Today Habits
  const todayDate = new Date().toISOString().split('T')[0];
  const todayHabit = activeTrainee.habits.find(h => h.date === todayDate) || {
    date: todayDate,
    waterGlasses: 9,
    stepsCount: 8450,
    sleepHours: 7.5,
    energyLevel: 4,
    supplementsTaken: true
  };

  // Automatic Step Tracking from phone device sensors
  const handleStepIncrement = useCallback((newStepCount: number) => {
    updateDailyHabits(activeTrainee.id, { stepsCount: newStepCount });
  }, [activeTrainee.id, updateDailyHabits]);

  const { steps: autoSteps, isSensorActive, isLiveWalking } = usePhoneStepTracker(
    todayHabit.stepsCount || 8450,
    handleStepIncrement
  );

  // Quick Water Tracking in Milliliters
  const waterMl = todayHabit.waterGlasses * 250;
  const targetWaterMl = 3000; // 3 Liters
  const hydrationPercent = Math.min(100, Math.round((waterMl / targetWaterMl) * 100));

  const handleAddWaterAmount = (ml: number) => {
    const additionalGlasses = Math.max(1, Math.round(ml / 250));
    const newGlasses = todayHabit.waterGlasses + additionalGlasses;
    updateDailyHabits(activeTrainee.id, {
      waterGlasses: newGlasses
    });
    if (newGlasses * 250 >= targetWaterMl && todayHabit.waterGlasses * 250 < targetWaterMl) {
      triggerFullCompletion('شرب هدف الماء والترطيب اليومي بالكامل 💧');
    } else {
      triggerCheer('أحسنت 🔥🔥');
    }
  };

  // Macro Totals (Calculated dynamically from checked and logged meals)
  const totalCaloriesConsumed = activeTrainee.loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinConsumed = activeTrainee.loggedMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbsConsumed = activeTrainee.loggedMeals.reduce((acc, m) => acc + (m.carbs || 0), 0) || (totalCaloriesConsumed > 0 ? Math.round(totalCaloriesConsumed * 0.45 / 4) : 0);
  const remainingCalories = Math.max(0, activeTrainee.macroGoals.calories - totalCaloriesConsumed);
  const calPercent = Math.min(100, Math.round((totalCaloriesConsumed / activeTrainee.macroGoals.calories) * 100));

  // Current Workout Day
  const currentDay = activeTrainee.program.days[0];

  // Dynamic Arabic Date e.g. 28 سبتمبر
  const todayFormatted = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  const firstName = activeTrainee.fullName.split(' ')[0] || 'البطل';

  // Subscription calculation (منضم من متى وفاضلو كم يوم متبقي)
  const joinDateStr = '12 يناير 2025'; // تاريخ انضمام المتدرب
  const totalSubDays = 90;
  const daysRemaining = 48; // فاضلو 48 يوم متبقي
  const daysPassed = totalSubDays - daysRemaining;
  const subProgressPercent = Math.round((daysRemaining / totalSubDays) * 100);

  // Weight metrics
  const startingWeight = 84.0;
  const currentWeight = activeTrainee.currentWeightKg || 78.4;
  const targetWeight = activeTrainee.targetWeightKg || 72.0;
  const totalWeightLoss = (startingWeight - currentWeight).toFixed(1);
  const remainingToGoal = Math.max(0, currentWeight - targetWeight).toFixed(1);

  return (
    <div className="w-full space-y-4 pb-24 text-neutral-100">
      
      {/* Top Bar with Dark Luxury Styling */}
      <div className="bg-neutral-900/90 rounded-2xl p-4 shadow-sm border border-neutral-800 flex items-center justify-between">
        
        {/* Left: Direct Notification / Chat Bell */}
        <button 
          onClick={onOpenChat}
          className="w-10 h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 relative transition-colors"
          title="التنبيهات والمحادثة مع المدرب"
        >
          <Bell className="w-5 h-5 text-neutral-200" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-neutral-900"></span>
        </button>

        {/* Center / Right: Trainee Greeting & Dark Emblem */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h2 className="text-sm sm:text-base font-black text-white">
              أهلاً بك، {firstName} 👋
            </h2>
            <p className="text-[11px] font-semibold text-emerald-400 tracking-tight">
              جاهز لتحدي وتمرين اليوم
            </p>
          </div>

          {/* Luxury Fitness Crest Icon */}
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center p-1.5 shadow-xs">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* Date & Day Banner */}
      <div className="bg-neutral-900/80 rounded-2xl p-3 shadow-xs border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400">
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs font-bold text-neutral-200">{todayFormatted}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>يوم تدريبي</span>
        </div>
      </div>

      {/* Subscription Card (الاشتراك - منضم من متى وفاضلو كام يوم متبقي) */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-850 rounded-2xl p-4 shadow-sm border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400">اشتراك نشط (VIP Coaching)</span>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">
            تاريخ الانضمام: <strong className="text-neutral-200">{joinDateStr}</strong>
          </span>
        </div>

        {/* Remaining Days Counter & Visual Progress */}
        <div className="bg-neutral-950/70 p-3 rounded-xl border border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 block font-medium">المدة المتبقية بالاشتراك</span>
            <span className="text-lg font-black text-white flex items-baseline gap-1">
              <span className="text-2xl font-mono text-emerald-400">{daysRemaining}</span>
              <span className="text-xs text-neutral-300">يوماً متبقياً</span>
            </span>
          </div>

          <div className="text-left">
            <span className="text-[10px] text-neutral-400 block font-medium">إجمالي الباقة</span>
            <span className="text-xs font-bold text-neutral-300 font-mono">
              مضى {daysPassed} من {totalSubDays} يوم
            </span>
          </div>
        </div>

        {/* Progress Bar for Subscription */}
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${subProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hero Workout Spotlight Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-850 p-5 shadow-lg border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 tracking-wide uppercase block">جدول اليوم المعتمد</span>
              <h3 className="text-base font-black text-white">{currentDay.dayName}</h3>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('training')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <span>بدء التمرين</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold">{currentDay.exercises.length}</span>
            <span className="text-neutral-400">تمارين</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold">{currentDay.estimatedMinutes}</span>
            <span className="text-neutral-400">دقيقة</span>
          </div>
          <span>•</span>
          <span className="text-emerald-400 font-bold">{currentDay.focusArea}</span>
        </div>
      </div>

      {/* Biological Age Card */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900/90 p-4 shadow-sm border border-neutral-800 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h4 className="text-sm font-black text-white">اختبار العمر البيولوجي</h4>
          </div>
          <p className="text-xs text-neutral-400">احسب حيوية خلايا جسمك وجودة استشفائك</p>
        </div>

        <button
          onClick={() => setIsBioAgeOpen(true)}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>ابدأ الفحص</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Calories & Macros Summary Bar */}
      <div className="bg-neutral-900/90 rounded-2xl p-4 shadow-sm border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black text-white">السعرات والماكروز اليومية</span>
          </div>
          <button
            onClick={() => onNavigateTab('nutrition')}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            عرض الوجبات ↗
          </button>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-neutral-400 font-medium">تم استهلاك: <strong className="text-white">{totalCaloriesConsumed}</strong> سعرة</span>
            <span className="text-neutral-400 font-medium">الهدف: <strong className="text-white">{activeTrainee.macroGoals.calories}</strong> سعرة</span>
          </div>
          <div className="h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${calPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
          <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">بروتين</span>
            <span className="font-bold text-emerald-400">{totalProteinConsumed} / {activeTrainee.macroGoals.proteinGrams}g</span>
          </div>
          <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">كارب</span>
            <span className="font-bold text-neutral-200">120 / {activeTrainee.macroGoals.carbsGrams}g</span>
          </div>
          <div className="bg-neutral-950/70 p-2 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block">المتبقي</span>
            <span className="font-bold text-emerald-400">{remainingCalories} سعرة</span>
          </div>
        </div>
      </div>

      {/* Quick Habit Tracker - Water removed as requested, Steps auto-tracked from phone sensors, Sleep */}
      <div className="grid grid-cols-2 gap-3">
        {/* Steps with Automatic Phone Link */}
        <div className="bg-neutral-900/90 p-3.5 rounded-2xl border border-neutral-800 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <Footprints className={`w-5 h-5 ${isLiveWalking ? 'text-emerald-300 scale-110' : 'text-emerald-400'} transition-all`} />
            <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[9px] font-bold text-emerald-400">تتبع تلقائي من الهاتف</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-[10px] text-neutral-400 block font-medium">خطوات اليوم (تلقائي)</span>
            <span className="text-base font-black text-white font-mono">{autoSteps.toLocaleString()}</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">الهدف: 10,000 خطوة</span>
          </div>
        </div>

        {/* Sleep - Weekly submission: 1 to 3 hours, 3 to 5 hours, 7 to 9 hours */}
        <div className="bg-neutral-900/90 p-3.5 rounded-2xl border border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white">متوسط نوم الأسبوع</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
              تسجيل أسبوعي
            </span>
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-400 block font-medium">ساعات النوم (مرة أسبوعياً):</span>
              <span className="text-[9px] text-emerald-400">✓ معتمد للمدرب</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setWeeklySleepHours(2)}
                className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer border ${
                  weeklySleepHours <= 3
                    ? 'bg-rose-950/60 border-rose-500/70 text-rose-300 font-black shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title="من 1 إلى 3 ساعات (نوم قليل جداً)"
              >
                <span className="text-[10px] block font-mono">1 - 3</span>
                <span className="text-[8px] text-neutral-400 block">ساعات</span>
              </button>

              <button
                type="button"
                onClick={() => setWeeklySleepHours(4)}
                className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer border ${
                  weeklySleepHours > 3 && weeklySleepHours <= 5
                    ? 'bg-amber-950/60 border-amber-500/70 text-amber-300 font-black shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title="من 3 إلى 5 ساعات (نوم متوسط)"
              >
                <span className="text-[10px] block font-mono">3 - 5</span>
                <span className="text-[8px] text-neutral-400 block">ساعات</span>
              </button>

              <button
                type="button"
                onClick={() => setWeeklySleepHours(8)}
                className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer border ${
                  weeklySleepHours > 5
                    ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-300 font-black shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title="من 7 إلى 9 ساعات (استشفاء مثالي)"
              >
                <span className="text-[10px] block font-mono">7 - 9</span>
                <span className="text-[8px] text-neutral-400 block">ساعات ✓</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-0.5">
              <span>المسجل أسبوعياً: <strong className="text-white font-mono">{weeklySleepHours}h</strong></span>
              <span className={weeklySleepHours > 5 ? 'text-emerald-400 font-bold' : weeklySleepHours <= 3 ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                {weeklySleepHours > 5 ? 'استشفاء عميق 90%' : weeklySleepHours <= 3 ? 'تنبيه: إرهاق' : 'استشفاء متوسط 65%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BODY MEASUREMENTS & HYDRATION SECTION (مقاييس الجسم والترطيب وتسجيل المياه السريع) */}
      <div className="bg-neutral-900/90 rounded-2xl p-4 shadow-sm border border-neutral-800 space-y-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black text-white">مقاييس الجسم ومستوى الترطيب</h3>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">تحديث دوري دقيق</span>
        </div>

        {/* 1. Body Weight Details (وزن الجسم بتفاصيله) */}
        <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">الوزن الحالي المسجل</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-white font-mono">{currentWeight}</span>
                <span className="text-xs text-neutral-400 font-bold">كغ</span>
              </div>
            </div>

            <button
              onClick={() => setShowWeightModal(true)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>تسجيل وزن</span>
            </button>
          </div>

          {/* Weight Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">الابتدائي</span>
              <span className="font-bold text-neutral-300 font-mono">{startingWeight} كغ</span>
            </div>
            <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">إجمالي النزول</span>
              <span className="font-bold text-emerald-400 font-mono">-{totalWeightLoss} كغ</span>
            </div>
            <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block">المستهدف</span>
              <span className="font-bold text-white font-mono">{targetWeight} كغ</span>
            </div>
          </div>
        </div>

        {/* 2. Hydration Details (الترطيب بتفاصيلها) */}
        <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white">مستوى الترطيب اليومي</span>
            </div>
            <span className="text-xs font-mono font-bold text-sky-400">
              {(waterMl / 1000).toFixed(2)}L / {(targetWaterMl / 1000).toFixed(1)}L
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${hydrationPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
            <span>نسبة إتمام الترطيب: <strong className="text-white">{hydrationPercent}%</strong></span>
            <span className="text-emerald-400">استشفاء عضلي ممتاز ✓</span>
          </div>
        </div>

        {/* 3. Quick Water Logging Buttons (تسجيل مياه سريع بتفاصيله) */}
        <div>
          <span className="text-[11px] font-bold text-neutral-300 block mb-2">تسجيل مياه سريع:</span>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleAddWaterAmount(250)}
              className="p-2.5 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-sky-500/50 rounded-xl text-center transition-all cursor-pointer group"
            >
              <Droplet className="w-3.5 h-3.5 text-sky-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white block">+250ml</span>
              <span className="text-[9px] text-neutral-400 block">كوب ماء</span>
            </button>

            <button
              onClick={() => handleAddWaterAmount(500)}
              className="p-2.5 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-sky-500/50 rounded-xl text-center transition-all cursor-pointer group"
            >
              <Droplet className="w-3.5 h-3.5 text-sky-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white block">+500ml</span>
              <span className="text-[9px] text-neutral-400 block">زجاجة صغيرة</span>
            </button>

            <button
              onClick={() => handleAddWaterAmount(750)}
              className="p-2.5 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-sky-500/50 rounded-xl text-center transition-all cursor-pointer group"
            >
              <Droplet className="w-3.5 h-3.5 text-sky-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white block">+750ml</span>
              <span className="text-[9px] text-neutral-400 block">مطارة شيكر</span>
            </button>

            <button
              onClick={() => handleAddWaterAmount(1000)}
              className="p-2.5 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-sky-500/50 rounded-xl text-center transition-all cursor-pointer group"
            >
              <Droplet className="w-3.5 h-3.5 text-sky-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white block">+1000ml</span>
              <span className="text-[9px] text-neutral-400 block">لتر كامل</span>
            </button>
          </div>
        </div>

      </div>

      {/* Quick Weight Record Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-neutral-900 rounded-2xl p-5 border border-neutral-800 shadow-2xl text-neutral-100 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">تسجيل قياس الوزن</h4>
              </div>
              <button 
                onClick={() => setShowWeightModal(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">الوزن الحالي بالكيلوغرام (كغ):</label>
              <input 
                type="number" 
                step="0.1" 
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                className="w-full py-2.5 px-3 bg-neutral-950 border border-neutral-800 rounded-xl text-center text-xl font-bold font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowWeightModal(false)}
                className="w-1/2 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  const val = parseFloat(newWeightInput);
                  if (val && val > 30) {
                    updateTraineeProfile(activeTrainee.id, { currentWeightKg: val });
                  }
                  setShowWeightModal(false);
                }}
                className="w-1/2 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-black transition-colors"
              >
                حفظ القياس
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Biological Age Modal */}
      <BiologicalAgeModal
        isOpen={isBioAgeOpen}
        onClose={() => setIsBioAgeOpen(false)}
        actualAge={activeTrainee.age || 26}
      />

    </div>
  );
};

