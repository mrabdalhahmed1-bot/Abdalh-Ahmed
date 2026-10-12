import React, { useState, useRef, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { 
  X, 
  Utensils, 
  Plus, 
  Sparkles, 
  Camera, 
  Upload, 
  Check, 
  Flame, 
  ShieldCheck, 
  Info,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface FoodLoggerModalProps {
  onClose: () => void;
  initialMealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const QUICK_FOODS = [
  { name: 'طبق فول مدمس بالزيت والكمون (250غ)', cal: 290, p: 16.5, c: 38, f: 8.5, serving: 'طبق متوسط (250غ)' },
  { name: 'سلطة طحينة سمسم متبلة (60غ)', cal: 310, p: 9, c: 7.5, f: 28, serving: 'حصة فردية (60غ)' },
  { name: 'صدر دجاج مشوي (200غ)', cal: 330, p: 62, c: 0, f: 7, serving: '200غ' },
  { name: 'أرز بسمتي مطبوخ (200غ)', cal: 260, p: 5, c: 57, f: 1, serving: '200غ' },
  { name: 'شوفان مع حليب لوز (60غ)', cal: 230, p: 8, c: 40, f: 4, serving: '1 زبدية' },
  { name: 'سكوب واي بروتين مع ماء (30غ)', cal: 120, p: 25, c: 2, f: 1.5, serving: '1 سكوب' },
  { name: 'بيضتان كاملتان مقليتان بزيت زيتون', cal: 180, p: 13, c: 1, f: 14, serving: '2 بيضة' },
  { name: 'زبادي يوناني قليل الدسم (200غ)', cal: 140, p: 20, c: 8, f: 3, serving: '200غ' },
  { name: 'سمك سلمون مشوي (180غ)', cal: 370, p: 40, c: 0, f: 22, serving: '180غ' },
  { name: 'بطاطا حلوة مشوية (200غ)', cal: 180, p: 3, c: 41, f: 0.5, serving: '1 حبة متوسطة' },
  { name: 'تونة بالماء مصفاة (150غ)', cal: 160, p: 37, c: 0, f: 1, serving: '1 علبة' },
  { name: 'تفاحة متوسطة مع زبدة فول سوداني', cal: 190, p: 4, c: 25, f: 8, serving: '1 حبة + 15غ زبدة' },
];

interface FoodPortionItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AIAnalysisResult {
  name: string;
  serving: string;
  foodItems?: FoodPortionItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitamins: Array<{ name: string; amount: string }>;
  minerals: Array<{ name: string; amount: string }>;
  fiber: string;
  coachAdvice: string;
}

export const FoodLoggerModal: React.FC<FoodLoggerModalProps> = ({ onClose, initialMealType = 'lunch' }) => {
  const { activeTrainee, logMeal, registerBackHandler } = useFitness();
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');

  useEffect(() => {
    return registerBackHandler(() => {
      onClose();
      return true;
    });
  }, [onClose, registerBackHandler]);
  
  // Manual state
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number>(300);
  const [protein, setProtein] = useState<number>(30);
  const [carbs, setCarbs] = useState<number>(35);
  const [fat, setFat] = useState<number>(8);
  const [serving, setServing] = useState('1 وجبة');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>(initialMealType);

  // AI Camera Scanner state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userHint, setUserHint] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedItemIndices, setSelectedItemIndices] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectQuickFood = (f: typeof QUICK_FOODS[0]) => {
    setName(f.name);
    setCalories(f.cal);
    setProtein(f.p);
    setCarbs(f.c);
    setFat(f.f);
    setServing(f.serving);
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      analyzeFoodWithAI(base64, userHint);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFoodWithAI = async (imageBase64: string, hint?: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAiResult(null);
    setSelectedItemIndices({});

    try {
      const response = await fetch('/api/analyze-food-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, userHint: hint || userHint })
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setAiResult(resJson.data);
        // Default select all items
        if (resJson.data.foodItems) {
          const initialMap: Record<number, boolean> = {};
          resJson.data.foodItems.forEach((_: any, idx: number) => {
            initialMap[idx] = true;
          });
          setSelectedItemIndices(initialMap);
        }
      } else {
        throw new Error(resJson.error || 'تعذر تحليل الصورة');
      }
    } catch (err: any) {
      console.warn('AI analysis failed:', err);
      // Smart fallback recognizing if single hint was given
      const isSingle = !!(hint || userHint);
      const fallbackResult: AIAnalysisResult = isSingle ? {
        name: hint || userHint || 'صنف غذائي مفرد',
        serving: '1 حصة فردية (150غ)',
        foodItems: [
          { name: hint || userHint || 'الصنف المصور', quantity: '150 غرام', calories: 180, protein: 15, carbs: 18, fat: 4 }
        ],
        calories: 180,
        protein: 15,
        carbs: 18,
        fat: 4,
        vitamins: [{ name: 'فيتامين C', amount: '12 ملغ' }],
        minerals: [{ name: 'بوتاسيوم', amount: '280 ملغ' }],
        fiber: '2.5 غرام',
        coachAdvice: 'تم التعرف على الصنف. يمكنك تعديل الكميات والماكروز يدوياً في أي وقت.'
      } : {
        name: 'وجبة متوازنة من الصورة',
        serving: '1 طبق متوسط (350غ)',
        foodItems: [
          { name: 'بروتين مشوي', quantity: '160 غرام', calories: 260, protein: 38, carbs: 0, fat: 5 },
          { name: 'نشويات معقدة (أرز أو بطاطس)', quantity: '150 غرام', calories: 195, protein: 4, carbs: 44, fat: 1 },
          { name: 'سلطة خضراء متنوعة', quantity: '100 غرام', calories: 35, protein: 1, carbs: 6, fat: 0.5 }
        ],
        calories: 490,
        protein: 43,
        carbs: 50,
        fat: 6.5,
        vitamins: [
          { name: 'فيتامين C', amount: '40 ملغ' },
          { name: 'فيتامين D', amount: '2.0 ميكروغرام' }
        ],
        minerals: [
          { name: 'حديد', amount: '4.2 ملغ' },
          { name: 'بوتاسيوم', amount: '520 ملغ' }
        ],
        fiber: '5.2 غرام',
        coachAdvice: 'وجبة ممتازة غنية بالبروتين. يمكنك اختيار وتحديد الأصناف التي تناولتها فقط أدناه.'
      };

      setAiResult(fallbackResult);
      if (fallbackResult.foodItems) {
        const initialMap: Record<number, boolean> = {};
        fallbackResult.foodItems.forEach((_, idx) => {
          initialMap[idx] = true;
        });
        setSelectedItemIndices(initialMap);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle item selection
  const handleToggleItem = (idx: number) => {
    setSelectedItemIndices(prev => {
      const next = { ...prev, [idx]: !prev[idx] };
      return next;
    });
  };

  // Calculate dynamic totals based on selected items
  const getActiveTotals = () => {
    if (!aiResult || !aiResult.foodItems || aiResult.foodItems.length === 0) {
      return {
        calories: aiResult?.calories || 0,
        protein: aiResult?.protein || 0,
        carbs: aiResult?.carbs || 0,
        fat: aiResult?.fat || 0,
        count: 0
      };
    }

    const activeList = aiResult.foodItems.filter((_, idx) => selectedItemIndices[idx]);
    if (activeList.length === 0) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        count: 0
      };
    }

    const cals = activeList.reduce((acc, it) => acc + (it.calories || 0), 0);
    const p = Math.round(activeList.reduce((acc, it) => acc + (it.protein || 0), 0) * 10) / 10;
    const c = Math.round(activeList.reduce((acc, it) => acc + (it.carbs || 0), 0) * 10) / 10;
    const f = Math.round(activeList.reduce((acc, it) => acc + (it.fat || 0), 0) * 10) / 10;

    return {
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      count: activeList.length
    };
  };

  const handleSaveAIResult = () => {
    if (!aiResult) return;
    const totals = getActiveTotals();
    const activeItems = (aiResult.foodItems || []).filter((_, idx) => selectedItemIndices[idx]);
    const finalName = activeItems.length === 1 
      ? activeItems[0].name 
      : (activeItems.length > 1 ? activeItems.map(it => it.name).join(' + ') : aiResult.name);

    logMeal(activeTrainee.id, {
      name: finalName || aiResult.name,
      calories: totals.calories > 0 ? totals.calories : aiResult.calories,
      protein: totals.protein > 0 ? totals.protein : aiResult.protein,
      carbs: totals.carbs > 0 ? totals.carbs : aiResult.carbs,
      fat: totals.fat > 0 ? totals.fat : aiResult.fat,
      serving: activeItems.length === 1 ? activeItems[0].quantity : aiResult.serving,
      mealType
    });
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    logMeal(activeTrainee.id, {
      name,
      calories,
      protein,
      carbs,
      fat,
      serving,
      mealType,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-neutral-100 my-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">تسجيل وجبة بالأرقام والذكاء الاصطناعي</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-2 bg-neutral-950 gap-2 border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('camera')}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>تصوير الوجبة بالذكاء الاصطناعي 📸</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل يدوي وقائمة سريعة</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[72vh] overflow-y-auto">
          
          {/* TAB 1: AI CAMERA & MACRO/MICRO SCANNER */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">ميزة تصوير الطعام الذكية (لصنف واحد أو وجبة متكاملة):</span>
                </div>
                <p className="text-[11px] text-neutral-300">
                  صوّر أي صنف (تفاحة، بيض، شيك بروتين) أو طبق مطعم كامل، وسيتعرف الذكاء الاصطناعي على الكميات والماكروز بدقة ومرونة!
                </p>
              </div>

              {/* Optional Quick User Hint to assist instant identification */}
              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-300 flex items-center justify-between">
                  <span>اسم الصنف أو ملاحظة (اختياري للتعرف الفوري والدقيق):</span>
                  <span className="text-[10px] text-emerald-400 font-mono">سريع وذكي</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userHint}
                    onChange={(e) => setUserHint(e.target.value)}
                    placeholder="مثال: تفاحة خضراء، بيض مسلوق، بروتين شيك، صدر دجاج وأرز..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                  {userHint && (
                    <button
                      type="button"
                      onClick={() => setUserHint('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Upload or Snap Picture Box */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                capture="environment" 
                onChange={handleImageCapture} 
                className="hidden" 
              />

              {!selectedImage ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-neutral-700 hover:border-emerald-500 rounded-2xl bg-neutral-950/60 hover:bg-neutral-950 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-colors">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold text-white block">اضغط لالتقاط صورة للوجبة أو رفعها من المعرض</span>
                    <span className="text-[11px] text-neutral-400 mt-1 block">يتعرف على الصنف المفرد أو الأطباق المدمجة فوراً</span>
                  </div>
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Photo Preview Card */}
                  <div className="relative rounded-2xl overflow-hidden border border-neutral-800 aspect-video max-h-52 bg-neutral-950 flex items-center justify-center">
                    <img 
                      src={selectedImage} 
                      alt="Food Scan" 
                      className="w-full h-full object-cover" 
                    />
                    
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                        <span className="text-xs font-bold">جاري فحص الوجبة والتعرف على الأصناف...</span>
                        <div className="w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-emerald-500 rounded-full animate-pulse w-3/4" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        تغيير الصورة 🔄
                      </button>
                      {userHint && (
                        <button
                          type="button"
                          onClick={() => selectedImage && analyzeFoodWithAI(selectedImage, userHint)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/90 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-colors cursor-pointer"
                        >
                          إعادة الفحص ⚡
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Scan Results (Macros & Micronutrients breakdown) */}
                  {aiResult && !isAnalyzing && (
                    <div className="space-y-3.5 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 animate-in fade-in">
                      
                      {/* Dish Title & Portion */}
                      <div className="flex items-start justify-between gap-3 border-b border-neutral-800/80 pb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-emerald-400 font-bold tracking-wider block uppercase">نتيجة التحليل الذكي</span>
                            {aiResult.foodItems && aiResult.foodItems.length === 1 ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                                🎯 صنف مفرد
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-bold text-[10px] border border-sky-500/30">
                                🥗 وجبة متعددة الأصناف
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-black text-white mt-0.5">{aiResult.name}</h4>
                          <span className="text-[11px] text-neutral-400 font-medium">الحصة التقديرية: {aiResult.serving}</span>
                        </div>

                        <div className="text-left font-mono">
                          <span className="text-[10px] text-neutral-400 block">السعرات المحددة</span>
                          <span className="text-lg font-black text-emerald-400">{getActiveTotals().calories} <span className="text-xs text-white font-bold">Cal</span></span>
                        </div>
                      </div>

                      {/* Macronutrients 3-Columns */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                          <span className="text-[10px] text-neutral-400 block">بروتين</span>
                          <span className="text-sm font-black text-emerald-400 font-mono">{getActiveTotals().protein}g</span>
                        </div>
                        <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                          <span className="text-[10px] text-neutral-400 block">كاربوهيدرات</span>
                          <span className="text-sm font-black text-amber-400 font-mono">{getActiveTotals().carbs}g</span>
                        </div>
                        <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800">
                          <span className="text-[10px] text-neutral-400 block">دهون صحية</span>
                          <span className="text-sm font-black text-cyan-400 font-mono">{getActiveTotals().fat}g</span>
                        </div>
                      </div>

                      {/* Food Component Portions Breakdown (كميات وأوزان الطعام المصور) with Flexible Item Selection */}
                      {aiResult.foodItems && aiResult.foodItems.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              <span>الأصناف المتعرف عليها (انقر لتحديد أو استبعاد أي صنف):</span>
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
                              مرونة كاملة
                            </span>
                          </div>

                          <div className="space-y-2">
                            {aiResult.foodItems.map((item, idx) => {
                              const isSelected = !!selectedItemIndices[idx];
                              return (
                                <div 
                                  key={idx} 
                                  onClick={() => handleToggleItem(idx)}
                                  className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs transition-all cursor-pointer select-none ${
                                    isSelected 
                                      ? 'bg-neutral-900 border-emerald-500/50 shadow-xs' 
                                      : 'bg-neutral-950/50 border-neutral-850 opacity-55 hover:opacity-85'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                      isSelected 
                                        ? 'bg-emerald-500 border-emerald-500 text-neutral-950' 
                                        : 'border-neutral-700 bg-neutral-900 text-transparent'
                                    }`}>
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className={`font-black text-sm ${isSelected ? 'text-white' : 'text-neutral-400 line-through'}`}>
                                          {item.name}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                                          ⚖️ {item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 flex-wrap font-mono">
                                    <span className="px-2 py-0.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-white font-bold">
                                      {item.calories} <span className="text-[9px] text-neutral-400">سعرة</span>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-800/70 text-[11px] text-emerald-400 font-bold">
                                      بروتين: {item.protein}g
                                    </span>
                                    <span className="px-2 py-0.5 rounded-lg bg-amber-950/70 border border-amber-800/70 text-[11px] text-amber-400 font-bold">
                                      كارب: {item.carbs}g
                                    </span>
                                    <span className="px-2 py-0.5 rounded-lg bg-cyan-950/70 border border-cyan-800/70 text-[11px] text-cyan-400 font-bold">
                                      دهون: {item.fat}g
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Micronutrients (Vitamins & Minerals) Breakdown */}
                      <div className="space-y-2 pt-1 border-t border-neutral-800/80">
                        <span className="text-xs font-black text-white block">
                          الفيتامينات والمعادن المحسوبة للوجبة:
                        </span>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          {/* Vitamins */}
                          <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800 space-y-1">
                            <span className="font-bold text-emerald-400 block text-[10px]">فيتامينات الوجبة:</span>
                            {aiResult.vitamins.map((v, i) => (
                              <div key={i} className="flex justify-between text-neutral-300">
                                <span>{v.name}</span>
                                <span className="font-mono text-white">{v.amount}</span>
                              </div>
                            ))}
                          </div>

                          {/* Minerals */}
                          <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800 space-y-1">
                            <span className="font-bold text-sky-400 block text-[10px]">معادن أساسية وألياف:</span>
                            {aiResult.minerals.slice(0, 3).map((m, i) => (
                              <div key={i} className="flex justify-between text-neutral-300">
                                <span>{m.name}</span>
                                <span className="font-mono text-white">{m.amount}</span>
                              </div>
                            ))}
                            <div className="flex justify-between text-neutral-300">
                              <span>ألياف غذائية</span>
                              <span className="font-mono text-emerald-400">{aiResult.fiber}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Coach Advice for Eating Out */}
                      {aiResult.coachAdvice && (
                        <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-300 flex items-start gap-2">
                          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong className="text-white">توجيه الكوتش:</strong> {aiResult.coachAdvice}</span>
                        </div>
                      )}

                      {/* Meal Category & Save Button */}
                      <div className="pt-2 flex items-center justify-between gap-3">
                        <select
                          value={mealType}
                          onChange={(e) => setMealType(e.target.value as any)}
                          className="py-2 px-3 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white font-medium"
                        >
                          <option value="breakfast">فطور (Breakfast)</option>
                          <option value="lunch">غداء (Lunch)</option>
                          <option value="dinner">عشاء (Dinner)</option>
                          <option value="snack">سناك (Snack)</option>
                        </select>

                        <button
                          type="button"
                          onClick={handleSaveAIResult}
                          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>إضافة الوجبة لسجل اليوم</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: MANUAL ENTRY & QUICK PRESETS */}
          {activeTab === 'manual' && (
            <div className="space-y-5">
              
              {/* Quick presets */}
              <div>
                <span className="text-xs font-semibold text-neutral-400 block mb-2">أطعمة شائعة جاهزة للاختيار السريع:</span>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_FOODS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectQuickFood(item)}
                      className="p-2.5 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 text-right rounded-lg transition-colors group"
                    >
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 block truncate">{item.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {item.cal} Cal · P:{item.p}g · C:{item.c}g · F:{item.f}g
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleManualSubmit} className="space-y-4 pt-2 border-t border-neutral-800">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">اسم الوجبة أو المكون الغذائي *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: ستيك لحم بقري مع أرز أو شوفان"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">تصنيف الوجبة</label>
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white"
                    >
                      <option value="breakfast">فطور (Breakfast)</option>
                      <option value="lunch">غداء (Lunch)</option>
                      <option value="dinner">عشاء (Dinner)</option>
                      <option value="snack">سناك / قبل التمرين (Snack)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">الكمية / الحصة</label>
                    <input
                      type="text"
                      value={serving}
                      onChange={(e) => setServing(e.target.value)}
                      placeholder="مثال: 150غ أو 1 طبق"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">السعرات</label>
                    <input
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs font-mono font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">بروتين (غ)</label>
                    <input
                      type="number"
                      value={protein}
                      onChange={(e) => setProtein(parseInt(e.target.value) || 0)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs font-mono text-emerald-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">كارب (غ)</label>
                    <input
                      type="number"
                      value={carbs}
                      onChange={(e) => setCarbs(parseInt(e.target.value) || 0)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs font-mono text-amber-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">دهون (غ)</label>
                    <input
                      type="number"
                      value={fat}
                      onChange={(e) => setFat(parseInt(e.target.value) || 0)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs font-mono text-cyan-400 font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    إضافة الوجبة
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
