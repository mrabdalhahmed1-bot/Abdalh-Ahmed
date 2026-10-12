import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { MealItem } from '../../types/fitness';
import { 
  Flame, 
  Utensils, 
  Plus, 
  Trash2, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Apple, 
  Coffee, 
  Beef, 
  Egg,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';

interface DailyMacroTrackerProps {
  onOpenLoggerModal: (mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
}

export const DailyMacroTracker: React.FC<DailyMacroTrackerProps> = ({ onOpenLoggerModal }) => {
  const { activeTrainee, logMeal, deleteMeal } = useFitness();
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');

  const { macroGoals, loggedMeals, goal } = activeTrainee;

  // Macro Totals
  const totalCalories = loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = loggedMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = loggedMeals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFat = loggedMeals.reduce((acc, m) => acc + m.fat, 0);

  // Targets
  const targetCalories = macroGoals.calories;
  const targetProtein = macroGoals.proteinGrams;
  const targetCarbs = macroGoals.carbsGrams;
  const targetFat = macroGoals.fatsGrams;

  // Remainders
  const remainingCalories = Math.max(0, targetCalories - totalCalories);
  const remainingProtein = Math.max(0, targetProtein - totalProtein);
  const remainingCarbs = Math.max(0, targetCarbs - totalCarbs);
  const remainingFat = Math.max(0, targetFat - totalFat);

  // Percentages (capped at 100 for bar display, but displayed accurately in numbers)
  const calPercent = Math.min(100, Math.round((totalCalories / targetCalories) * 100)) || 0;
  const proteinPercent = Math.min(100, Math.round((totalProtein / targetProtein) * 100)) || 0;
  const carbsPercent = Math.min(100, Math.round((totalCarbs / targetCarbs) * 100)) || 0;
  const fatPercent = Math.min(100, Math.round((totalFat / targetFat) * 100)) || 0;

  // Meal Type Categories
  const mealSections = [
    { 
      type: 'breakfast' as const, 
      label: 'وجبة الفطور', 
      labelEn: 'Breakfast',
      icon: Egg, 
      color: 'text-amber-400', 
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20'
    },
    { 
      type: 'lunch' as const, 
      label: 'وجبة الغداء الرئيسية', 
      labelEn: 'Lunch',
      icon: Beef, 
      color: 'text-emerald-400', 
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/20'
    },
    { 
      type: 'dinner' as const, 
      label: 'وجبة العشاء الخفيفة', 
      labelEn: 'Dinner',
      icon: Utensils, 
      color: 'text-indigo-400', 
      bgColor: 'bg-indigo-400/10',
      borderColor: 'border-indigo-400/20'
    },
    { 
      type: 'snack' as const, 
      label: 'سناك وقبل التمرين', 
      labelEn: 'Snacks & Pre-Workout',
      icon: Coffee, 
      color: 'text-cyan-400', 
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-400/20'
    }
  ];

  // Quick 1-tap add items
  const handleQuickAdd = (name: string, cal: number, p: number, c: number, f: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    logMeal(activeTrainee.id, {
      name,
      calories: cal,
      protein: p,
      carbs: c,
      fat: f,
      serving: 'حصة سريعة',
      mealType,
    });
  };

  // Coaching Dynamic Advice
  const getCoachGuidance = () => {
    if (remainingProtein > 45) {
      return {
        title: 'ركز على البروتين في وجبتك القادمة!',
        desc: `متبقي لك ${remainingProtein}غ بروتين لبلوغ هدفك اليومي. ننصحك بإضافة صدر دجاج مشوي، أو علبة تونة، أو سكوب واي بروتين مع وجبتك القادمة.`,
        type: 'warning'
      };
    }
    if (totalCalories > targetCalories + 50) {
      return {
        title: 'وصلت لحد السعرات اليومي',
        desc: `أنجزت سعراتك كاملة اليوم (${totalCalories} Cal). ننصح بالاكتفاء بالماء وشاي الأعشاب لباقي اليوم.`,
        type: 'neutral'
      };
    }
    return {
      title: 'أداء غذائي متوازن ومثالي!',
      desc: `توزيع الماكروز لديك اليوم ممتاز ويتوافق تماماً مع خطة ${activeTrainee.goalTitle}. استمر بهذا الانضباط يا بطل!`,
      type: 'success'
    };
  };

  const coachAdvice = getCoachGuidance();

  return (
    <div className="space-y-6">
      
      {/* 1. HERO MACRO DASHBOARD CARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Circular Calorie Gauge */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="text-neutral-800"
                  strokeWidth="11"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="text-emerald-500 transition-all duration-700 ease-out"
                  strokeWidth="11"
                  strokeDasharray={314.16}
                  strokeDashoffset={314.16 - (314.16 * calPercent) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black font-mono text-white tracking-tight leading-none">
                  {remainingCalories}
                </span>
                <span className="text-[11px] font-medium text-neutral-400 mt-1">سعرة متبقية</span>
                <span className="text-[10px] text-emerald-400 font-bold font-mono mt-0.5">{calPercent}% مكتمل</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">ميزانية السعرات اليومية</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                  {goal === 'fat_loss' ? 'عجز حرق الدهون' : goal === 'muscle_gain' ? 'فائض بناء العضل' : 'إعادة تشكيل'}
                </span>
              </div>
              <div className="text-xs text-neutral-400">
                المستهلك اليوم: <span className="font-mono text-white font-bold text-sm">{totalCalories}</span> <span className="text-neutral-500">من أصل</span> <span className="font-mono text-neutral-200 font-bold">{targetCalories} Cal</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed max-w-xs">
                مبنية على أهدافك التدريبية بإشراف الكوتش لضمان الحفاظ على الكتلة العضلية.
              </p>
            </div>
          </div>

          {/* 3 Interactive Tactile Macro Bars */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Protein Card */}
            <div className="bg-neutral-950/80 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-4 transition-all shadow-sm">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>البروتين (Protein)</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {totalProtein >= targetProtein ? '✓ مكتمل' : `باقي ${remainingProtein}غ`}
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-black font-mono text-white">{totalProtein}</span>
                <span className="text-xs text-neutral-400 font-mono">/ {targetProtein}غ</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden my-2">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${proteinPercent}%` }} 
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>{proteinPercent}% من الهدف</span>
                <span>{totalProtein * 4} Cal</span>
              </div>
            </div>

            {/* Carbs Card */}
            <div className="bg-neutral-950/80 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-4 transition-all shadow-sm">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>الكاربوهيدرات (Carbs)</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {totalCarbs >= targetCarbs ? '✓ مكتمل' : `باقي ${remainingCarbs}غ`}
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-black font-mono text-white">{totalCarbs}</span>
                <span className="text-xs text-neutral-400 font-mono">/ {targetCarbs}غ</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden my-2">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${carbsPercent}%` }} 
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>{carbsPercent}% من الهدف</span>
                <span>{totalCarbs * 4} Cal</span>
              </div>
            </div>

            {/* Fats Card */}
            <div className="bg-neutral-950/80 border border-cyan-500/20 hover:border-cyan-500/40 rounded-2xl p-4 transition-all shadow-sm">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>الدهون الصحية (Fats)</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {totalFat >= targetFat ? '✓ مكتمل' : `باقي ${remainingFat}غ`}
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-black font-mono text-white">{totalFat}</span>
                <span className="text-xs text-neutral-400 font-mono">/ {targetFat}غ</span>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden my-2">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${fatPercent}%` }} 
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>{fatPercent}% من الهدف</span>
                <span>{totalFat * 9} Cal</span>
              </div>
            </div>

          </div>

        </div>

        {/* Dynamic Coach Guidance Prompt */}
        <div className={`mt-5 p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
          coachAdvice.type === 'warning'
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            : coachAdvice.type === 'neutral'
            ? 'bg-neutral-950/80 border-neutral-700 text-neutral-300'
            : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
        }`}>
          <div className="p-1 rounded-lg bg-neutral-900 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold block mb-0.5">{coachAdvice.title}</span>
            <p className="text-[11px] text-neutral-300 leading-relaxed">{coachAdvice.desc}</p>
          </div>
        </div>

      </div>

      {/* 2. LIGHTNING QUICK-ADD PRESETS BAR */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">إضافة فورية بضغطة زر واحدة (1-Tap Quick Add)</h4>
          </div>
          <span className="text-[11px] text-neutral-400">مثالية لتسجيل السناكات والمكملات بسرعة</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleQuickAdd('سكوب واي بروتين', 120, 25, 2, 1.5, 'snack')}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-emerald-500/40 text-right transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-emerald-400">+ سكوب بروتين</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">25g P</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">120 Cal · 1 سكوب</span>
          </button>

          <button
            onClick={() => handleQuickAdd('بيضتان مسلوقتان', 145, 13, 1, 10, 'breakfast')}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/40 text-right transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-amber-400">+ بيضتان مسلوقتان</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">13g P</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">145 Cal · فطور</span>
          </button>

          <button
            onClick={() => handleQuickAdd('موزة طاقة قبل التمرين', 105, 1.3, 27, 0.3, 'snack')}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/40 text-right transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-amber-400">+ حبة موز</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">27g C</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">105 Cal · طاقة وتمرين</span>
          </button>

          <button
            onClick={() => handleQuickAdd('زبادي يوناني قليل الدسم', 130, 18, 6, 2, 'snack')}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-cyan-500/40 text-right transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white group-hover:text-cyan-400">+ زبادي يوناني</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">18g P</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">130 Cal · 170غ</span>
          </button>
        </div>
      </div>

      {/* 3. CATEGORIZED MEAL TIMELINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">جدول الوجبات المنظم لليوم (Daily Meal Log)</h3>
            <span className="text-xs text-neutral-400">سجل وتتبع كل وجبة على حدة لحساب ماكروز متوازن على مدار اليوم</span>
          </div>

          <button
            onClick={() => onOpenLoggerModal()}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل وجبة جديدة</span>
          </button>
        </div>

        {/* 4 Meal Category Sections */}
        <div className="space-y-3.5">
          {mealSections.map((sec) => {
            const mealsInSec = loggedMeals.filter(m => m.mealType === sec.type);
            const secCalories = mealsInSec.reduce((acc, m) => acc + m.calories, 0);
            const secProtein = mealsInSec.reduce((acc, m) => acc + m.protein, 0);
            const secCarbs = mealsInSec.reduce((acc, m) => acc + m.carbs, 0);
            const secFat = mealsInSec.reduce((acc, m) => acc + m.fat, 0);
            const Icon = sec.icon;

            return (
              <div 
                key={sec.type}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Section Header */}
                <div className="px-5 py-3.5 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sec.bgColor} ${sec.color} border ${sec.borderColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{sec.label}</h4>
                        <span className="text-[10px] text-neutral-500 font-mono">({mealsInSec.length} أطعمة)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-0.5">
                        <span className="text-white font-bold">{secCalories} Cal</span>
                        <span>·</span>
                        <span className="text-emerald-400">P: {secProtein}g</span>
                        <span>·</span>
                        <span className="text-amber-400">C: {secCarbs}g</span>
                        <span>·</span>
                        <span className="text-cyan-400">F: {secFat}g</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenLoggerModal(sec.type)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium border border-neutral-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>إضافة في {sec.label.split(' ')[0]}</span>
                  </button>
                </div>

                {/* Section Items */}
                {mealsInSec.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-500">
                    لم تقم بتسجيل أي طعام في {sec.label} اليوم. 
                    <button
                      onClick={() => onOpenLoggerModal(sec.type)}
                      className="text-emerald-400 hover:underline mr-1 font-medium"
                    >
                      اضغط لإضافة أول وجبة
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-800/50">
                    {mealsInSec.map((meal) => (
                      <div 
                        key={meal.id} 
                        className="px-5 py-3 hover:bg-neutral-950/40 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-white block">{meal.name}</span>
                            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                              <span className="text-neutral-500">{meal.serving}</span>
                              <span>·</span>
                              <span className="font-mono text-emerald-400 font-bold">{meal.calories} Cal</span>
                              <span>·</span>
                              <span className="font-mono text-neutral-300">P:{meal.protein}g</span>
                              <span>·</span>
                              <span className="font-mono text-neutral-300">C:{meal.carbs}g</span>
                              <span>·</span>
                              <span className="font-mono text-neutral-300">F:{meal.fat}g</span>
                              <span>·</span>
                              <span className="font-mono text-neutral-500">{meal.loggedAt}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteMeal(activeTrainee.id, meal.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors"
                          title="حذف هذا الطعام"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
