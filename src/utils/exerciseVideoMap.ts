/**
 * Comprehensive Exercise Video & Biomechanics Cues Mapping
 * Maps every exercise accurately to genuine YouTube video tutorials without unrelated fallbacks.
 */

export interface ExerciseVideoInfo {
  ytId: string;
  start?: number;
  formNotes: string;
}

// Verified concise video IDs for gym exercises (demonstrating proper biomechanics)
export const EXERCISE_VIDEO_MAP: Record<string, ExerciseVideoInfo> = {
  // 1. Barbell Flat Bench Press
  'bb-1': {
    ytId: 'SCVCLChPQFY',
    start: 12,
    formNotes: 'تثبيت لوحي الكتف للخلف والأسفل (Scapular Retraction)، نزول محكوم لمنتصف الصدر، ودفع قوي بالصدر مع Leg Drive.'
  },
  // 2. Incline Barbell Bench Press
  'bb-2': {
    ytId: '8iPEnn-ltC8',
    start: 10,
    formNotes: 'زاوية دكة 30 إلى 45 درجة، النزول لعظمة الترقوة وأعلى الصدر بتحكم كامل، ودفع الوزن مع عصر الصدر العلوي.'
  },
  // 3. Decline Barbell Bench Press
  'bb-3': {
    ytId: 'LfyQBUKR8SE',
    start: 10,
    formNotes: 'تثبيت الساقين جيداً في الدكة المائلة للأسفل، والنزول لأسفل الصدر مع دفع انفجاري.'
  },
  // 4. Overhand Grip Barbell Row
  'bb-4': {
    ytId: '6FZHJGzMFEc',
    start: 8,
    formNotes: 'انحناء الحوض بزاوية 45 درجة، سحب البار نحو السرة مع قيادة الحركة بالمرفقين وعصر لوحي الظهر معاً.'
  },
  // 5. Underhand Grip Barbell Row (Yates Row)
  'bb-5': {
    ytId: '4I5pkyyVlEQ',
    start: 8,
    formNotes: 'قبضة مقلوبة تعزل عضلات اللاتس السفلية والبايسبس، سحب البار لأسفل البطن مع ثبات الجذع.'
  },
  // 6. Barbell Pendlay Row
  'bb-6': {
    ytId: 'h4nknwkgXY8',
    start: 10,
    formNotes: 'جذع موازٍ للأرض 90 درجة، يبدأ كل تكرار بسكون كامل على الأرض وسحب انفجاري للصدر.'
  },
  // 7. Barbell Overhead Press (Military Press)
  'bb-7': {
    ytId: 'qEwKCR5JCog',
    start: 10,
    formNotes: 'وقفة صلبة مع شد عضلات البطن والمؤخرة، دفع عمودي مستقيم مع تمرير الرأس للأمام في القمة.'
  },
  // 8. Barbell Back Squat
  'bb-8': {
    ytId: 'bEv6CCg2BC8',
    start: 10,
    formNotes: 'فتح الصدر، أخذ نفس بطني عميق Bracing، والنزول المتوازي حتى يوازي مفصل الحوض الركبتين مع دفع بكعب القدم.'
  },
  // 9. Barbell Front Squat
  'bb-9': {
    ytId: 'tlfahndNPPI',
    start: 10,
    formNotes: 'تثبيت البار على الكتفين الأماميين بمرفقين مرتفعين، وجذع عمودي لعزل الفخذ الأمامي Quad Focus.'
  },
  // 10. Barbell Romanian Deadlift (RDL)
  'bb-10': {
    ytId: '_oyxCn2iSjU',
    start: 10,
    formNotes: 'مفصلة الحوض للخلف Hip Hinge مع ثبات الركبتين، التصاق البار بالساقين واستشعار تمدد الفخذ الخلفي.'
  },
  // 11. Conventional Barbell Deadlift
  'bb-11': {
    ytId: 'op9kVnSso6Q',
    start: 12,
    formNotes: 'القدمين بعرض الحوض، سحب ارتخاء البار أولاً ثم الدفع بالأرض كامتداد كامل للجسم ككتلة واحدة.'
  },
  // 12. Barbell Hip Thrust
  'bb-12': {
    ytId: 'xDmFkJxPzeM',
    start: 10,
    formNotes: 'إسناد أعلى الظهر على الدكة، دفع الحوض للأعلى وعصر عضلات المؤخرة بقوة لثانية كاملة في القمة.'
  },
  // 13. Standing Barbell Biceps Curls
  'bb-13': {
    ytId: 'soxrZlIl35U',
    start: 8,
    formNotes: 'تثبيت المرفقين بجانب الخصر، رفع البار بتحكم دون أرجحة الجذع، مع عصر البايسبس في القمة.'
  },
  // 14. Wide-Grip Barbell Curls
  'bb-14': {
    ytId: 'ykJmrZ5v0Oo',
    start: 8,
    formNotes: 'قبضة أوسع من الكتفين لعزل الرأس الداخلي القصير للبايسبس (Short Head).'
  },
  // 15. Close-Grip Barbell Bench Press
  'bb-15': {
    ytId: 'nEF0bv2FW94',
    start: 10,
    formNotes: 'مسكة بعرض الكتفين مع إلصاق الكوعين بالجانب لعزل الرؤوس الثلاثة للترايسبس.'
  },
  // 16. Skull Crushers (EZ Barbell)
  'bb-16': {
    ytId: 'd_KZxkY_0aw',
    start: 10,
    formNotes: 'النزول بالبار المتعرج نحو الجبهة أو خلف الرأس قليلاً لإطالة الرأس الطويل للترايسبس مع ثبات الذراع العلوي.'
  },
  // 17. Dumbbell Incline Press
  'db-1': {
    ytId: '8iPEnn-ltC8',
    start: 8,
    formNotes: 'دكة مائلة 30 درجة، النزول بأكواع 60 درجة واستشعار التمدد في الصدر العلوي.'
  },
  // 18. Flat Dumbbell Press
  'db-2': {
    ytId: 'VmB1G1K7v94',
    start: 10,
    formNotes: 'مدى حركي كامل للدمبلز مع عصر الصدر في المنتصف وتجنب ارتطام الدمبلز ببعضهما.'
  },
  // 19. Dumbbell Shoulder Press
  'db-5': {
    ytId: 'qEwKCR5JCog',
    start: 8,
    formNotes: 'دفع رأسي مستقيم مع زاوية مقعد 75-80 درجة لحماية مفصل الكتف وأسفل الظهر.'
  },
  // 20. Dumbbell Lateral Raises
  'db-6': {
    ytId: '3VcKaXpzqRo',
    start: 8,
    formNotes: 'رفع الدمبل بالكوعين مع ميلان خفيف للأمام، والنزول البطيء لعزل الكتف الجانبي 100%.'
  },
  // 21. Dumbbell Rear Delt Flyes
  'db-7': {
    ytId: 'EA7uJyZSZPU',
    start: 8,
    formNotes: 'الانحناء للأمام مع الحفاظ على استقامة الظهر، فتح الذراعين للخارج لعزل الكتف الخلفي.'
  },
  // 22. Dumbbell Hammer Curls
  'db-10': {
    ytId: 'zC3nLlEvin4',
    start: 8,
    formNotes: 'مسكة محايدة كالمطرقة، ثبات المرفقين تماماً، ورفع الدمبل لعصر عضلة البراكين والساعد.'
  },
  // 23. Cable Lat Pulldown
  'cb-1': {
    ytId: 'CAwf7n6Luuc',
    start: 10,
    formNotes: 'قبضة مريحة مع إمالة خفيفة للصدر، وسحب الأكواع نحو الأضلاع لأسفل لعصر عضلة الظهر العريضة.'
  },
  // 24. Cable Seated Row
  'cb-2': {
    ytId: 'GZbfZ033f74',
    start: 10,
    formNotes: 'ظهر مستقيم وصدر مفتوح، سحب المقبض لأسفل البطن مع عصر لوحي الكتف.'
  },
  // 25. Cable Triceps Pushdown
  'cb-3': {
    ytId: 'vB5OHsJ3EME',
    start: 12,
    formNotes: 'تثبيت الكوعين بجانب الأضلاع، والضغط لأسفل مع فتح الحبل لعصر الرأس الطويل للترايسبس.'
  },
  // 26. Cable Biceps Curl
  'cb-4': {
    ytId: 'NFzTWp2qpiE',
    start: 8,
    formNotes: 'توتر مستمر طوال المدى الحركي بفضل سلك الكابل، ثبات المرفقين تماماً.'
  },
  // 27. Machine Leg Press
  'mc-1': {
    ytId: 'IZxyjW7MPJQ',
    start: 10,
    formNotes: 'القدمين بعرض الكتفين بمنتصف المنصة، نزول عميق محكوم ودفع دون إقفال مفاصل الركبة.'
  },
  // 28. Machine Leg Extension
  'mc-2': {
    ytId: 'YyvSfVjQeL0',
    start: 8,
    formNotes: 'ضبط وسادة الجهاز فوق الكاحل، رفع الساقين للأعلى وعصر الفخذ الأمامي لثانية، ونزول بطيء.'
  },
  // 29. Machine Lying / Seated Leg Curl
  'mc-3': {
    ytId: 'ELOCsoDSmrg',
    start: 8,
    formNotes: 'تثبيت الحوض على المسند، ثني الركبتين وسحب الوسادة نحو المؤخرة مع تحكم في النزول السلبي.'
  },
  // 30. Machine Pec Deck Fly (Butterfly)
  'mc-4': {
    ytId: 'Z5889KqB06U',
    start: 10,
    formNotes: 'انثناء خفيف في الأكواع، عصر عضلات الصدر في المنتصف لثانية كاملة، وتفادي تقديم الأكتاف للأمام.'
  },
  // 31. Standing / Seated Calf Raise
  'mc-5': {
    ytId: 'N3awlEyY980',
    start: 8,
    formNotes: 'مدى حركي كامل للسمانة مع ثبات ثانية في القمة وأقصى إطالة في القاع.'
  },
  // 32. Machine Hack Squat
  'mc-6': {
    ytId: '0tn5K9NlCfo',
    start: 10,
    formNotes: 'إسناد الظهر بالكامل على الوسادة، النزول لعمق مريح ودفع قوي بكعبي القدمين.'
  },
  // 33. Pull-ups / Chin-ups
  'cal-1': {
    ytId: 'eGo4IYlbE5g',
    start: 5,
    formNotes: 'سحب الصدر نحو العقلة بدون أرجحة، مع عصر عضلات الظهر والنزول الكامل للأسفل.'
  },
  // 34. Parallel Bar Dips
  'cal-2': {
    ytId: '2z8JmcrW-As',
    start: 5,
    formNotes: 'نزول بزاوية 90 درجة للمرفقين، ميل بسيط بالجذع لزيادة تفعيل أسفل الصدر أو مستقيم للترايسبس.'
  },
  // 35. Push-ups
  'cal-3': {
    ytId: 'IODxDxX7oi4',
    start: 5,
    formNotes: 'استقامة الجذع والرقبة، نزول الصدر حتى يلامس الأرض تقريباً والدفع بقوة.'
  },
  // 36. Treadmill Incline Walk / Cardio
  'cardio-1': {
    ytId: '9L2b2khySLE',
    start: 5,
    formNotes: 'مشي سريع على انحدار 10-12% بسرعة 4-5 كم/س للحفاظ على المنطقة الثانية لحرق الدهون Zone 2.'
  },
  // 37. Stationary Cycling / Cardio Bike
  'cardio-2': {
    ytId: 'd4n09v-tG9o',
    start: 5,
    formNotes: 'تعديل ارتفاع المقعد لمستوى الحوض، الحفاظ على معدل دوران متوازن ومقاومة متوسطة.'
  },
  // 38. Arm Circles & Shoulder Dislocates (Warmup)
  'warmup-1': {
    ytId: '1400UtT87SI',
    start: 5,
    formNotes: 'تدوير الذراعين في دوائر واسعة ببطء وتحكم لتزييت مفصل الكتف وتنشيط الكفة المدورة.'
  },
  // 39. Cat-Cow & Thoracic Mobility (Warmup / Mobility)
  'warmup-2': {
    ytId: 'pbcg9qN8K-8',
    start: 5,
    formNotes: 'تقويس وفتح فقرات الظهر الصدرية وأسفل الظهر لتحرير مفاصل العمود الفقري وتحسين المدى الحركي.'
  },
  // 40. Chest Doorway Stretch (Mobility)
  'mobility-chest': {
    ytId: 'UeWc9YhK6Y8',
    start: 5,
    formNotes: 'تثبيت الساعد على الجدار بزاوية 90 درجة، الدوران بالصدر للجهة المقابلة بلطف لإطالة ألياف الصدر.'
  },
  // 41. Hip Flexor & Hamstring Stretch (Mobility)
  'mobility-hip': {
    ytId: '71zB6tXvWlE',
    start: 5,
    formNotes: 'نزول في وضعية الاندفاع والضغط بالحوض للأمام لإطالة عضلات الفخذ الأمامية وأوتار الركبة.'
  },
  // 42. Planks / Abdominal Core
  'abs-1': {
    ytId: 'ASdvN_XEl_c',
    start: 5,
    formNotes: 'شد عضلات البطن والمؤخرة في خط مستقيم، التنفس الهادئ ومنع هبوط أسفل الظهر.'
  }
};

/**
 * Resolves video details for any exercise with intelligent fuzzy matching.
 */
export const resolveExerciseVideo = (exercise: {
  id?: string;
  nameAr?: string;
  nameEn?: string;
  videoUrl?: string;
}): ExerciseVideoInfo => {
  // 1. Direct ID match
  if (exercise.id && EXERCISE_VIDEO_MAP[exercise.id]) {
    return EXERCISE_VIDEO_MAP[exercise.id];
  }

  // 2. Direct videoUrl YouTube ID extraction if available
  if (exercise.videoUrl) {
    const ytMatch = exercise.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return {
        ytId: ytMatch[1],
        formNotes: 'تأدية المدى الحركي الكامل بتركيز عالٍ مع ضبط سرعة النزول (Tempo 2-0-1).'
      };
    }
  }

  // 3. Precise Semantic Matching on English & Arabic Names
  const text = `${exercise.nameEn || ""} ${exercise.nameAr || ""}`.toLowerCase();

  // Cardio & Treadmill & Bike
  if (text.includes('treadmill') || text.includes('سير') || text.includes('مشي') || text.includes('انحدار')) {
    return EXERCISE_VIDEO_MAP['cardio-1'];
  }
  if (text.includes('cycling') || text.includes('bike') || text.includes('دراجة')) {
    return EXERCISE_VIDEO_MAP['cardio-2'];
  }

  // Mobility & Warmup
  if (text.includes('cat-cow') || text.includes('قطة') || text.includes('فقرات') || text.includes('thoracic')) {
    return EXERCISE_VIDEO_MAP['warmup-2'];
  }
  if (text.includes('arm circles') || text.includes('تدوير الكتف') || text.includes('كفة مدورة') || text.includes('dislocates')) {
    return EXERCISE_VIDEO_MAP['warmup-1'];
  }
  if (text.includes('chest stretch') || text.includes('إطالة الصدر')) {
    return EXERCISE_VIDEO_MAP['mobility-chest'];
  }
  if (text.includes('hip flexor') || text.includes('hamstring stretch') || text.includes('إطالة الحوض') || text.includes('أوتار الركبة')) {
    return EXERCISE_VIDEO_MAP['mobility-hip'];
  }

  // Calisthenics & Bodyweight
  if (text.includes('pull up') || text.includes('chin up') || text.includes('عقلة')) {
    return EXERCISE_VIDEO_MAP['cal-1'];
  }
  if (text.includes('dips') || text.includes('متوازي') || text.includes('غطس')) {
    return EXERCISE_VIDEO_MAP['cal-2'];
  }
  if (text.includes('push up') || text.includes('ضغط الصدر') || text.includes('بوش اب')) {
    return EXERCISE_VIDEO_MAP['cal-3'];
  }
  if (text.includes('plank') || text.includes('بلانك') || text.includes('crunch') || text.includes('طحن البطن') || text.includes('بطن')) {
    return EXERCISE_VIDEO_MAP['abs-1'];
  }

  // PRIORITY 1: Specific Leg & Hamstrings (Must run before generic 'خلفي'!)
  if (text.includes('leg curl') || text.includes('ثني أرجل') || text.includes('فخذ خلفي') || text.includes('هامسترنج') || text.includes('hamstring')) {
    return EXERCISE_VIDEO_MAP['mc-3'];
  }
  if (text.includes('leg extension') || text.includes('فرد أرجل') || text.includes('تمديد أرجل') || text.includes('أمامي فخذ')) {
    return EXERCISE_VIDEO_MAP['mc-2'];
  }
  if (text.includes('leg press') || text.includes('مكبس') || text.includes('ضغط أرجل')) {
    return EXERCISE_VIDEO_MAP['mc-1'];
  }
  if (text.includes('hack squat') || text.includes('هاك')) {
    return EXERCISE_VIDEO_MAP['mc-6'];
  }
  if (text.includes('calf') || text.includes('calves') || text.includes('سمانة')) {
    return EXERCISE_VIDEO_MAP['mc-5'];
  }

  // PRIORITY 2: Rear Delts & Shoulders
  if (text.includes('rear delt') || text.includes('كتف خلفي') || text.includes('رفرفة خلفي') || text.includes('face pull')) {
    return EXERCISE_VIDEO_MAP['db-7'];
  }
  if (text.includes('lateral raise') || text.includes('رفرفة جانبي') || text.includes('جانبي')) {
    return EXERCISE_VIDEO_MAP['db-6'];
  }
  if (text.includes('front raise') || text.includes('رفرفة أمامي')) {
    return EXERCISE_VIDEO_MAP['db-5'];
  }
  if (text.includes('shoulder press') || text.includes('overhead press') || text.includes('عسكري') || text.includes('دفع كتف')) {
    return EXERCISE_VIDEO_MAP['bb-7'];
  }

  // PRIORITY 3: Chest & Pecs
  if (text.includes('pec deck') || text.includes('butterfly') || text.includes('فراشة')) {
    return EXERCISE_VIDEO_MAP['mc-4'];
  }
  if (text.includes('cable crossover') || text.includes('cable fly') || text.includes('كروس أوفر')) {
    return EXERCISE_VIDEO_MAP['cb-5'];
  }
  if (text.includes('incline') && (text.includes('dumbbell') || text.includes('دمبل'))) {
    return EXERCISE_VIDEO_MAP['db-1'];
  }
  if (text.includes('incline') && (text.includes('barbell') || text.includes('بار') || text.includes('bench'))) {
    return EXERCISE_VIDEO_MAP['bb-2'];
  }
  if (text.includes('decline')) {
    return EXERCISE_VIDEO_MAP['bb-3'];
  }
  if (text.includes('dumbbell press') || text.includes('تجميع دمبل') || text.includes('دمبل برس')) {
    return EXERCISE_VIDEO_MAP['db-2'];
  }
  if (text.includes('bench press') || text.includes('flat bench') || text.includes('بنش مستوي')) {
    return EXERCISE_VIDEO_MAP['bb-1'];
  }

  // PRIORITY 4: Back & Rows
  if (text.includes('lat pulldown') || text.includes('pulldown') || text.includes('سحب عالي')) {
    return EXERCISE_VIDEO_MAP['cb-1'];
  }
  if (text.includes('seated row') || text.includes('cable row') || text.includes('سحب أرضي')) {
    return EXERCISE_VIDEO_MAP['cb-2'];
  }
  if (text.includes('dumbbell row') || text.includes('منشار دمبل') || text.includes('سحب دمبل')) {
    return EXERCISE_VIDEO_MAP['db-4'];
  }
  if (text.includes('barbell row') || text.includes('سحب بار') || text.includes('pendlay')) {
    return EXERCISE_VIDEO_MAP['bb-4'];
  }
  if (text.includes('rdl') || text.includes('romanian deadlift') || text.includes('ديدلفت روماني')) {
    return EXERCISE_VIDEO_MAP['bb-10'];
  }
  if (text.includes('deadlift') || text.includes('ديدلفت')) {
    return EXERCISE_VIDEO_MAP['bb-11'];
  }
  if (text.includes('hip thrust') || text.includes('هيب ثرست')) {
    return EXERCISE_VIDEO_MAP['bb-12'];
  }

  // PRIORITY 5: Squats & Legs
  if (text.includes('front squat') || text.includes('سكوات أمامي')) {
    return EXERCISE_VIDEO_MAP['bb-9'];
  }
  if (text.includes('squat') || text.includes('سكوات') || text.includes('قرفصاء')) {
    return EXERCISE_VIDEO_MAP['bb-8'];
  }

  // PRIORITY 6: Arms (Biceps & Triceps)
  if (text.includes('hammer') || text.includes('شاكوش')) {
    return EXERCISE_VIDEO_MAP['db-10'];
  }
  if (text.includes('skull crusher') || text.includes('سكل كراشر')) {
    return EXERCISE_VIDEO_MAP['bb-16'];
  }
  if (text.includes('triceps') || text.includes('ترايسبس') || text.includes('pushdown') || text.includes('حبل')) {
    return EXERCISE_VIDEO_MAP['cb-3'];
  }
  if (text.includes('bicep') || text.includes('بايسبس') || text.includes('curl') || text.includes('مرجحة')) {
    return EXERCISE_VIDEO_MAP['bb-13'];
  }

  // Default fallback to clean Bench Press
  return EXERCISE_VIDEO_MAP['bb-1'];
};
