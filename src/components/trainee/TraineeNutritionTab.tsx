import React, { useState, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { 
  Utensils, 
  RotateCw, 
  Check, 
  Plus, 
  Sparkles, 
  Info, 
  Flame, 
  Scale,
  CheckCircle2,
  Camera,
  FileDown
} from 'lucide-react';
import { MealSwapModal } from './MealSwapModal';
import { FoodLoggerModal } from './FoodLoggerModal';
import { FoodDetailModal } from './FoodDetailModal';
import { exportProgramToPdf } from '../../utils/pdfExport';

export const TraineeNutritionTab: React.FC = () => {
  const { 
    activeTrainee, 
    checkedMealIds, 
    toggleMealChecked, 
    triggerFullCompletion,
    registerBackHandler
  } = useFitness();

  const [swapModalFood, setSwapModalFood] = useState<{ sectionId: string; foodId: string; food: string; calories: number; cat: string } | null>(null);
  const [selectedFoodForDetail, setSelectedFoodForDetail] = useState<any | null>(null);
  const [isFoodLoggerOpen, setIsFoodLoggerOpen] = useState(false);

  // Mobile Back Button handlers for Nutrition modals
  useEffect(() => {
    if (swapModalFood) {
      return registerBackHandler(() => {
        setSwapModalFood(null);
        return true;
      });
    }
  }, [swapModalFood, registerBackHandler]);

  useEffect(() => {
    if (selectedFoodForDetail) {
      return registerBackHandler(() => {
        setSelectedFoodForDetail(null);
        return true;
      });
    }
  }, [selectedFoodForDetail, registerBackHandler]);

  useEffect(() => {
    if (isFoodLoggerOpen) {
      return registerBackHandler(() => {
        setIsFoodLoggerOpen(false);
        return true;
      });
    }
  }, [isFoodLoggerOpen, registerBackHandler]);

  // Structured Diet Meals with high-resolution guaranteed images and accurate macros
  const initialSections = [
    {
      id: 'snack',
      title: 'Snack',
      titleAr: 'سناك ما قبل التمرين',
      itemsCount: 2,
      totalCalories: 289,
      note: 'مفضلة قبل التمرين بـ 30 إلى 45 دقيقة لطاقة وثبات الأداء وسرعة ضخ الدم',
      category: 'snack',
      foods: [
        {
          id: 's1',
          name: 'بلح وتمر مجفف مع حبات لوز نيء',
          portion: 'حبتان تمر سكري + 8 حبات لوز',
          calories: 169,
          protein: 4,
          carbs: 28,
          fat: 6,
          fiber: 3,
          image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=80'
        },
        {
          id: 's2',
          name: 'شوكولاتة داكنة 70-85% كاكاو نقي',
          portion: '20 جرام (مكعبان)',
          calories: 120,
          protein: 2,
          carbs: 9,
          fat: 8,
          fiber: 2,
          image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      id: 'breakfast',
      title: 'Breakfast',
      titleAr: 'وجبة الإفطار',
      itemsCount: 5,
      totalCalories: 657,
      category: 'carbs',
      foods: [
        {
          id: 'b1',
          name: 'خبز بلدي (100% قمح كامل ونخالة)',
          portion: '1 رغيف بلدي (80غ)',
          calories: 190,
          protein: 7,
          carbs: 38,
          fat: 1.5,
          fiber: 5,
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80'
        },
        {
          id: 'b2',
          name: 'بيض كامل مسلوق أو مقلي بنصف ملعقة زيت',
          portion: '3 بيضات كاملة (165غ)',
          calories: 235,
          protein: 19,
          carbs: 1.5,
          fat: 16,
          fiber: 0,
          image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80'
        },
        {
          id: 'b3',
          name: 'جبنة قريش طبيعية طازجة',
          portion: '120 جرام',
          calories: 118,
          protein: 16,
          carbs: 4,
          fat: 2,
          fiber: 0,
          image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=500&auto=format&fit=crop&q=80'
        },
        {
          id: 'b4',
          name: 'زيت زيتون بكر ممتاز معصور على البارد',
          portion: '5 مل (ملعقة شاي)',
          calories: 44,
          protein: 0,
          carbs: 0,
          fat: 5,
          fiber: 0,
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80'
        },
        {
          id: 'b5',
          name: 'طماطم وخضار ورقية طازجة',
          portion: '100 جرام',
          calories: 18,
          protein: 1,
          carbs: 4,
          fat: 0.2,
          fiber: 1.5,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      id: 'lunch',
      title: 'Lunch',
      titleAr: 'وجبة الغداء',
      itemsCount: 3,
      totalCalories: 710,
      category: 'protein',
      foods: [
        {
          id: 'l1',
          name: 'صدور دجاج مشوية متبلة بالليمون والأعشاب',
          portion: '200 جرام (وزن بعد الطهي)',
          calories: 330,
          protein: 62,
          carbs: 0,
          fat: 7,
          fiber: 0,
          image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80'
        },
        {
          id: 'l2',
          name: 'أرز بسمتي أصفر مسلوق على البخار',
          portion: '200 جرام (وزن بعد الطهي)',
          calories: 260,
          protein: 6,
          carbs: 56,
          fat: 1,
          fiber: 2,
          image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80'
        },
        {
          id: 'l3',
          name: 'سلطة خضراء مع زيت زيتون وعصير ليمون',
          portion: '150 جرام',
          calories: 120,
          protein: 2,
          carbs: 6,
          fat: 10,
          fiber: 4,
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      id: 'dinner',
      title: 'Dinner',
      titleAr: 'وجبة العشاء',
      itemsCount: 3,
      totalCalories: 435,
      category: 'protein',
      note: 'وجبة غنية ببروتين الكازين البطيء لدعم البناء والاستشفاء العضلي أثناء النوم',
      foods: [
        {
          id: 'd1',
          name: 'جبنة قريش أو زبادي يوناني غني بالبروتين',
          portion: '150 جرام',
          calories: 145,
          protein: 22,
          carbs: 5,
          fat: 2,
          fiber: 0,
          image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=500&auto=format&fit=crop&q=80'
        },
        {
          id: 'd2',
          name: 'بيضتان مسلوقتان مع رشة كمون',
          portion: '110 جرام (بيضتان)',
          calories: 155,
          protein: 13,
          carbs: 1,
          fat: 11,
          fiber: 0,
          image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80'
        },
        {
          id: 'd3',
          name: 'توست أسمر حبوب كاملة وخضار مقطعة',
          portion: 'شريحتان (60غ) + خيار وطماطم',
          calories: 135,
          protein: 6,
          carbs: 24,
          fat: 1.5,
          fiber: 4,
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80'
        }
      ]
    }
  ];

  const [dietSections, setDietSections] = useState(initialSections);
  const [carbDayType, setCarbDayType] = useState<'high' | 'low'>('high');
  const [isScaleModeOpen, setIsScaleModeOpen] = useState(false);
  const [gramAdjustments, setGramAdjustments] = useState<Record<string, number>>({});

  // Synchronize diet sections whenever activeTrainee or carbDayType changes
  useEffect(() => {
    if (activeTrainee?.customDietPlan) {
      if (activeTrainee.customDietPlan.planType === 'carb_cycling') {
        const plan = carbDayType === 'high' 
          ? activeTrainee.customDietPlan.highCarbDay 
          : activeTrainee.customDietPlan.lowCarbDay;
        if (plan && plan.meals) {
          setDietSections(plan.meals as any);
          return;
        }
      } else if (activeTrainee.customDietPlan.standardMeals) {
        setDietSections(activeTrainee.customDietPlan.standardMeals as any);
        return;
      }
    }
    setDietSections(initialSections);
  }, [activeTrainee, carbDayType]);

  const handleAdjustGrams = (foodId: string, delta: number) => {
    setGramAdjustments(prev => {
      const current = prev[foodId] || 0;
      const updated = Math.max(-100, current + delta);
      return { ...prev, [foodId]: updated };
    });
  };

  const currentMacros = React.useMemo(() => {
    if (activeTrainee?.customDietPlan?.planType === 'carb_cycling') {
      const plan = carbDayType === 'high' 
        ? activeTrainee.customDietPlan.highCarbDay 
        : activeTrainee.customDietPlan.lowCarbDay;
      if (plan?.targetMacros) {
        return plan.targetMacros;
      }
    }
    return {
      calories: activeTrainee?.macroGoals?.calories || 2200,
      protein: activeTrainee?.macroGoals?.proteinGrams || 180,
      carbs: activeTrainee?.macroGoals?.carbsGrams || 220,
      fat: activeTrainee?.macroGoals?.fatsGrams || 60
    };
  }, [activeTrainee, carbDayType]);

  const handleToggleCheck = (food: { id: string; name: string; calories: number; protein: number; carbs?: number; fat?: number }) => {
    toggleMealChecked(food.id, {
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs || 20,
      fat: food.fat || 5
    });

    // Check if this action completes all foods
    const allFoodIds = dietSections.flatMap(s => s.foods.map(f => f.id));
    const wasChecked = !!checkedMealIds[food.id];
    if (!wasChecked) {
      const willBeCheckedCount = allFoodIds.filter(id => id === food.id || checkedMealIds[id]).length;
      if (willBeCheckedCount === allFoodIds.length) {
        triggerFullCompletion('أكلت جميع وجباتك المقررة اليوم بالكامل بنجاح');
      }
    }
  };

  const handleApplySwap = (newName: string, newCalories: number) => {
    if (!swapModalFood) return;
    const { sectionId, foodId } = swapModalFood;

    setDietSections(prevSections => 
      prevSections.map(section => {
        if (section.id !== sectionId) return section;
        const updatedFoods = section.foods.map(food => {
          if (food.id === foodId) {
            return {
              ...food,
              name: newName,
              calories: newCalories
            };
          }
          return food;
        });
        const newTotalCal = updatedFoods.reduce((acc, f) => acc + f.calories, 0);
        return {
          ...section,
          totalCalories: newTotalCal,
          foods: updatedFoods
        };
      })
    );
  };

  const handleExportDietPdf = () => {
    exportProgramToPdf({
      title: 'الخطة الغذائية والماكروز اليومية المعتمدة',
      subtitle: activeTrainee?.customDietPlan?.planType === 'carb_cycling'
        ? (carbDayType === 'high' ? 'أيام الكارب العالي (High Carb Day)' : 'أيام الكارب المنخفض (Low Carb Day)')
        : 'البرنامج الغذائي المخصص',
      category: 'diet',
      traineeName: activeTrainee?.fullName || 'المتدرب',
      targetGoal: activeTrainee?.goalTitle,
      items: dietSections.flatMap(sec =>
        sec.foods.map(f => ({
          title: f.name,
          subtitle: `${sec.titleAr} · ${f.portion}`,
          badges: [`${f.calories} سعرة`, `بروتين ${f.protein}g`, `كارب ${f.carbs}g`, `دهون ${f.fat}g`],
          details: [`الألياف: ${f.fiber}g`]
        }))
      ),
      summaryNotes: [
        `المستهدف اليومي: ${activeTrainee?.macroGoals.calories || 2200} سعرة | بروتين ${activeTrainee?.macroGoals.proteinGrams || 160}g | كارب ${activeTrainee?.macroGoals.carbsGrams || 230}g | دهون ${activeTrainee?.macroGoals.fatsGrams || 60}g`,
        `احتياج الماء اليومي: ${activeTrainee?.macroGoals.waterLiters || 3.5} لتر لترطيب الخلايا العضلية وضخ الدم`,
        'احرص على وزن الوجبات بميزان المطبخ للحفاظ على دقة النتائج'
      ]
    });
  };

  return (
    <div className="w-full space-y-4 pb-24 text-neutral-100">
      
      {/* Carb Cycling Control Banner for Mohamed Qasim */}
      {activeTrainee.customDietPlan?.planType === 'carb_cycling' && (
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 rounded-2xl p-4 border border-amber-500/30 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">نظام تدوير الكارب (Carb Cycling Protocol)</h4>
                <p className="text-[10px] text-neutral-400">التنقل السلس بين يوم الكارب العالي ويوم الكارب المنخفض</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              {carbDayType === 'high' ? 'High Carb Active' : 'Low Carb Active'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
            <button
              onClick={() => setCarbDayType('high')}
              className={`py-2 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                carbDayType === 'high'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 scale-[1.01]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span>⚡</span>
              <span>يوم الكارب العالي</span>
              <span className="text-[10px] opacity-80">(342g C)</span>
            </button>

            <button
              onClick={() => setCarbDayType('low')}
              className={`py-2 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                carbDayType === 'low'
                  ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 scale-[1.01]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span>🛡️</span>
              <span>يوم الكارب المنخفض</span>
              <span className="text-[10px] opacity-80">(288g C)</span>
            </button>
          </div>
        </div>
      )}

      {/* Grams Adjuster Banner for Prescribed Diet (Youssef Gamal & Standard) */}
      {(activeTrainee.fullName === 'يوسف جمال' || activeTrainee.customDietPlan?.planType === 'standard') && (
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-emerald-950/30 rounded-2xl p-3.5 border border-emerald-500/30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">الدايت المخصص بدقة الجرامات</h4>
              <p className="text-[10px] text-neutral-400">تعديل كميات الجرامات يتماشى مع هدفك مع الحفاظ على نفس الأصناف</p>
            </div>
          </div>
          <button
            onClick={() => setIsScaleModeOpen(!isScaleModeOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isScaleModeOpen
                ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                : 'bg-neutral-950 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10'
            }`}
          >
            {isScaleModeOpen ? 'حفظ الجرامات ✓' : 'تعديل الجرامات ±'}
          </button>
        </div>
      )}

      {/* Meals Groups List */}
      <div className="space-y-4">
        {dietSections.map((section) => (
          <div 
            key={section.id}
            className="bg-neutral-900/90 rounded-2xl p-4 shadow-xs border border-neutral-800 space-y-3"
          >
            {/* Meal Header - Centered & Professional */}
            <div className="text-center border-b border-neutral-800 pb-3">
              <h3 className="text-base font-black text-white">{section.titleAr} ({section.title})</h3>
              <span className="text-xs text-neutral-400 font-medium block mt-0.5">
                {section.foods.length} عناصر · {section.totalCalories} سعر حراري
              </span>
            </div>

            {/* Note badge if present */}
            {section.note && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{section.note}</span>
              </div>
            )}

            {/* Food items inside this meal */}
            <div className="space-y-2">
              {section.foods.map((food: any) => {
                const isChecked = !!checkedMealIds[food.id];
                const adjustment = gramAdjustments[food.id] || 0;
                const currentGrams = (food.grams || 100) + adjustment;
                const ratio = food.grams ? currentGrams / food.grams : 1;
                const itemCalories = Math.round(food.calories * ratio);

                return (
                  <div 
                    key={food.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isChecked 
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {/* Left: Quick Checkmark completion & Swap trigger */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCheck({ ...food, calories: itemCalories });
                        }}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/30' 
                            : 'bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-emerald-400 hover:border-emerald-500'
                        }`}
                        title={isChecked ? 'تم تناول الوجبة (اضغط للإلغاء)' : 'تسجيل تناول هذا الصنف'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSwapModalFood({ 
                            sectionId: section.id, 
                            foodId: food.id, 
                            food: food.name, 
                            calories: itemCalories, 
                            cat: section.category || 'protein'
                          });
                        }}
                        className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-750 text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/50 flex items-center justify-center transition-colors cursor-pointer"
                        title="استبدال هذا الصنف ببديل متكافئ"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      {/* Interactive Gram Scaler */}
                      {isScaleModeOpen && (
                        <div 
                          className="flex items-center gap-1 bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded-lg shrink-0 ml-1" 
                          onClick={e => e.stopPropagation()}
                        >
                          <button 
                            onClick={() => handleAdjustGrams(food.id, -25)}
                            className="text-xs font-black text-rose-400 hover:text-rose-300 w-5 h-5 flex items-center justify-center rounded bg-neutral-800 cursor-pointer"
                            title="إنقاص 25 غرام"
                          >
                            -
                          </button>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 min-w-8 text-center">
                            {currentGrams}g
                          </span>
                          <button 
                            onClick={() => handleAdjustGrams(food.id, 25)}
                            className="text-xs font-black text-emerald-400 hover:text-emerald-300 w-5 h-5 flex items-center justify-center rounded bg-neutral-800 cursor-pointer"
                            title="زيادة 25 غرام"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right: Click to open full read-only macro file */}
                    <div 
                      onClick={() => setSelectedFoodForDetail({ ...food, calories: itemCalories, grams: currentGrams })}
                      className="flex items-center gap-3 mr-auto text-right cursor-pointer flex-1 justify-end hover:opacity-90 transition-opacity"
                      title="اضغط لعرض الماكروز والسعرات والملف الكامل للصنف"
                    >
                      <div>
                        <div className="flex items-center justify-end gap-1.5">
                          {food.grams && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                              {currentGrams}غ
                            </span>
                          )}
                          <h4 className={`text-xs font-bold ${isChecked ? 'line-through text-neutral-500' : 'text-white'}`}>
                            {food.name}
                          </h4>
                        </div>
                        <span className="text-[10px] text-neutral-400 block mt-0.5 font-medium">
                          {food.portion} · <strong className="text-emerald-400 font-mono">{itemCalories}</strong> سعر حراري
                        </span>
                      </div>

                      {/* Food Thumbnail with zero-broken-image fallback */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                        <img 
                          src={food.image} 
                          alt={food.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* Calories & Macros Overview Banner - Moved after last meal (Request 9) */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-850 rounded-2xl p-4 text-white shadow-md border border-neutral-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-neutral-400 block mb-0.5">
            {activeTrainee.customDietPlan?.planType === 'carb_cycling'
              ? `السعرات (${carbDayType === 'high' ? 'كارب عالي' : 'كارب منخفض'})`
              : 'الهدف اليومي بالسعرات'}
          </span>
          <span className="text-xl font-black text-emerald-400 font-mono">
            {currentMacros.calories} <span className="text-xs font-bold text-white">سعرة</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-left font-mono">
          <div>
            <span className="text-[10px] text-neutral-400 block mb-0.5">بروتين</span>
            <span className="text-base font-black text-white">
              {currentMacros.protein}<span className="text-[10px] font-bold text-emerald-400">g</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block mb-0.5">كارب</span>
            <span className="text-base font-black text-amber-400">
              {currentMacros.carbs}<span className="text-[10px] font-bold text-white">g</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block mb-0.5">دهون</span>
            <span className="text-base font-black text-neutral-300">
              {currentMacros.fat}<span className="text-[10px] font-bold text-neutral-400">g</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Food Lens Action Banner - Compact & positioned after last meal (Request 9) */}
      <div 
        onClick={() => setIsFoodLoggerOpen(true)}
        className="bg-neutral-900/90 p-3 rounded-2xl border border-emerald-500/30 flex items-center justify-between cursor-pointer hover:border-emerald-500/60 transition-all shadow-sm group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500 text-neutral-950 text-[9px] font-black">AI Lens</span>
              <h4 className="text-xs font-black text-white">تصوير الوجبة وحساب الماكروز</h4>
            </div>
            <p className="text-[10px] text-neutral-400">صور طبقك لحساب الجرامات والماكروز فورياً</p>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-neutral-800 text-emerald-400 text-[10px] font-bold group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-colors shrink-0">
          فتح الكاميرا 📷
        </div>
      </div>

      {/* Diet Plan PDF Download Card - Compact & positioned after last meal (Request 9) */}
      <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-2.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">الخطة الغذائية والماكروز المعتمدة</h4>
            <p className="text-[10px] text-neutral-400">تحميل نسخة رسمية بصيغة PDF لهاتفك</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleExportDietPdf}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[11px] transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>تحميل PDF 📄</span>
        </button>
      </div>

      {/* Read-Only Food Detail Modal */}
      {selectedFoodForDetail && (
        <FoodDetailModal
          isOpen={true}
          onClose={() => setSelectedFoodForDetail(null)}
          food={selectedFoodForDetail}
          onOpenSwap={() => {
            const currentSec = dietSections.find(s => s.foods.some(f => f.id === selectedFoodForDetail.id)) || dietSections[0];
            setSelectedFoodForDetail(null);
            setSwapModalFood({
              sectionId: currentSec.id,
              foodId: selectedFoodForDetail.id,
              food: selectedFoodForDetail.name,
              calories: selectedFoodForDetail.calories,
              cat: currentSec.category
            });
          }}
        />
      )}

      {/* Swap Alternatives Modal */}
      {swapModalFood && (
        <MealSwapModal
          isOpen={true}
          onClose={() => setSwapModalFood(null)}
          originalFood={swapModalFood.food}
          originalCalories={swapModalFood.calories}
          category={swapModalFood.cat}
          onSwap={(newName, newCal) => {
            handleApplySwap(newName, newCal);
          }}
        />
      )}

      {/* Food Logger Modal with AI Camera Scanner */}
      {isFoodLoggerOpen && (
        <FoodLoggerModal
          onClose={() => setIsFoodLoggerOpen(false)}
          initialMealType="lunch"
        />
      )}

    </div>
  );
};

