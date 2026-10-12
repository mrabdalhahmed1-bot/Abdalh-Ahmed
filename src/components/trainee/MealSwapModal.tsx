import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { X, RefreshCw, Check, ArrowRight, MessageSquare, Send, Sparkles, AlertCircle } from 'lucide-react';

interface MealSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalFood: string;
  originalCalories: number;
  category?: string;
  onSwap: (newFoodName: string, newCalories: number) => void;
}

// Macro-matched alternatives (كارب بكارب، بروتين ببروتين، دهون بدهون)
const MACRO_ALTERNATIVES = {
  carbs: [
    { name: 'بطاطس مسلوقة أو مشوية', portion: '220 غرام', calories: 185, carbs: 40, protein: 4, note: 'كارب معقد عالي الشبع وغني بالبوتاسيوم' },
    { name: 'شوفان حبة كاملة', portion: '60 غرام', calories: 230, carbs: 40, protein: 8, note: 'كارب معقد غني بالألياف والبيتاجلوكان' },
    { name: 'بطاطا حلوة مشوية', portion: '200 غرام', calories: 180, carbs: 41, protein: 3, note: 'مؤشر جلايسيمي منخفض وغنية بفيتامين A' },
    { name: 'أرز بسمتي مسلوق', portion: '150 غرام (5 ملاعق كبيرة)', calories: 195, carbs: 44, protein: 4, note: 'هضم سريع ومثالي قبل وبعد التمرين' },
    { name: 'خبز بلدي قمح كامل', portion: 'رغيف بلدي (80غ)', calories: 210, carbs: 42, protein: 7, note: 'حبوب كاملة غنية بالنخالة والطاقة المستدامة' },
    { name: 'توست أسمر حبوب كاملة', portion: 'شريحتان (60غ)', calories: 160, carbs: 30, protein: 6, note: 'خفيف ومناسب للفطور والعشاء' }
  ],
  protein: [
    { name: 'صدور دجاج مشوية متبلة', portion: '180 غرام', calories: 290, carbs: 0, protein: 55, note: 'بروتين صافي عالي الجودة للبناء العضلي' },
    { name: 'تونة معلبة مصفاة بالماء', portion: 'علبة (150غ)', calories: 160, carbs: 0, protein: 36, note: 'سريعة التحضير وخالية من الدهون' },
    { name: 'جبنة قريش طبيعية خفيفة', portion: '180 غرام', calories: 170, carbs: 6, protein: 24, note: 'بروتين كازين بطيء الامتصاص للاستشفاء' },
    { name: 'بياض بيض + بيضة كاملة', portion: '4 بياض + 1 كاملة', calories: 155, carbs: 1, protein: 22, note: 'قيمة حيوية مثالية للأحماض الأمينية' },
    { name: 'سمك فيليه مشوي', portion: '180 غرام', calories: 210, carbs: 0, protein: 40, note: 'سهل الهضم وغني بالأوميغا 3' },
    { name: 'سكوب واي بروتين آيزوليت', portion: '30 غرام (1 سكوب)', calories: 120, carbs: 1, protein: 26, note: 'سريع الامتصاص بعد التمرين مباشرة' }
  ],
  fats: [
    { name: 'زيت زيتون بكر ممتاز', portion: '5 مل (ملعقة صغيرة)', calories: 45, carbs: 0, protein: 0, note: 'دهون أحادية غير مشبعة لصحة القلب' },
    { name: 'أفوكادو طازج', portion: '50 غرام (ربع حبة)', calories: 80, carbs: 4, protein: 1, note: 'دهون صحية وألياف بوتاسيوم طبيعية' },
    { name: 'لوز نيء غير محمص', portion: '15 غرام (10-12 حبة)', calories: 90, carbs: 3, protein: 3, note: 'غني بفيتامين E ومضادات الأكسدة' },
    { name: 'زبدة فول سوداني طبيعية 100%', portion: '15 غرام (ملعقة طعام)', calories: 95, carbs: 3, protein: 4, note: 'طاقة ودهون مفيدة بدون سكر مضاف' }
  ],
  veggies: [
    { name: 'سلطة خضراء (خيار وخس وجرجير)', portion: '150 غرام', calories: 25, carbs: 4, protein: 1, note: 'ألياف وترطيب ومعادن أساسية' },
    { name: 'طماطم طازجة مقطعة', portion: '100 غرام', calories: 18, carbs: 4, protein: 1, note: 'غنية بالليكوبين وفيتامين C' },
    { name: 'بروكلي مطهو على البخار', portion: '120 غرام', calories: 40, carbs: 6, protein: 3, note: 'غني بمضادات الأكسدة وحماية الخلايا' }
  ]
};

// Automatic detection of macro category based on food name
const detectMacroCategory = (foodName: string, fallbackCat?: string): 'carbs' | 'protein' | 'fats' | 'veggies' => {
  const text = foodName.toLowerCase();
  if (text.includes('أرز') || text.includes('رز') || text.includes('بطاطس') || text.includes('بطاطا') || 
      text.includes('شوفان') || text.includes('خبز') || text.includes('توست') || text.includes('مكرونة')) {
    return 'carbs';
  }
  if (text.includes('دجاج') || text.includes('لحم') || text.includes('تونة') || text.includes('تونا') || 
      text.includes('سلمون') || text.includes('سمك') || text.includes('بيض') || text.includes('جبن') || 
      text.includes('بروتين') || text.includes('قريش')) {
    return 'protein';
  }
  if (text.includes('زيت') || text.includes('أفوكادو') || text.includes('مكسرات') || text.includes('لوز') || text.includes('فول سوداني')) {
    return 'fats';
  }
  if (text.includes('طماطم') || text.includes('سلطة') || text.includes('خضار') || text.includes('خيار') || text.includes('بروكلي')) {
    return 'veggies';
  }
  if (fallbackCat === 'carbs' || fallbackCat === 'protein' || fallbackCat === 'fats') {
    return fallbackCat as any;
  }
  return 'carbs';
};

export const MealSwapModal: React.FC<MealSwapModalProps> = ({
  isOpen,
  onClose,
  originalFood,
  originalCalories,
  category,
  onSwap
}) => {
  const { activeTrainee, sendMessage, logMealSwap, triggerCheer } = useFitness();
  const [activeTab, setActiveTab] = useState<'available' | 'custom'>('available');
  const [selectedAlternative, setSelectedAlternative] = useState<any | null>(null);
  const [swapReason, setSwapReason] = useState('');
  const [customFoodName, setCustomFoodName] = useState('');
  const [customCalories, setCustomCalories] = useState(originalCalories);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  if (!isOpen) return null;

  const macroType = detectMacroCategory(originalFood, category);
  const alternativesList = MACRO_ALTERNATIVES[macroType] || MACRO_ALTERNATIVES.carbs;

  const macroLabels = {
    carbs: 'مجموعة الكاربوهيدرات (كارب بكارب متكافئ)',
    protein: 'مجموعة البروتين (بروتين ببروتين متكافئ)',
    fats: 'مجموعة الدهون الصحية (دهون بدهون متكافئة)',
    veggies: 'مجموعة الخضار والألياف'
  };

  const handleSubmitSwap = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    let chosenName = '';
    let chosenCalories = originalCalories;

    if (activeTab === 'available') {
      if (!selectedAlternative) {
        alert('يرجى اختيار أحد الأصناف البديلة المتاحة أولاً');
        setIsSubmitting(false);
        return;
      }
      chosenName = `${selectedAlternative.name} (${selectedAlternative.portion})`;
      chosenCalories = selectedAlternative.calories;

      // 1. Direct Swap without returning to Coach as requested:
      // "في حالة ان الصنف موجود في خانة التبديلات يتم تغييرها دون الرجوع للمدرب"
      onSwap(chosenName, chosenCalories);
      logMealSwap(activeTrainee.id, originalFood, chosenName, 'تبديل فوري معتمد من قائمة البدائل');
      triggerCheer('تم التبديل الفوري بنجاح 🔥🔥');
      setSubmissionMessage('تم استبدال الصنف بنجاح وبشكل فوري دون الحاجة للرجوع للمدرب ✅');
    } else {
      if (!customFoodName.trim()) {
        alert('يرجى كتابة اسم الصنف البديل المطلوب');
        setIsSubmitting(false);
        return;
      }
      chosenName = customFoodName.trim();
      chosenCalories = customCalories;

      const finalReason = swapReason.trim() || 'الصنف غير متاح حالياً بالمنزل وأرغب ببديل مخصص';

      // 2. Custom Item NOT in the presets: Send message to coach with reason as requested:
      // "لو اراد صنف اخر او يبدل الصنف باخر غير موجود في الاختيارات يتم ارسال رساله للمدرب"
      sendMessage(
        activeTrainee.id,
        `🔄 طلب استبدال صنف غير موجود في الخيارات:
- الصنف الأصلي المقترح: ${originalFood} (${originalCalories} سعرة)
- الصنف المخصص المطلوب: ${chosenName} (${chosenCalories} سعرة)
- سبب رغبة المتدرب في التبديل: "${finalReason}"`
      );

      onSwap(chosenName, chosenCalories);
      logMealSwap(activeTrainee.id, originalFood, chosenName, finalReason);
      triggerCheer('تم إرسال الطلب للمدرب 🔥🔥');
      setSubmissionMessage('تم إرسال رسالة فورية للكوتش عبدالله قاسم بالصنف المطلوب مع ذكر السبب 💬');
    }

    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsSubmitting(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">تبديل صنف الطعام بنفس الماكرز</h3>
              <p className="text-[11px] text-emerald-400 font-medium">
                {macroLabels[macroType]}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Food Banner */}
        <div className="p-3.5 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between text-xs px-5">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">الصنف الحالي:</span>
            <strong className="text-white font-bold">{originalFood}</strong>
          </div>
          <span className="text-emerald-400 font-mono font-bold bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
            {originalCalories} سعرة
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-2 bg-neutral-950 gap-2 border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'available'
                ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/40 shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            البدائل المقاربة لنفس الماكرز ✓
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/40 shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            اقتراح صنف آخر وكتابة السبب
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitSwap} className="p-4 sm:p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {activeTab === 'available' ? (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-neutral-300 block">
                اختر البديل المفضل لديك (محسوب بنفس نسبة الماكرز والسعرات):
              </span>

              <div className="space-y-2">
                {alternativesList.map((item, idx) => {
                  const isSelected = selectedAlternative?.name === item.name;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedAlternative(item)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-500/10' 
                          : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-emerald-500 border-emerald-500 text-neutral-950 font-black' : 'border-neutral-600'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        </div>
                        <p className="text-[11px] text-neutral-400 pr-6">
                          الكمية: <strong className="text-neutral-200">{item.portion}</strong> · {item.note}
                        </p>
                      </div>

                      <div className="text-left font-mono shrink-0">
                        <span className="text-xs font-black text-emerald-400 block">{item.calories} Cal</span>
                        <span className="text-[10px] text-neutral-400">
                          {item.protein}P · {item.carbs}C
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  اسم الصنف البديل المقترح:
                </label>
                <input
                  type="text"
                  required
                  value={customFoodName}
                  onChange={(e) => setCustomFoodName(e.target.value)}
                  placeholder="مثال: بطاطس مسلوقة بدلاً من الأرز أو بيض بدلاً من الجبن"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  السعرات التقريبية المقابلة:
                </label>
                <input
                  type="number"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Reason Field */}
          <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
            <label className="text-xs font-black text-white flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {activeTab === 'available'
                  ? 'سبب التبديل (اختياري - يتم التبديل فوراً دون الرجوع للمدرب):'
                  : 'سبب طلب استبدال الصنف (يتم إرساله للمدرب في المحادثة) *:'}
              </span>
            </label>
            <textarea
              required={activeTab === 'custom'}
              rows={2}
              value={swapReason}
              onChange={(e) => setSwapReason(e.target.value)}
              placeholder={activeTab === 'available'
                ? 'اختياري: يمكنك كتابة سبب التبديل أو تركه فارغاً والتبديل فوراً...'
                : 'اكتب سبب رغبتك بالاستبدال بالصنف المخصص (مثال: غير متوفر حالياً بالمنزل / أتناول وجبتي بالخارج)...'}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none"
            />
            <span className="text-[10px] text-neutral-400 block">
              {activeTab === 'available'
                ? '⚡ الأصناف الموجودة في قائمة التبديلات يتم تبديلها فوراً دون الحاجة لموافقة المدرب.'
                : '💬 سيصل إشعار ورسالة مباشرة إلى كوتش عبدالله قاسم في المحادثة مع سبب التبديل.'}
            </span>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            {isSubmittedSuccess ? (
              <div className="w-full py-3 bg-emerald-500 text-neutral-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{submissionMessage || 'تم تحديث جدولك بنجاح!'}</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs rounded-2xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {activeTab === 'available' ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>تأكيد استبدال الصنف فوراً (دون الرجوع للمدرب) ⚡</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال طلب الاستبدال للمدرب مع السبب 💬</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
