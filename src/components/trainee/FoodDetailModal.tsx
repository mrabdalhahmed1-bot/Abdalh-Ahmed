import React from 'react';
import { X, ShieldCheck, Flame, Scale, RotateCw, Sparkles, HeartPulse, Info, Check } from 'lucide-react';

interface FoodDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: {
    id: string;
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    image: string;
    biologicalValue?: string;
    digestionSpeed?: string;
    bodyBenefits?: string[];
    vitaminsList?: Array<{ name: string; amount: string }>;
    mineralsList?: Array<{ name: string; amount: string }>;
    idealTiming?: string;
  };
  onOpenSwap: () => void;
}

// Comprehensive scientific biological benefits dictionary for all natural bodybuilding foods
const FOOD_NUTRITION_KNOWLEDGE: Record<string, {
  bioValue: string;
  digestion: string;
  timing: string;
  benefits: string[];
  vitamins: Array<{ name: string; amount: string }>;
  minerals: Array<{ name: string; amount: string }>;
}> = {
  dates: {
    bioValue: 'طاقة ATP سريعة الامتصاص (15 - 20 دقيقة) بدون هبوط إنسولين مفاجئ',
    digestion: 'سريع الهضم (20 - 30 دقيقة)',
    timing: 'قبل التمرين بـ 30-45 دقيقة مع ماء لضمان الامتلاء العضلي',
    benefits: [
      'يوفر جلوكوز وسكروز نقي لإعادة شحن جليكوجين العضلات وتأخير التعب العضلي أثناء المجموعات الثقيلة.',
      'غني جداً بعنصري البوتاسيوم والمغنيسيوم لمنع التقلصات العضلية (Muscle Cramps) أثناء رفع الأوزان.',
      'يحتوي على ألياف طبيعية تبطئ تفريغ المعدة نسبياً لتوفير طاقة مستدامة طوال الحصة التدريبية.'
    ],
    vitamins: [
      { name: 'فيتامين B6', amount: '0.25 ملغ' },
      { name: 'فيتامين K', amount: '2.7 ميكروغرام' }
    ],
    minerals: [
      { name: 'بوتاسيوم (Potassium)', amount: '650 ملغ' },
      { name: 'مغنيسيوم (Magnesium)', amount: '54 ملغ' },
      { name: 'حديد (Iron)', amount: '1.2 ملغ' }
    ]
  },
  chocolate: {
    bioValue: 'معزز طبيعي لضخ أكسيد النيتريك (Nitric Oxide Vasodilator)',
    digestion: 'متوسط الهضم (45 - 60 دقيقة)',
    timing: 'مع سناك قبل التمرين لتحسين التركيز وضخ الدم',
    benefits: [
      'الفلافانول والبوليفينول يوسعان الأوعية الدموية ويزيدان تدفق الأكسجين والمغذيات للألياف العضلية (The Pump).',
      'الثيوبرومين يرفع التركيز الذهني والتوافق العضلي العصبي دون إحداث توتر أو خفقان مثل الكافيين العالي.',
      'يحسن حساسية مستقبلات الإنسولين ويقلل من هرمون الكورتيزول المسبب للهدم العضلي.'
    ],
    vitamins: [
      { name: 'فيتامين E', amount: '1.4 ملغ' },
      { name: 'فيتامين B2', amount: '0.15 ملغ' }
    ],
    minerals: [
      { name: 'حديد عضوي (Iron)', amount: '3.6 ملغ' },
      { name: 'مغنيسيوم (Magnesium)', amount: '68 ملغ' },
      { name: 'زنك (Zinc)', amount: '1.2 ملغ' }
    ]
  },
  bread: {
    bioValue: 'كربوهيدرات معقدة غنية بالنخالة (Complex Slow-Release Carbs)',
    digestion: 'متوسط إلى بطيء (2.5 - 3.5 ساعات)',
    timing: 'وجبة الإفطار أو قبل التمرين بساعتين على الأقل',
    benefits: [
      'نخالة القمح الكاملة تمنح شبعاً مستمراً وتمنع ارتفاع وهبوط سكر الدم الحاد المسبب للجوع والتخزين.',
      'فيتامينات B1 و B3 و B6 تدعم إنزيمات حرق الكارب وتحويلها لطاقة داخل الميتوكوندريا.',
      'ألياف غير ذائبة تدعم حركة الجهاز الهضمي وصحة البكتيريا النافعة (Microbiome).'
    ],
    vitamins: [
      { name: 'ثيامين (B1)', amount: '0.3 ملغ' },
      { name: 'نياسين (B3)', amount: '3.8 ملغ' },
      { name: 'حمض الفوليك (B9)', amount: '45 ميكروغرام' }
    ],
    minerals: [
      { name: 'زنك (Zinc)', amount: '1.8 ملغ' },
      { name: 'مغنيسيوم (Magnesium)', amount: '62 ملغ' },
      { name: 'حديد (Iron)', amount: '2.1 ملغ' }
    ]
  },
  eggs: {
    bioValue: '100 BV (المعيار الذهبي الأعلى في القيمة الحيوية والتوافر البروتيني)',
    digestion: 'متوسط (1.5 - 2.5 ساعة)',
    timing: 'مثالي للإفطار أو بعد التمرين لبناء الألياف',
    benefits: [
      'توفير كامل للأحماض الأمينية الأساسية التسعة بنسب مطابقة لاحتياج تخليق بروتين العضلات (MPS).',
      'الكولين (Choline) يدعم تصنيع الناقل العصبي الأسيتيل كولين المسؤول عن قوة الانقباض العضلي والتركيز.',
      'الدهون الصحية في الصفار توفر الكوليسترول الحميد وفيتامين D3 الضروري لتخليق التستوستيرون الطبيعي.'
    ],
    vitamins: [
      { name: 'فيتامين B12', amount: '1.3 ميكروغرام' },
      { name: 'فيتامين D3', amount: '2.0 ميكروغرام' },
      { name: 'فيتامين A', amount: '180 ميكروغرام' }
    ],
    minerals: [
      { name: 'سيلينيوم (Selenium)', amount: '32 ميكروغرام' },
      { name: 'فوسفور (Phosphorus)', amount: '210 ملغ' },
      { name: 'حديد (Iron)', amount: '1.9 ملغ' }
    ]
  },
  cottage: {
    bioValue: 'بروتين الكازين بطيء الامتصاص (Micellar Casein 77 BV)',
    digestion: 'بطيء ومستمر (5 - 7 ساعات)',
    timing: 'وجبة الإفطار أو قبل النوم لمنع الهدم العضلي الليلي',
    benefits: [
      'يتحلل في المعدة ببطء فائق، مما يضخ أحماضاً أمينية في مجرى الدم لساعات طويلة ويحمي الكتلة العضلية.',
      'كثافة بروتينية صافية خالية من الدهون والسكر، مثالية جداً لفترات التنشيف وخسارة الدهون العنيدة.',
      'كالسيوم وفوسفور عضوي عالي الامتصاص يقوي كثافة العظام ويدعم وظائف الانقباض العضلي السليم.'
    ],
    vitamins: [
      { name: 'فيتامين B12', amount: '0.9 ميكروغرام' },
      { name: 'فيتامين B2', amount: '0.22 ملغ' }
    ],
    minerals: [
      { name: 'كالسيوم (Calcium)', amount: '240 ملغ' },
      { name: 'فوسفور (Phosphorus)', amount: '190 ملغ' },
      { name: 'صوديوم (Sodium)', amount: '120 ملغ' }
    ]
  },
  oliveoil: {
    bioValue: 'دهون أحادية غير مشبعة مضادة للأكسدة (MUFA 100%)',
    digestion: 'بطيء (يعزز هضم الوجبة)',
    timing: 'مع السلطة أو الوجبات الرئيسية لامتصاص الفيتامينات',
    benefits: [
      'حمض الأوليك والأوليوكانثال يعملان كمضاد التهاب طبيعي يحمي أوتار ومفاصل الرياضي من الإجهاد.',
      'يحسن حساسية الإنسولين ويمنع تراكم الدهون الحشوية في منطقة البطن والخصر.',
      'ضروري جداً لامتصاص الفيتامينات الذائبة بالدهون (A, D, E, K) وإنتاج الهرمونات الستيرويدية.'
    ],
    vitamins: [
      { name: 'فيتامين E', amount: '2.1 ملغ' },
      { name: 'فيتامين K', amount: '8.4 ميكروغرام' }
    ],
    minerals: [
      { name: 'مضادات أكسدة فلافونويد', amount: 'نشطة' }
    ]
  },
  chicken: {
    bioValue: '79 BV (بروتين صافي عالي الليوسين والتخليق العضلي)',
    digestion: 'متوسط (2 - 3 ساعات)',
    timing: 'وجبة الغداء أو الوجبة الأساسية بعد التمرين',
    benefits: [
      'يحتوي على أكثر من 5.5 غرام ليوسين وBCAAs يفعل مسار mTOR مباشرة لتضخيم وإصلاح الألياف العضلية.',
      'بروتين نقي بنسبة دهون تقارب الصفر، يعطيك شبعاً عالياً جداً دون استهلاك سعرات إضافية.',
      'النياسين (B3) وفيتامين B6 يدعمان تكسير الأحماض الأمينية وتحويل البروتين إلى أنسجة عضلية صلبة.'
    ],
    vitamins: [
      { name: 'نياسين (B3)', amount: '15.2 ملغ' },
      { name: 'فيتامين B6', amount: '1.1 ملغ' },
      { name: 'كولين (Choline)', amount: '85 ملغ' }
    ],
    minerals: [
      { name: 'فوسفور (Phosphorus)', amount: '280 ملغ' },
      { name: 'بوتاسيوم (Potassium)', amount: '360 ملغ' },
      { name: 'زنك (Zinc)', amount: '1.4 ملغ' }
    ]
  },
  rice: {
    bioValue: 'جليكوجين عضلي نقي سهل الهضم (Pure Muscle Glycogen)',
    digestion: 'سريع إلى متوسط (1 - 1.5 ساعة)',
    timing: 'وجبة الغداء أو بعد التمرين مباشرة لإعادة ملء مخازن الطاقة',
    benefits: [
      'خفيف جداً على المعدة والقولون، وخالٍ تماماً من الجلوتين، مما يمنع الانتفاخ واحتباس الغازات.',
      'يعيد ملء مخازن جليكوجين الكبد والعضلات بسرعة قياسية لتكون جاهزاً للحصة التدريبية التالية بكامل القوة.',
      'مؤشر جلايسيمي معتدل للأرز البسمتي يمنحك طاقة نقية متوازنة دون خمول أو نعاس بعد الوجبة.'
    ],
    vitamins: [
      { name: 'ثيامين (B1)', amount: '0.22 ملغ' },
      { name: 'فيتامين B6', amount: '0.2 ملغ' }
    ],
    minerals: [
      { name: 'مغنيسيوم (Magnesium)', amount: '32 ملغ' },
      { name: 'فوسفور (Phosphorus)', amount: '110 ملغ' },
      { name: 'حديد (Iron)', amount: '1.5 ملغ' }
    ]
  },
  salad: {
    bioValue: 'ألياف ترطيب خلوية وإنزيمات هاضمة طبيعية',
    digestion: 'سلس مع الوجبة',
    timing: 'مع وجبة الغداء أو العشاء',
    benefits: [
      'الألياف الذائبة تبطئ امتصاص سكر الدم وتمنع ارتفاع الأنسولين الحاد، مما يوجه الكارب للعضلات بدلاً من الدهون.',
      'نسبة ترطيب تفوق 94% تعزز توازن الكهارل وتقلل من الإجهاد التأكسدي بعد رفع الأثقال.',
      'الليكوبين والبيتاكاروتين ومضادات الأكسدة تدعم حماية الأنسجة وتقوية الجهاز المناعي.'
    ],
    vitamins: [
      { name: 'فيتامين C', amount: '35 ملغ' },
      { name: 'فيتامين A', amount: '420 ميكروغرام' },
      { name: 'فيتامين K', amount: '45 ميكروغرام' }
    ],
    minerals: [
      { name: 'بوتاسيوم (Potassium)', amount: '380 ملغ' },
      { name: 'كالسيوم (Calcium)', amount: '65 ملغ' },
      { name: 'حمض الفوليك', amount: '48 ميكروغرام' }
    ]
  }
};

const resolveFoodKnowledge = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('تمر') || n.includes('بلح') || n.includes('لوز')) return FOOD_NUTRITION_KNOWLEDGE.dates;
  if (n.includes('شوكولات') || n.includes('دارك') || n.includes('كاكاو')) return FOOD_NUTRITION_KNOWLEDGE.chocolate;
  if (n.includes('خبز') || n.includes('توست') || n.includes('قمح')) return FOOD_NUTRITION_KNOWLEDGE.bread;
  if (n.includes('بيض')) return FOOD_NUTRITION_KNOWLEDGE.eggs;
  if (n.includes('قريش') || n.includes('جبن') || n.includes('زبادي')) return FOOD_NUTRITION_KNOWLEDGE.cottage;
  if (n.includes('زيت') || n.includes('زيتون')) return FOOD_NUTRITION_KNOWLEDGE.oliveoil;
  if (n.includes('دجاج') || n.includes('فراخ') || n.includes('لحم') || n.includes('سمك') || n.includes('تونة')) return FOOD_NUTRITION_KNOWLEDGE.chicken;
  if (n.includes('أرز') || n.includes('رز') || n.includes('بسمتي') || n.includes('بطاطس') || n.includes('شوفان')) return FOOD_NUTRITION_KNOWLEDGE.rice;
  return FOOD_NUTRITION_KNOWLEDGE.salad;
};

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  isOpen,
  onClose,
  food,
  onOpenSwap
}) => {
  if (!isOpen) return null;

  // Resolve scientific profile for this exact food
  const knowledge = resolveFoodKnowledge(food.name);
  const bioValue = food.biologicalValue || knowledge.bioValue;
  const digestion = food.digestionSpeed || knowledge.digestion;
  const timing = food.idealTiming || knowledge.timing;
  const benefits = food.bodyBenefits && food.bodyBenefits.length > 0 ? food.bodyBenefits : knowledge.benefits;
  const vitamins = food.vitaminsList && food.vitaminsList.length > 0 ? food.vitaminsList : knowledge.vitamins;
  const minerals = food.mineralsList && food.mineralsList.length > 0 ? food.mineralsList : knowledge.minerals;

  // Approximate default macros if not fully provided
  const carbs = food.carbs !== undefined ? food.carbs : Math.max(0, Math.round((food.calories - (food.protein * 4)) / 4 * 0.7));
  const fat = food.fat !== undefined ? food.fat : Math.max(1, Math.round((food.calories - (food.protein * 4) - (carbs * 4)) / 9));
  const fiber = food.fiber !== undefined ? food.fiber : 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-6 animate-in fade-in zoom-in-95">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">الملف الغذائي المعتمد للصنف</h3>
              <span className="text-[10px] text-neutral-400">للقراءة والاطلاع فقط · غير قابل للتعديل</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Food Image Banner */}
        <div className="relative w-full h-44 bg-neutral-950 overflow-hidden border-b border-neutral-800">
          <img 
            src={food.image} 
            alt={food.name} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
          
          <div className="absolute bottom-3 right-4 left-4 flex items-end justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white drop-shadow-md">
                {food.name}
              </h2>
              <span className="text-xs text-emerald-300 font-medium drop-shadow-sm">
                الحصة المقررة: {food.portion}
              </span>
            </div>
            <div className="bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-700 text-left font-mono">
              <span className="text-xs text-neutral-400 block text-right">السعرات</span>
              <span className="text-base font-black text-emerald-400">{food.calories} <span className="text-[10px] text-white">Cal</span></span>
            </div>
          </div>
        </div>

        {/* Nutritional Breakdown Cards */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* Read-Only Notice Badge */}
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-300">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] leading-relaxed">
              هذا الصنف محدد بدقة ضمن خطتك بواسطة <strong className="text-white">الكوتش عبدالله قاسم</strong> لتحقيق هدفك البدني، وبيانات الماكروز للقراءة فقط لضمان دقة النتائج.
            </span>
          </div>

          {/* Macronutrients Grid */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-sans">بروتين</span>
              <span className="text-sm font-black text-emerald-400">{food.protein}g</span>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-sans">كارب</span>
              <span className="text-sm font-black text-amber-400">{carbs}g</span>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-sans">دهون</span>
              <span className="text-sm font-black text-cyan-400">{fat}g</span>
            </div>
            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-sans">ألياف</span>
              <span className="text-sm font-black text-purple-400">{fiber}g</span>
            </div>
          </div>

          {/* Biological Value & Absorption Speed */}
          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>القيمة الحيوية وسرعة الامتصاص:</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                معتمد علمياً
              </span>
            </div>
            <p className="text-xs text-emerald-300 font-medium leading-relaxed bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl">
              {bioValue}
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-850">
                <span className="text-neutral-400 block text-[10px]">معدل الهضم:</span>
                <span className="text-white font-medium">{digestion}</span>
              </div>
              <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-850">
                <span className="text-neutral-400 block text-[10px]">التوقيت الرياضي المفضل:</span>
                <span className="text-white font-medium">{timing}</span>
              </div>
            </div>
          </div>

          {/* Specific Bodily & Muscle Benefits */}
          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              <span>فوائد هذا الصنف للجسم والبناء العضلي:</span>
            </h4>
            <ul className="space-y-2 text-neutral-300 text-xs pr-1">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Micronutrients: Vitamins & Minerals */}
          <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 space-y-2.5 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>الفيتامينات والمعادن الدقيقة للصنف:</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="space-y-1 bg-neutral-900/70 p-2.5 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-emerald-400 font-bold block">الفيتامينات:</span>
                {vitamins.map((v, i) => (
                  <div key={i} className="flex justify-between text-neutral-300">
                    <span>{v.name}</span>
                    <span className="font-mono text-white">{v.amount}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1 bg-neutral-900/70 p-2.5 rounded-xl border border-neutral-850">
                <span className="text-[10px] text-sky-400 font-bold block">المعادن الأساسية:</span>
                {minerals.map((m, i) => (
                  <div key={i} className="flex justify-between text-neutral-300">
                    <span>{m.name}</span>
                    <span className="font-mono text-white">{m.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action: Swap this Food */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenSwap();
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>استبدال هذا الصنف ببديل متكافئ الماكروز 🔄</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
