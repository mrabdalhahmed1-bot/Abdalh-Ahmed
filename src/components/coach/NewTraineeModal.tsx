import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { GoalType, WorkoutProgram, MealItem } from '../../types/fitness';
import { 
  X, 
  UserPlus, 
  Sparkles, 
  Utensils, 
  Dumbbell, 
  ShieldAlert, 
  Check, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Apple
} from 'lucide-react';

interface NewTraineeModalProps {
  onClose: () => void;
}

interface GeneratedMealPlan {
  breakfast: { name: string; grams: number; cals: number; p: number; c: number; f: number; vitamins: string[] };
  lunch: { name: string; grams: number; cals: number; p: number; c: number; f: number; vitamins: string[] };
  snack: { name: string; grams: number; cals: number; p: number; c: number; f: number; vitamins: string[] };
  dinner: { name: string; grams: number; cals: number; p: number; c: number; f: number; vitamins: string[] };
  totalCals: number;
  totalP: number;
  totalC: number;
  totalF: number;
  micronutrients: Array<{ name: string; benefit: string }>;
}

export const NewTraineeModal: React.FC<NewTraineeModalProps> = ({ onClose }) => {
  const { addTrainee } = useFitness();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(27);
  const [heightCm, setHeightCm] = useState(175);
  const [startingWeightKg, setStartingWeightKg] = useState(82);
  const [targetWeightKg, setTargetWeightKg] = useState(74);
  const [goal, setGoal] = useState<GoalType>('fat_loss');
  
  // Macros state
  const [calories, setCalories] = useState(2100);
  const [protein, setProtein] = useState(175);
  const [carbs, setCarbs] = useState(200);
  const [fat, setFat] = useState(55);

  // Preferred foods input
  const [preferredFoods, setPreferredFoods] = useState('');

  // Generated meal plan state
  const [generatedMealPlan, setGeneratedMealPlan] = useState<GeneratedMealPlan | null>(null);
  const [showMealPlanDetails, setShowMealPlanDetails] = useState(true);

  // Injury & Joint Pain selection
  const [injuries, setInjuries] = useState<{
    shoulder: boolean;
    knee: boolean;
    lowerBack: boolean;
    wristElbow: boolean;
    none: boolean;
  }>({
    shoulder: false,
    knee: false,
    lowerBack: false,
    wristElbow: false,
    none: true,
  });

  // Generated Workout Program state
  const [generatedProgram, setGeneratedProgram] = useState<WorkoutProgram | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(true);

  const toggleInjury = (key: 'shoulder' | 'knee' | 'lowerBack' | 'wristElbow' | 'none') => {
    if (key === 'none') {
      setInjuries({
        shoulder: false,
        knee: false,
        lowerBack: false,
        wristElbow: false,
        none: true,
      });
    } else {
      setInjuries(prev => {
        const nextVal = !prev[key];
        const nextState = {
          ...prev,
          [key]: nextVal,
          none: false,
        };
        // If all are false, set none to true
        if (!nextState.shoulder && !nextState.knee && !nextState.lowerBack && !nextState.wristElbow) {
          nextState.none = true;
        }
        return nextState;
      });
    }
  };

  // Instant Smart Macro Calculator (Harris-Benedict equation)
  const handleAutoCalculate = () => {
    const bmr = 10 * startingWeightKg + 6.25 * heightCm - 5 * age + 5;
    const tdee = Math.round(bmr * 1.4); // moderate training factor

    if (goal === 'fat_loss') {
      const targetCal = Math.round(tdee - 450);
      const prot = Math.round(startingWeightKg * 2.2);
      const fatG = Math.round((targetCal * 0.25) / 9);
      const carbG = Math.round((targetCal - (prot * 4 + fatG * 9)) / 4);

      setCalories(targetCal);
      setProtein(prot);
      setFat(fatG);
      setCarbs(carbG);
    } else if (goal === 'muscle_gain') {
      const targetCal = Math.round(tdee + 350);
      const prot = Math.round(startingWeightKg * 2.0);
      const fatG = Math.round((targetCal * 0.25) / 9);
      const carbG = Math.round((targetCal - (prot * 4 + fatG * 9)) / 4);

      setCalories(targetCal);
      setProtein(prot);
      setFat(fatG);
      setCarbs(carbG);
    } else {
      setCalories(tdee);
      setProtein(Math.round(startingWeightKg * 2.0));
      setFat(Math.round((tdee * 0.25) / 9));
      setCarbs(Math.round((tdee - (startingWeightKg * 2 * 4 + (tdee * 0.25))) / 4));
    }
  };

  // Convert calculated macros to actual structured whole-food meals with rich vitamins & minerals
  const handleGenerateMealPlan = () => {
    const customFood = preferredFoods.trim();
    const hasCustom = customFood.length > 0;

    // Distribute calories: Breakfast 25%, Lunch 35%, Snack 15%, Dinner 25%
    const bCals = Math.round(calories * 0.25);
    const lCals = Math.round(calories * 0.35);
    const sCals = Math.round(calories * 0.15);
    const dCals = Math.round(calories * 0.25);

    const bProt = Math.round(protein * 0.25);
    const lProt = Math.round(protein * 0.40);
    const sProt = Math.round(protein * 0.15);
    const dProt = Math.round(protein * 0.20);

    const bCarb = Math.round(carbs * 0.30);
    const lCarb = Math.round(carbs * 0.40);
    const sCarb = Math.round(carbs * 0.15);
    const dCarb = Math.round(carbs * 0.15);

    const bFat = Math.round(fat * 0.25);
    const lFat = Math.round(fat * 0.35);
    const sFat = Math.round(fat * 0.15);
    const dFat = Math.round(fat * 0.25);

    // Integrate preferred foods into meal names if provided
    const breakfastName = hasCustom && (customFood.includes('شوفان') || customFood.includes('بيض') || customFood.includes('موز'))
      ? `عجة بيض بلدي مع ${customFood} وخبز حبوب كاملة وزيت زيتون بكر`
      : 'عجة 3 بيضات مع 60غ شوفان حبة كاملة وبذور الشيا والتوت';

    const lunchName = hasCustom && (customFood.includes('سالمون') || customFood.includes('دجاج') || customFood.includes('ستيك') || customFood.includes('أرز'))
      ? `طبق بروتين مخصص (${customFood}) مع أرز بسمتي أو بطاطس وخضار سوتيه`
      : 'صدور دجاج متبلة مشوية (200غ) مع أرز بسمتي مسلوق وسلطة ورقية ملونة';

    const snackName = hasCustom && (customFood.includes('تونة') || customFood.includes('مكسرات') || customFood.includes('موز'))
      ? `سناك الطاقة: زبادي يوناني غني بالبروتين مع ${customFood}`
      : 'زبادي يوناني طبيعي (170غ) مع حفنة لوز نيء وتفاحة خضراء مقطعة';

    const dinnerName = hasCustom && (customFood.includes('سالمون') || customFood.includes('تونة') || customFood.includes('جبن'))
      ? `عشاء خفيف متوازن: ${customFood} مع سلطة أفوكادو وخضار خضراء`
      : 'فيليه سالمون أو سمك مشوي مع بطاطا حلوة مهروسة وبروكلي بالليمون';

    setGeneratedMealPlan({
      breakfast: {
        name: breakfastName,
        grams: 350,
        cals: bCals,
        p: bProt,
        c: bCarb,
        f: bFat,
        vitamins: ['فيتامين B12', 'فيتامين D', 'كولين (Choline)', 'مغنيسيوم']
      },
      lunch: {
        name: lunchName,
        grams: 480,
        cals: lCals,
        p: lProt,
        c: lCarb,
        f: lFat,
        vitamins: ['فيتامين B6', 'نياسين B3', 'زنك', 'حديد هيمي (Iron)']
      },
      snack: {
        name: snackName,
        grams: 220,
        cals: sCals,
        p: sProt,
        c: sCarb,
        f: sFat,
        vitamins: ['كالسيوم', 'فيتامين C', 'فيتامين E', 'أوميغا 3']
      },
      dinner: {
        name: dinnerName,
        grams: 380,
        cals: dCals,
        p: dProt,
        c: dCarb,
        f: dFat,
        vitamins: ['فيتامين A', 'بوتاسيوم', 'أوميغا 3 DHA', 'حمض الفوليك']
      },
      totalCals: calories,
      totalP: protein,
      totalC: carbs,
      totalF: fat,
      micronutrients: [
        { name: 'فيتامين C و A', benefit: 'مضادات أكسدة قوية لتسريع استشفاء الألياف العضلية' },
        { name: 'مغنيسيوم وبوتاسيوم', benefit: 'منع الشد العضلي وتحسين جودة النوم العميق' },
        { name: 'زنك وحديد', benefit: 'دعم إنتاج هرمون التستوستيرون الطبيعي ونقل الأكسجين' },
        { name: 'فيتامين D وكالسيوم', benefit: 'كثافة العظام وقوة المفاصل والأربطة أثناء رفع الأوزان' }
      ]
    });
  };

  // Generate Modern, Varied, Injury-Adapted Training Program
  const handleGenerateWorkoutProgram = () => {
    const hasShoulder = injuries.shoulder;
    const hasKnee = injuries.knee;
    const hasLowerBack = injuries.lowerBack;
    const hasWristElbow = injuries.wristElbow;

    // Day 1: Push / Upper Focus (Adapted for Shoulder / Wrist)
    const day1Exercises = [
      hasShoulder ? {
        id: 'ex-gen-1',
        nameAr: 'Neutral-Grip Dumbbell Floor Press',
        nameEn: 'Neutral-Grip Dumbbell Floor Press',
        primaryMuscle: 'الصدر والترايسبس',
        equipment: 'Dumbbells / Mat',
        executionCues: ['قبضة محايدة تخفف الحمل 100% عن أوتار الكتف', 'ملامسة الأرض بالمرفقين تمنع التمدد المفرط للمفصل', 'دفع محكوم مع عصر الصدر'],
        sets: [
          { setNumber: 1, targetReps: '10-12', targetRpe: 7, restSeconds: 75 },
          { setNumber: 2, targetReps: '10-12', targetRpe: 8, restSeconds: 75 },
          { setNumber: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 }
        ],
        coachNotes: 'تم استبدال البنش بريس الحر بحركة الفلور بريس بالقبضة المحايدة لحماية الكتف'
      } : {
        id: 'ex-gen-1',
        nameAr: 'Barbell Flat Bench Press',
        nameEn: 'Barbell Flat Bench Press',
        primaryMuscle: 'الصدر الأوسط والعلوي',
        equipment: 'Barbell & Bench',
        executionCues: ['سحب لوحي الكتف للخلف والأسفل', 'نزول محكوم في ثانيتين للمس أسفل الصدر', 'دفع انفجاري مع ثبات الكعبين'],
        sets: [
          { setNumber: 1, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { setNumber: 2, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { setNumber: 3, targetReps: '8', targetRpe: 9, restSeconds: 120 }
        ]
      },
      hasShoulder ? {
        id: 'ex-gen-2',
        nameAr: 'Cable Low-to-High Chest Fly',
        nameEn: 'Cable Low-to-High Chest Fly',
        primaryMuscle: 'الصدر العلوي',
        equipment: 'Cable Machine',
        executionCues: ['مسار كابل سلس ومريح للمفصل', 'ثبات المرفقين مع قيادة الحركة بعصر الصدر العلوي'],
        sets: [
          { setNumber: 1, targetReps: '12-15', targetRpe: 7, restSeconds: 60 },
          { setNumber: 2, targetReps: '12-15', targetRpe: 8, restSeconds: 60 },
          { setNumber: 3, targetReps: '12', targetRpe: 8, restSeconds: 60 }
        ]
      } : {
        id: 'ex-gen-2',
        nameAr: 'Incline Dumbbell Press',
        nameEn: 'Incline Dumbbell Press',
        primaryMuscle: 'الصدر العلوي',
        equipment: 'Dumbbells',
        executionCues: ['زاوية مسند 30 درجة لتركيز الحمل', 'مسار هلالي خفيف دون صدم الأوزان', 'نزول سلبي 3 ثوان'],
        sets: [
          { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { setNumber: 2, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { setNumber: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 }
        ]
      },
      {
        id: 'ex-gen-3',
        nameAr: 'Dumbbell Lateral Raise',
        nameEn: 'Dumbbell Lateral Raise',
        primaryMuscle: 'الكتف الجانبي',
        equipment: 'Dumbbells',
        executionCues: ['رفع الدمبل بالكوع مع ميلان طفيف للأمام', 'اخفض كتفيك بعيداً عن أذنيك لعزل الرأس الجانبي'],
        sets: [
          { setNumber: 1, targetReps: '12-15', targetRpe: 8, restSeconds: 60 },
          { setNumber: 2, targetReps: '12-15', targetRpe: 8, restSeconds: 60 },
          { setNumber: 3, targetReps: '12', targetRpe: 9, restSeconds: 60 }
        ]
      },
      hasWristElbow ? {
        id: 'ex-gen-4',
        nameAr: 'Single-Arm Cable Triceps Kickback',
        nameEn: 'Single-Arm Cable Triceps Kickback',
        primaryMuscle: 'الترايسبس',
        equipment: 'Cable',
        executionCues: ['قبضة حرة مريحة لأربطة المعصم والكوع', 'تثبيت المرفق للأعلى وعصر الترايسبس'],
        sets: [
          { setNumber: 1, targetReps: '12-15', targetRpe: 7, restSeconds: 60 },
          { setNumber: 2, targetReps: '12-15', targetRpe: 8, restSeconds: 60 }
        ],
        coachNotes: 'حركة كابل بعزل لطيف على مفصل الكوع'
      } : {
        id: 'ex-gen-4',
        nameAr: 'Triceps Rope Pushdown',
        nameEn: 'Triceps Rope Pushdown',
        primaryMuscle: 'الترايسبس',
        equipment: 'Cable & Rope',
        executionCues: ['تثبيت المرفقين بجانب الأضلاع', 'فتح الحبل في الأسفل لعصر الرأس الطويل'],
        sets: [
          { setNumber: 1, targetReps: '12', targetRpe: 8, restSeconds: 60 },
          { setNumber: 2, targetReps: '12', targetRpe: 8, restSeconds: 60 },
          { setNumber: 3, targetReps: '10', targetRpe: 8, restSeconds: 60 }
        ]
      }
    ];

    // Day 2: Pull / Back Focus (Adapted for Lower Back / Biceps)
    const day2Exercises = [
      {
        id: 'ex-gen-5',
        nameAr: 'Wide-Grip Lat Pulldown',
        nameEn: 'Wide-Grip Lat Pulldown',
        primaryMuscle: 'عضلات الظهر العريضة اللاتس',
        equipment: 'Cable Machine',
        executionCues: ['إسقاط لوحي الكتف لأسفل قبل السحب', 'سحب البار بالأكواع نحو الصدر العلوي', 'تمدد كامل في القمة'],
        sets: [
          { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 75 },
          { setNumber: 2, targetReps: '10-12', targetRpe: 8, restSeconds: 75 },
          { setNumber: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 }
        ]
      },
      hasLowerBack ? {
        id: 'ex-gen-6',
        nameAr: 'Chest-Supported Incline Dumbbell Row',
        nameEn: 'Chest-Supported Incline Dumbbell Row',
        primaryMuscle: 'الظهر الأوسط والترابيس',
        equipment: 'Incline Bench & Dumbbells',
        executionCues: ['استناد الصدر بالكامل على المسند لعزل أسفل الظهر 100%', 'سحب المرفقين للخلف وعصر لوحي الكتف'],
        sets: [
          { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 75 },
          { setNumber: 2, targetReps: '10-12', targetRpe: 8, restSeconds: 75 },
          { setNumber: 3, targetReps: '10', targetRpe: 8, restSeconds: 75 }
        ],
        coachNotes: 'تم الاستبدال لحماية الفقرات القطنية وأسفل الظهر'
      } : {
        id: 'ex-gen-6',
        nameAr: 'Barbell Bent-Over Row',
        nameEn: 'Barbell Bent-Over Row',
        primaryMuscle: 'الظهر الأوسط واللاتس',
        equipment: 'Barbell',
        executionCues: ['انحناء الجذع 45 درجة مع ظهر مستقيم', 'سحب البار باتجاه السرة بالمرفقين', 'ثبات الرقبة والبطن'],
        sets: [
          { setNumber: 1, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { setNumber: 2, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { setNumber: 3, targetReps: '8', targetRpe: 9, restSeconds: 90 }
        ]
      },
      {
        id: 'ex-gen-7',
        nameAr: 'Face Pulls with External Rotation',
        nameEn: 'Face Pulls with External Rotation',
        primaryMuscle: 'الكتف الخلفي والكفة المدورة',
        equipment: 'Cable & Rope',
        executionCues: ['سحب الحبل لمستوى الجبهة مع فتح المعصمين للخارج', 'تقوية الكفة المدورة ومنع آلام الكتف'],
        sets: [
          { setNumber: 1, targetReps: '15', targetRpe: 7, restSeconds: 60 },
          { setNumber: 2, targetReps: '15', targetRpe: 8, restSeconds: 60 }
        ]
      },
      hasWristElbow ? {
        id: 'ex-gen-8',
        nameAr: 'Hammer Rope Cable Curl',
        nameEn: 'Hammer Rope Cable Curl',
        primaryMuscle: 'البايسبس والعضدية',
        equipment: 'Cable & Rope',
        executionCues: ['قبضة محايدة تلغي إجهاد مفصل الرسغ والساعد', 'ثبات المرفقين وعصر العضدية Brachialis'],
        sets: [
          { setNumber: 1, targetReps: '12', targetRpe: 7, restSeconds: 60 },
          { setNumber: 2, targetReps: '12', targetRpe: 8, restSeconds: 60 }
        ]
      } : {
        id: 'ex-gen-8',
        nameAr: 'Incline Dumbbell Biceps Curl',
        nameEn: 'Incline Dumbbell Biceps Curl',
        primaryMuscle: 'البايسبس (الرأس الطويل)',
        equipment: 'Incline Bench & Dumbbells',
        executionCues: ['تمدد كامل في زاوية المقعد المائل', 'دوران خارجي للرسغ وعصر قمة البايسبس'],
        sets: [
          { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 60 },
          { setNumber: 2, targetReps: '10-12', targetRpe: 8, restSeconds: 60 },
          { setNumber: 3, targetReps: '10', targetRpe: 8, restSeconds: 60 }
        ]
      }
    ];

    // Day 3: Legs & Core (Adapted for Knee / Lower Back)
    const day3Exercises = [
      hasKnee ? {
        id: 'ex-gen-9',
        nameAr: 'Romanian Deadlift (RDL)',
        nameEn: 'Romanian Deadlift (RDL)',
        primaryMuscle: 'الفخذ الخلفي والمؤخرة',
        equipment: 'Barbell or Dumbbells',
        executionCues: ['مفصلة الحوض للخلف دون تحميل على صابونة الركبة', 'استشعار تمدد الفخذ الخلفي وعصر المؤخرة بالأعلى'],
        sets: [
          { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { setNumber: 2, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { setNumber: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 }
        ],
        coachNotes: 'تمرين حوضي مسيطر عليه لتجنب الضغط الأمامي على وتر الركبة'
      } : {
        id: 'ex-gen-9',
        nameAr: 'Barbell Back Squat',
        nameEn: 'Barbell Back Squat',
        primaryMuscle: 'الفخذ الأمامي والمؤخرة',
        equipment: 'Barbell & Squat Rack',
        executionCues: ['تثبيت البار وحبس النفس Bracing', 'نزول موازٍ مع دفع الركبتين باتجاه المشطين', 'دفع انفجاري بكامل باطن القدم'],
        sets: [
          { setNumber: 1, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { setNumber: 2, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { setNumber: 3, targetReps: '8', targetRpe: 9, restSeconds: 120 }
        ]
      },
      hasKnee ? {
        id: 'ex-gen-10',
        nameAr: 'Seated Hamstring Leg Curl',
        nameEn: 'Seated Hamstring Leg Curl',
        primaryMuscle: 'الفخذ الخلفي',
        equipment: 'Machine',
        executionCues: ['ثني الركبتين للخلف بتحكم كامل', 'عصر الهامسترينغ لمدة ثانية وتمدد بطيء'],
        sets: [
          { setNumber: 1, targetReps: '12-15', targetRpe: 8, restSeconds: 60 },
          { setNumber: 2, targetReps: '12-15', targetRpe: 8, restSeconds: 60 },
          { setNumber: 3, targetReps: '12', targetRpe: 8, restSeconds: 60 }
        ]
      } : {
        id: 'ex-gen-10',
        nameAr: 'Romanian Deadlift (RDL)',
        nameEn: 'Romanian Deadlift (RDL)',
        primaryMuscle: 'الفخذ الخلفي والمؤخرة',
        equipment: 'Barbell',
        executionCues: ['دفع الحوض للخلف مع ثبات الركبتين', 'التصاق البار بالساقين لحماية أسفل الظهر'],
        sets: [
          { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { setNumber: 2, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { setNumber: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 }
        ]
      },
      {
        id: 'ex-gen-11',
        nameAr: 'Leg Press Machine (High & Wide Stance)',
        nameEn: 'Leg Press Machine (High & Wide Stance)',
        primaryMuscle: 'الفخذ الشامل والمؤخرة',
        equipment: 'Leg Press Machine',
        executionCues: ['وضع القدمين بالأعلى لتخفيف الضغط على مفصل الركبة', 'نزول محكوم دون تقويس الحوض'],
        sets: [
          { setNumber: 1, targetReps: '12-15', targetRpe: 8, restSeconds: 75 },
          { setNumber: 2, targetReps: '12-15', targetRpe: 8, restSeconds: 75 },
          { setNumber: 3, targetReps: '12', targetRpe: 8, restSeconds: 75 }
        ]
      },
      {
        id: 'ex-gen-12',
        nameAr: 'Hanging Knee / Leg Raise',
        nameEn: 'Hanging Knee / Leg Raise',
        primaryMuscle: 'عضلات البطن السفلية والـ Core',
        equipment: 'Pull-up Bar',
        executionCues: ['رفع الركبتين بلف الحوض للأعلى وليس مجرد تحريك الفخذين', 'نزول بطيء دون تأرجح الجسم'],
        sets: [
          { setNumber: 1, targetReps: '12-15', targetRpe: 8, restSeconds: 60 },
          { setNumber: 2, targetReps: '12-15', targetRpe: 8, restSeconds: 60 }
        ]
      }
    ];

    const generatedWorkout: WorkoutProgram = {
      id: `prog-${Date.now()}`,
      title: injuries.none 
        ? 'البرنامج الشامل المطور (PPL Modern Science)' 
        : 'البرنامج المخصص الذكي (مراعاة المفاصل والسلامة الحركية)',
      description: 'جدول تدريبي علمي حديث عالي الكفاءة يراعي التوازن العضلي وتفادي الآلام مع أقصى تحفيز هايبرتروفي.',
      splitType: 'push_pull_legs',
      daysPerWeek: 3,
      createdDate: new Date().toISOString().split('T')[0],
      days: [
        {
          id: 'day-gen-1',
          dayName: 'اليوم الأول: دفع وصدر وأكتاف وتراي',
          dayOfWeek: 1,
          focusArea: 'صدر، كتف جانبي، ترايسبس',
          estimatedMinutes: 50,
          exercises: day1Exercises
        },
        {
          id: 'day-gen-2',
          dayName: 'اليوم الثاني: سحب وظهر وبايسبس',
          dayOfWeek: 3,
          focusArea: 'لاتس، ظهر أوسط، كتف خلفي، بايسبس',
          estimatedMinutes: 52,
          exercises: day2Exercises
        },
        {
          id: 'day-gen-3',
          dayName: 'اليوم الثالث: أرجل وسلسلة خلفية وبطن',
          dayOfWeek: 5,
          focusArea: 'أرجل شامل، فخذ خلفي، مؤخرة، بطن',
          estimatedMinutes: 55,
          exercises: day3Exercises
        }
      ]
    };

    setGeneratedProgram(generatedWorkout);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    // Convert generated meal plan into initial logged meals if present
    const initialMeals: MealItem[] = generatedMealPlan ? [
      {
        id: `meal-init-1-${Date.now()}`,
        name: generatedMealPlan.breakfast.name,
        calories: generatedMealPlan.breakfast.cals,
        protein: generatedMealPlan.breakfast.p,
        carbs: generatedMealPlan.breakfast.c,
        fat: generatedMealPlan.breakfast.f,
        serving: `${generatedMealPlan.breakfast.grams} غرام`,
        mealType: 'breakfast',
        loggedAt: '08:30 ص'
      },
      {
        id: `meal-init-2-${Date.now()}`,
        name: generatedMealPlan.lunch.name,
        calories: generatedMealPlan.lunch.cals,
        protein: generatedMealPlan.lunch.p,
        carbs: generatedMealPlan.lunch.c,
        fat: generatedMealPlan.lunch.f,
        serving: `${generatedMealPlan.lunch.grams} غرام`,
        mealType: 'lunch',
        loggedAt: '02:00 م'
      },
      {
        id: `meal-init-3-${Date.now()}`,
        name: generatedMealPlan.snack.name,
        calories: generatedMealPlan.snack.cals,
        protein: generatedMealPlan.snack.p,
        carbs: generatedMealPlan.snack.c,
        fat: generatedMealPlan.snack.f,
        serving: `${generatedMealPlan.snack.grams} غرام`,
        mealType: 'snack',
        loggedAt: '05:30 م'
      },
      {
        id: `meal-init-4-${Date.now()}`,
        name: generatedMealPlan.dinner.name,
        calories: generatedMealPlan.dinner.cals,
        protein: generatedMealPlan.dinner.p,
        carbs: generatedMealPlan.dinner.c,
        fat: generatedMealPlan.dinner.f,
        serving: `${generatedMealPlan.dinner.grams} غرام`,
        mealType: 'dinner',
        loggedAt: '09:00 م'
      }
    ] : [];

    addTrainee({
      fullName,
      email: email || `${fullName.replace(/\s+/g, '').toLowerCase()}@fitness.com`,
      phone: phone || '+966 50 123 4567',
      age,
      heightCm,
      startingWeightKg,
      currentWeightKg: startingWeightKg,
      targetWeightKg,
      goal,
      goalTitle: 
        goal === 'fat_loss' ? 'خطة تنشيف ونزول وزن صحي' :
        goal === 'muscle_gain' ? 'خطة تضخيم وبناء كتلة عضلية' :
        'خطة إعادة تشكيل ونحت الجسم',
      macroGoals: {
        calories,
        proteinGrams: protein,
        carbsGrams: carbs,
        fatsGrams: fat,
        waterLiters: 3.5,
        fiberGrams: 30,
        cardioMinutesPerWeek: 90,
        cardioType: 'مشي يومي',
        stepGoal: 10000,
      },
      ...(generatedProgram ? { program: generatedProgram } : {}),
      loggedMeals: initialMeals
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-neutral-100 my-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">إضافة متدرب جديد للمتابعة الشاملة</h3>
              <p className="text-[11px] text-neutral-400">تجهيز الماكروز، خطة الأكل، وجدول التمرين المخصص</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">اسم المتدرب بالكامل *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: فيصل بن عبدالعزيز"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1">الهدف الرئيسي للتدريب</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as GoalType)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="fat_loss">تنشيف وخسارة دهون (Fat Loss)</option>
                <option value="muscle_gain">تضخيم وبناء عضلات (Muscle Hypertrophy)</option>
                <option value="recomp">إعادة تشكيل الجسم (Body Recomposition)</option>
                <option value="maintenance">محافظة ولياقة عامة (Maintenance)</option>
              </select>
            </div>
          </div>

          {/* Measurements Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">الوزن الحالي (كغ)</label>
              <input
                type="number"
                step="0.1"
                value={startingWeightKg}
                onChange={(e) => setStartingWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">الوزن المستهدف (كغ)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">الطول (سم)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">العمر</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">رقم الهاتف (واتساب)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 50 123 4567"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trainee@example.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* SECTION 1: MACROS & SMART CALCULATOR */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>أهداف الماكروز والسعرات</span>
              </span>
              <button
                type="button"
                onClick={handleAutoCalculate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>حساب ذكي فوري</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">السعرات (Cal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-750 rounded-xl p-2 text-xs font-mono font-black text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-emerald-400 block mb-1">بروتين (غرام)</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-750 rounded-xl p-2 text-xs font-mono text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-amber-400 block mb-1">كاربوهيدرات (غرام)</label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-750 rounded-xl p-2 text-xs font-mono text-amber-400 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-cyan-400 block mb-1">دهون صحية (غرام)</label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-750 rounded-xl p-2 text-xs font-mono text-cyan-400 font-bold"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PREFERRED FOODS & MACRO TO MEAL GENERATOR (Request 11) */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>تحويل الماكروز لنظام أكل وفيتامينات متكامل</span>
            </div>

            {/* Trainee Preferred Foods Input */}
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">
                أصناف أو أكلات يرغب المتدرب بإدراجها في خطته الغذائية (اختياري):
              </label>
              <input
                type="text"
                value={preferredFoods}
                onChange={(e) => setPreferredFoods(e.target.value)}
                placeholder="مثال: سالمون، شوفان، تونة، بطاطا حلوة، موز، صدور دجاج مشوية..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-neutral-500 block mt-1">
                سيتم إدراج هذه الأصناف المفضلة تلقائياً داخل الوجبات عند توليد الخطة.
              </span>
            </div>

            {/* Convert Button */}
            <button
              type="button"
              onClick={handleGenerateMealPlan}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Apple className="w-4 h-4 text-emerald-400" />
              <span>تحويل الماكروز لنظام غذائي كامل الفيتامينات والمعادن 🥗</span>
            </button>

            {/* Generated Meal Plan Preview */}
            {generatedMealPlan && (
              <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>تم بناء خطة الوجبات المتكاملة ({generatedMealPlan.totalCals} سعرة)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowMealPlanDetails(!showMealPlanDetails)}
                    className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showMealPlanDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</span>
                    {showMealPlanDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showMealPlanDetails && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-white">🍳 الفطور: {generatedMealPlan.breakfast.name}</strong>
                        <span className="text-emerald-400 font-mono text-[11px]">{generatedMealPlan.breakfast.cals} Cal</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>P: {generatedMealPlan.breakfast.p}g · C: {generatedMealPlan.breakfast.c}g · F: {generatedMealPlan.breakfast.f}g</span>
                        <span>· {generatedMealPlan.breakfast.vitamins.join(', ')}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-white">🍗 الغداء: {generatedMealPlan.lunch.name}</strong>
                        <span className="text-emerald-400 font-mono text-[11px]">{generatedMealPlan.lunch.cals} Cal</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>P: {generatedMealPlan.lunch.p}g · C: {generatedMealPlan.lunch.c}g · F: {generatedMealPlan.lunch.f}g</span>
                        <span>· {generatedMealPlan.lunch.vitamins.join(', ')}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-white">🍌 السناك: {generatedMealPlan.snack.name}</strong>
                        <span className="text-emerald-400 font-mono text-[11px]">{generatedMealPlan.snack.cals} Cal</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>P: {generatedMealPlan.snack.p}g · C: {generatedMealPlan.snack.c}g · F: {generatedMealPlan.snack.f}g</span>
                        <span>· {generatedMealPlan.snack.vitamins.join(', ')}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-white">🥑 العشاء: {generatedMealPlan.dinner.name}</strong>
                        <span className="text-emerald-400 font-mono text-[11px]">{generatedMealPlan.dinner.cals} Cal</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>P: {generatedMealPlan.dinner.p}g · C: {generatedMealPlan.dinner.c}g · F: {generatedMealPlan.dinner.f}g</span>
                        <span>· {generatedMealPlan.dinner.vitamins.join(', ')}</span>
                      </div>
                    </div>

                    {/* Micronutrient Summary */}
                    <div className="pt-1 border-t border-neutral-800">
                      <span className="text-[11px] font-bold text-neutral-300 block mb-1">الملف الحيوي للفيتامينات والمعادن المغطاة:</span>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] text-neutral-400">
                        {generatedMealPlan.micronutrients.map((m, idx) => (
                          <div key={idx} className="bg-neutral-950/80 p-1.5 rounded-md border border-neutral-850">
                            <strong className="text-emerald-400 block">{m.name}</strong>
                            <span>{m.benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 3: INJURY ADAPTATION & SMART WORKOUT PROGRAM (Request 11) */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>توليد جدول تمرين احترافي متطور (مراعاة المفاصل والإصابات)</span>
            </div>

            {/* Injury Selectors */}
            <div>
              <label className="text-[11px] text-neutral-400 block mb-2">
                هل يعاني المتدرب من وجع أو إصابة في أي مفصل؟ (سيتم استبعاد الحركات المجهدة تلقائياً):
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => toggleInjury('none')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    injuries.none
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-500 shadow-sm'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  ✅ سليم (بدون إصابات)
                </button>

                <button
                  type="button"
                  onClick={() => toggleInjury('shoulder')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    injuries.shoulder
                      ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-sm'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  ⚠️ ألم في الكتف
                </button>

                <button
                  type="button"
                  onClick={() => toggleInjury('knee')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    injuries.knee
                      ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-sm'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  ⚠️ ألم في الركبة
                </button>

                <button
                  type="button"
                  onClick={() => toggleInjury('lowerBack')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    injuries.lowerBack
                      ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-sm'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  ⚠️ ألم أسفل الظهر
                </button>

                <button
                  type="button"
                  onClick={() => toggleInjury('wristElbow')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    injuries.wristElbow
                      ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-sm'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  ⚠️ ألم المعصم / الكوع
                </button>
              </div>
            </div>

            {/* Generate Program Button */}
            <button
              type="button"
              onClick={handleGenerateWorkoutProgram}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>إعمل جدول تمرين ذكي ومتطور يراعي المفاصل 🏋️‍♂️</span>
            </button>

            {/* Generated Program Preview */}
            {generatedProgram && (
              <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{generatedProgram.title}</span>
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{generatedProgram.days.length} أيام أسبوعياً · تمارين متطورة بالإنجليزية</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowProgramDetails(!showProgramDetails)}
                    className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showProgramDetails ? 'إخفاء' : 'عرض'}</span>
                    {showProgramDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showProgramDetails && (
                  <div className="space-y-2 text-xs">
                    {generatedProgram.days.map((day, dIdx) => (
                      <div key={day.id} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80">
                        <strong className="text-white block mb-1">{day.dayName}</strong>
                        <ul className="space-y-1 pr-2">
                          {day.exercises.map((ex, eIdx) => (
                            <li key={ex.id} className="text-[11px] text-neutral-300 flex items-center justify-between">
                              <span>{eIdx + 1}. <strong className="text-white font-mono">{ex.nameEn}</strong> ({ex.sets.length} جولات)</span>
                              {ex.coachNotes && (
                                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                  {ex.coachNotes}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>إضافة المتدرب وتفعيل حسابه</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
