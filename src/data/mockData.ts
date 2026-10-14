import { TraineeProfile, WorkoutProgram, WeeklyCheckIn, ChatMessage, MasterExercise } from '../types/fitness';
import { DIET_PLAN_YOUSSEF_GAMAL, DIET_PLAN_MOHAMED_QASIM } from './traineeDietPlans';
import { PROGRAM_MOHAMED_QASIM } from './mohamedQasimProgram';

export { DIET_PLAN_YOUSSEF_GAMAL, DIET_PLAN_MOHAMED_QASIM, PROGRAM_MOHAMED_QASIM };

export const COACH_INFO = {
  name: 'كوتش عبدالله قاسم (Abdullah Qasim)',
  title: 'مدرب محترف معتمد ومختص التغذية والتدريب الرياضي | AQ Coaching',
  avatar: '/images/avatars/coach.jpg',
  experienceYears: 8,
  activeTraineesCount: 28,
  rating: 4.98,
  phone: '01068298126',
  username: 'coach',
  accessPin: '123456',
};

export const MASTER_EXERCISES: MasterExercise[] = [
  // ==================== 1. تمارين البار (BARBELL EXERCISES) ====================
  {
    id: 'bb-1',
    nameAr: 'Barbell Flat Bench Press',
    nameEn: 'Barbell Flat Bench Press',
    primaryMuscle: 'الصدر الأوسط (Chest)',
    category: 'barbell',
    equipment: 'بار أولمبي ودكة مستوية',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت لوحي الكتف للخلف والأسفل (Scapular Retraction)',
      'القدمين مثبتتين بقوة على الأرض لضمان Leg Drive',
      'نزول محكوم خلال ثانيتين حتى يلامس البار منتصف الصدر',
      'الدفع بقوة للأعلى دون قفل مفصل الكوع بشكل مفرط'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'bb-2',
    nameAr: 'Incline Barbell Bench Press',
    nameEn: 'Incline Barbell Bench Press',
    primaryMuscle: 'الصدر العلوي (Upper Chest)',
    category: 'barbell',
    equipment: 'بار أولمبي ودكة مائلة 30-45 درجة',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'ضبط زاوية الدكة على 30 إلى 45 درجة كحد أقصى لعزل الصدر العلوي',
      'النزول بالبار نحو عظمة الترقوة وأعلى الصدر بتحكم كامل',
      'دفع الوزن للأعلى مع عصر الصدر العلوي دون تقديم الكتفين'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'bb-3',
    nameAr: 'Decline Barbell Bench Press',
    nameEn: 'Decline Barbell Bench Press',
    primaryMuscle: 'الصدر السفلي (Lower Chest)',
    category: 'barbell',
    equipment: 'بار أولمبي ودكة مائلة للأسفل',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت الساقين بإحكام في الدكة المائلة',
      'النزول بالبار لأسفل خط الصدر بحركة انسيابية',
      'الدفع مع عصر الجزء السفلي لعضلات الصدر'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 90
  },
  {
    id: 'bb-4',
    nameAr: 'Overhand Grip Barbell Row',
    nameEn: 'Overhand Grip Barbell Row',
    primaryMuscle: 'أعلى وسماكة الظهر (Upper/Mid Back)',
    category: 'barbell',
    equipment: 'بار أولمبي وأوزان',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'قبضة يد علوية بعرض الكتفين مع انحناء الجذع 45 درجة',
      'سحب البار باتجاه أسفل الأضلاع مع ضم لوحي الكتف بقوة',
      'الحفاظ على استقامة العمود الفقري وعدم مرجحة الظهر'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'bb-5',
    nameAr: 'Underhand Grip Barbell Row (Yates Row)',
    nameEn: 'Underhand Grip Barbell Row (Yates Row)',
    primaryMuscle: 'أسفل اللاتس وسماكة الظهر (Lower Lats & Back)',
    category: 'barbell',
    equipment: 'بار أولمبي',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'قبضة يد مقلوبة (راحة اليد للأعلى) بعرض الكتفين',
      'سحب البار نحو السرة مع إبقاء الكوعين قريبين من الجذع',
      'تفعيل عضلة اللاتس بقوة وعصر أعلى نقطة ثانية واحدة'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 90
  },
  {
    id: 'bb-6',
    nameAr: 'Barbell Pendlay Row',
    nameEn: 'Barbell Pendlay Row',
    primaryMuscle: 'القوة الانفجارية للظهر (Upper Back & Lats)',
    category: 'barbell',
    equipment: 'بار أولمبي من الأرض',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'البدء من الأرض مع كل عدة (Dead Stop)',
      'الجذع موازٍ للأرض تقريباً مع تثبيت الورك',
      'سحب انفجاري للصدر والرجوع للأرض دون اهتزاز'
    ],
    defaultSets: 3,
    defaultReps: '6-8',
    targetRpe: 8.5,
    restSeconds: 120
  },
  {
    id: 'bb-7',
    nameAr: 'Barbell Overhead Press (Military Press)',
    nameEn: 'Barbell Overhead Press (Military Press)',
    primaryMuscle: 'الأكتاف الأمامية والجذع (Shoulders & Core)',
    category: 'barbell',
    equipment: 'بار أولمبي واقف',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'الوقوف بثبات مع شد عضلات البطن والمؤخرة بقوة لحماية أسفل الظهر',
      'دفع البار عمودياً فوق الرأس مع تمرير الرأس للأمام بمجرد تجاوز البار',
      'النزول المحكوم حتى مستوى أعلى الصدر'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'bb-8',
    nameAr: 'Barbell Back Squat',
    nameEn: 'Barbell Back Squat',
    primaryMuscle: 'الأرجل الأمامية والمؤخرة (Quads & Glutes)',
    category: 'barbell',
    equipment: 'قفص سكوات وبار أولمبي',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'وضع البار على عضلات الترابيز وأخذ نفس عميق (Valsalva Maneuver)',
      'النزول بثبات وثني الركبتين والحوض بتزامن حتى موازاة الأرض',
      'الدفع بكامل باطن القدم مع الحفاظ على استقامة الصدر والعمود الفقري'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 120
  },
  {
    id: 'bb-9',
    nameAr: 'Barbell Front Squat',
    nameEn: 'Barbell Front Squat',
    primaryMuscle: 'عضلات الفخذ الأمامية والجذع (Quads & Core)',
    category: 'barbell',
    equipment: 'بار أولمبي على عضلات الكتف الأمامية',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت البار على عظام الترقوة والكتف الأمامي مع رفع الكوعين للأعلى',
      'نزول عمودي مستقيم مع الحفاظ على الصدر مرفوعاً تماماً',
      'دفع متفجر من باطن القدم للأعلى'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8,
    restSeconds: 120
  },
  {
    id: 'bb-10',
    nameAr: 'Barbell Romanian Deadlift (RDL)',
    nameEn: 'Barbell Romanian Deadlift (RDL)',
    primaryMuscle: 'الأرجل الخلفية وأسفل الظهر (Hamstrings & Glutes)',
    category: 'barbell',
    equipment: 'بار أولمبي',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'انثناء طفيف في الركبة مع دفع الحوض للخلف كلياً (Hip Hinge)',
      'تمرير البار بملاصقة الساقين حتى منتصف القصبة مع إطالة الهامسترينغ',
      'الدفع بالحوض للأمام لعصر عضلات المؤخرة والأرجل الخلفية'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 90
  },
  {
    id: 'bb-11',
    nameAr: 'Conventional Barbell Deadlift',
    nameEn: 'Conventional Barbell Deadlift',
    primaryMuscle: 'كامل السلسلة الخلفية للجسم (Posterior Chain)',
    category: 'barbell',
    equipment: 'بار أولمبي وأوزان على الأرض',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'القدمين بعرض الحوض مع ملاصقة البار للساقين قبل الرفع',
      'سحب ارتخاء البار أولاً (Pull Slack) ثم الدفع بالأرض كأنك تدفع الأرض لأسفل',
      'القفل الكامل في أعلى الحركة دون إرجاع الظهر للخلف بشكل مفرط'
    ],
    defaultSets: 3,
    defaultReps: '6-8',
    targetRpe: 8.5,
    restSeconds: 150
  },
  {
    id: 'bb-12',
    nameAr: 'Barbell Hip Thrust',
    nameEn: 'Barbell Hip Thrust',
    primaryMuscle: 'عضلات المؤخرة والأرجل (Glutes)',
    category: 'barbell',
    equipment: 'بار أولمبي مبطن ودكة تدريب',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت أعلى الظهر على الدكة ووضع البار المبطن على عظم الحوض',
      'الدفع بالكعبين للأعلى حتى يصبح الجسم موازياً للأرض',
      'عصر المؤخرة في أعلى الحركة ثانية كاملة مع إبقاء النظر للأمام'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'bb-13',
    nameAr: 'Standing Barbell Biceps Curls',
    nameEn: 'Standing Barbell Biceps Curls',
    primaryMuscle: 'عضلات البايسبس (Biceps)',
    category: 'barbell',
    equipment: 'بار أولمبي أو بار متعرج EZ',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت الكوعين بجانب الجذع تماماً وعدم دفعهما للأمام',
      'ثني الذراعين ورفع البار مع عصر البايسبس في القمة',
      'نزول سلبي بطيء خلال ثانيتين إلى 3 ثوانٍ'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 60
  },
  {
    id: 'bb-14',
    nameAr: 'Wide-Grip Barbell Curls',
    nameEn: 'Wide-Grip Barbell Curls',
    primaryMuscle: 'الرأس القصير الداخلي للبايسبس (Inner Biceps Head)',
    category: 'barbell',
    equipment: 'بار أولمبي أو EZ Bar قبضة واسعة',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'اتساع القبضة أكبر من عرض الكتفين بحوالي 10 سم',
      'التركيز على عزل الرأس القصير للبايسبس لإعطاء عرض للذراع',
      'عدم أرجحة الجذع وتثبيت الجسم كلياً'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 60
  },
  {
    id: 'bb-15',
    nameAr: 'Close-Grip Barbell Bench Press',
    nameEn: 'Close-Grip Barbell Bench Press',
    primaryMuscle: 'الترايسبس والوسط الصدري (Triceps & Inner Chest)',
    category: 'barbell',
    equipment: 'بار أولمبي ودكة مستوية',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'مسك البار بمسافة مساوية لعرض الكتفين تقريباً (تجنب الضيق المفرط لإراحة المعصم)',
      'إبقاء الكوعين قريبين من القفص الصدري أثناء النزول',
      'الدفع بقوة الترايسبس لعصر الذراعين في القمة'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8,
    restSeconds: 90
  },
  {
    id: 'bb-16',
    nameAr: 'Skull Crushers (EZ Barbell)',
    nameEn: 'Skull Crushers (EZ Barbell)',
    primaryMuscle: 'الرأس الطويل للترايسبس (Triceps Long Head)',
    category: 'barbell',
    equipment: 'بار متعرج EZ ودكة مستوية',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'الاستلقاء مع إمالة الذراعين قليلاً للخلف باتجاه الجبهة',
      'ثني الكوعين فقط وإنزال البار نحو أعلى الجبين أو خلف الرأس',
      'فرد الذراعين للأعلى بعصر عضلة الترايسبس دون تحريك مفصل الكتف'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 75
  },
  {
    id: 'bb-17',
    nameAr: 'Reverse-Grip Barbell Extension',
    nameEn: 'Reverse-Grip Barbell Extension',
    primaryMuscle: 'الترايسبس وعضلات الساعد (Triceps & Forearms)',
    category: 'barbell',
    equipment: 'بار أولمبي أو EZ بقبضة عكسية',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'مسك البار بقبضة عكسية (راحة اليد موجهة للأعلى)',
      'التحكم الدقيق بالمدى الحركي لمنع إجهاد المعصم',
      'التركيز على الرأس الجانبي للترايسبس'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 75
  },
  {
    id: 'bb-18',
    nameAr: 'Barbell Shrugs',
    nameEn: 'Barbell Shrugs',
    primaryMuscle: 'عضلات الترابيز العليا (Upper Traps)',
    category: 'barbell',
    equipment: 'بار أولمبي وأوزان',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'مسك البار بعرض الكتفين والوقوف باستقامة',
      'رفع الكتفين للأعلى مباشرة باتجاه الأذنين دون تدويرهما للخلف',
      'الثبات في أعلى نقطة ثانية كاملة والنزول ببطء'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 8,
    restSeconds: 60
  },

  // ==================== 2. تمارين الدانبل (DUMBBELL EXERCISES) ====================
  {
    id: 'db-1',
    nameAr: 'Incline Dumbbell Press',
    nameEn: 'Incline Dumbbell Press',
    primaryMuscle: 'الصدر العلوي (Upper Chest)',
    category: 'dumbbell',
    equipment: 'دمبل ومقعد مائل 30 درجة',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'زاوية المقعد لا تتعدى 30 إلى 45 درجة لعزل الصدر العلوي',
      'الحفاظ على استقرار الكوع بزاوية 45-60 درجة من الجسم',
      'التركيز على عصر الصدر العلوي في أعلى نقطة دون ضرب الدمبلز معاً'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'db-2',
    nameAr: 'Flat Dumbbell Press',
    nameEn: 'Flat Dumbbell Press',
    primaryMuscle: 'الصدر الأوسط (Chest)',
    category: 'dumbbell',
    equipment: 'دمبل ومقعد مستوي',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'الاستلقاء مع تثبيت لوحي الكتف والدفع بالقدمين على الأرض',
      'النزول بالدمبلز لجانب الصدر مع تمدد كامل للألياف العضلية',
      'الدفع بقوة للأعلى بمسار هرمي مع عصر عضلات الصدر'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'db-3',
    nameAr: 'Flat Dumbbell Flyes',
    nameEn: 'Flat Dumbbell Flyes',
    primaryMuscle: 'عزل وإطالة الصدر (Chest Isolation)',
    category: 'dumbbell',
    equipment: 'دمبل خفيف إلى متوسط ومقعد مستوي',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'انثناء طفيف وثابت في مفصل الكوع طوال الحركة',
      'فتح الذراعين في قوس واسع حتى الشعور بإطالة عميقة في الصدر',
      'ضم الذراعين للأعلى كأنك تعانق برميلاً كبيراً مع عصر الصدر'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 8,
    restSeconds: 75
  },
  {
    id: 'db-4',
    nameAr: 'Dumbbell Pullover',
    nameEn: 'Dumbbell Pullover',
    primaryMuscle: 'الصدر وعضلات اللاتس (Chest & Lats)',
    category: 'dumbbell',
    equipment: 'دمبل ومقعد مستوي بعرض الظهر',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'الاستلقاء بعرض الدكة مع إسناد أعلى الظهر فقط',
      'مسك دمبل واحد بكلتا اليدين وإنزاله للخلف خلف الرأس ببطء',
      'السحب للأعلى بعضلات الصدر واللاتس حتى مستوى الوجه'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 75
  },
  {
    id: 'db-5',
    nameAr: 'Dumbbell Shoulder Press',
    nameEn: 'Dumbbell Shoulder Press',
    primaryMuscle: 'الأكتاف الأمامية والجانبية (Shoulders)',
    category: 'dumbbell',
    equipment: 'دمبل ومقعد 80-85 درجة',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت القدمين والظهر بإحكام على المقعد',
      'نزول الدمبل لمستوى الأذن بزاوية كوع متقدمة قليلاً (Scapular Plane)',
      'الدفع للأعلى دون ملامسة الأثقال بعنف في القمة'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'db-6',
    nameAr: 'Dumbbell Lateral Raises',
    nameEn: 'Dumbbell Lateral Raises',
    primaryMuscle: 'الكتف الجانبي (Side Delts)',
    category: 'dumbbell',
    equipment: 'دمبل خفيف إلى متوسط',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'انحناء خفيف للأمام مع رفع الكوع بمحاذاة المعصم',
      'التركيز على المدى الحركي والتحكم السلبي (Eccentric 2s)',
      'عدم استخدام الهز أو مرجحة الجذع'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 8.5,
    restSeconds: 60
  },
  {
    id: 'db-7',
    nameAr: 'Dumbbell Rear Delts (Rear Delt Flyes)',
    nameEn: 'Dumbbell Rear Delts (Rear Delt Flyes)',
    primaryMuscle: 'الكتف الخلفي والترابيز الوسطى (Rear Delts)',
    category: 'dumbbell',
    equipment: 'دمبل خفيف مع انحناء الجذع للأمام',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'انحناء الجذع للأمام بزاوية 45-60 درجة مع استقامة الظهر',
      'رفع الذراعين للجانبين مع توجيه الإبهام لأسفل أو للداخل قليلاً',
      'عصر عضلة الكتف الخلفية في القمة والنزول البطيء'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 8.5,
    restSeconds: 60
  },
  {
    id: 'db-8',
    nameAr: 'Neutral Grip Dumbbell Row',
    nameEn: 'Neutral Grip Dumbbell Row',
    primaryMuscle: 'الظهر واللاتس (Lats & Mid Back)',
    category: 'dumbbell',
    equipment: 'دمبل ودكة مسطحة للاستناد',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'استناد ركبة ويد على الدكة مع الحفاظ على استقامة الظهر',
      'مسك الدمبل بقبضة محايدة وسحبه باتجاه الحوض والورك',
      'عصر عضلة اللاتس والنزول مع إطالة كاملة للعضلة'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 75
  },
  {
    id: 'db-9',
    nameAr: 'Alternating Dumbbell Curls',
    nameEn: 'Alternating Dumbbell Curls',
    primaryMuscle: 'البايسبس (Biceps)',
    category: 'dumbbell',
    equipment: 'دمبل واقف أو جالس',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'رفع الدمبل بالتبادل بين اليدين مع لف المعصم للخارج (Supination)',
      'تثبيت الكوع بجانب الجسم تماماً دون أرجحة',
      'عصر البايسبس في أعلى نقطة والنزول بتحكم'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 60
  },
  {
    id: 'db-10',
    nameAr: 'Dumbbell Hammer Curls',
    nameEn: 'Dumbbell Hammer Curls',
    primaryMuscle: 'العضلة العضدية والساعد (Brachialis & Forearms)',
    category: 'dumbbell',
    equipment: 'دمبل بقبضة شاكوش (محايدة)',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'راحة اليدين متقابلتان طوال المدى الحركي',
      'رفع الدمبلز مع التركيز على سمك الذراع وعضلات الساعد',
      'نزول بطيء لمقاومة الجاذبية'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 60
  },
  {
    id: 'db-11',
    nameAr: 'Incline Dumbbell Biceps Curls',
    nameEn: 'Incline Dumbbell Biceps Curls',
    primaryMuscle: 'الرأس الطويل للبايسبس (Biceps Long Head)',
    category: 'dumbbell',
    equipment: 'مقعد مائل 45-60 درجة ودمبل',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'الاستلقاء للخلف لتحقيق إطالة قصوى لرأس البايسبس الطويل',
      'تثبيت الكوع دون تحريكه للأمام أثناء الثني',
      'تدوير المعصم للخارج (Supination) في قمة الحركة'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 60
  },
  {
    id: 'db-12',
    nameAr: 'Dumbbell Goblet Squat',
    nameEn: 'Dumbbell Goblet Squat',
    primaryMuscle: 'الأرجل الأمامية والحوض (Quads & Glutes)',
    category: 'dumbbell',
    equipment: 'دمبل واحد ممسوك بالصدر',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'مسك الدمبل عمودياً بكلا الكفين عند مستوى الصدر',
      'النزول بالسكوات بين القدمين مع توجيه الركبتين باتجاه أصابع القدم',
      'الصدر منتصب والعمود الفقري مستقيم طوال الحركة'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 75
  },
  {
    id: 'db-13',
    nameAr: 'Bulgarian Split Squats with Dumbbells',
    nameEn: 'Bulgarian Split Squats with Dumbbells',
    primaryMuscle: 'الأرجل الفردية والمؤخرة (Quads & Glutes)',
    category: 'dumbbell',
    equipment: 'دمبل ودكة خلفية لإسناد القدم',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'وضع مشط القدم الخلفية على الدكة مع تقديم القدم الأمامية بخطوة واسعة',
      'النزول بالركبة الخلفية باتجاه الأرض بزاوية قائمة للركبة الأمامية',
      'الدفع بكعب القدم الأمامية لعصر الفخذ والمؤخرة'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'db-14',
    nameAr: 'Dumbbell Romanian Deadlift (DB RDL)',
    nameEn: 'Dumbbell Romanian Deadlift (DB RDL)',
    primaryMuscle: 'الأرجل الخلفية وأسفل الظهر (Hamstrings & Glutes)',
    category: 'dumbbell',
    equipment: 'دمبل ثقيل',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'دفع الحوض للخلف مع ثني خفيف جداً في الركبتين',
      'إنزال الدمبلز بمحاذاة الساقين حتى الإحساس بإطالة الهامسترينغ',
      'الدفع بالحوض للأمام دون انحناء في الظهر'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 75
  },
  {
    id: 'db-15',
    nameAr: 'Overhead Dumbbell Triceps Extension',
    nameEn: 'Overhead Dumbbell Triceps Extension',
    primaryMuscle: 'الرأس الطويل للترايسبس (Triceps Long Head)',
    category: 'dumbbell',
    equipment: 'دمبل واحد ممسوك باليدين خلف الرأس',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'مسك الدمبل عمودياً بكلتا اليدين تحت القرص العلوي',
      'إنزال الدمبل خلف الرأس مع الحفاظ على الكوعين متقاربين',
      'الدفع للأعلى حتى الامتداد الكامل للترايسبس'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 60
  },

  // ==================== 3. تمارين الكابل (CABLE EXERCISES) ====================
  {
    id: 'cb-1',
    nameAr: 'Wide-Grip Lat Pulldown',
    nameEn: 'Wide-Grip Lat Pulldown',
    primaryMuscle: 'عضلات الظهر العريضة (Lats)',
    category: 'cable',
    equipment: 'جهاز سحب كيبل علوي بار واسع',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'قبضة أوسع بقليل من عرض الكتفين مع إمالة الصدر للخلف قليلاً',
      'السحب باتجاه عظمة الترقوة مع سحب الأكواع للأسفل والداخل',
      'تمدد كامل للعضلات في الصعود مع تحكم في الوزن'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 90
  },
  {
    id: 'cb-2',
    nameAr: 'Seated Cable Row',
    nameEn: 'Seated Cable Row',
    primaryMuscle: 'وسط وسماكة الظهر (Mid Back & Rhomboids)',
    category: 'cable',
    equipment: 'جهاز سحب كيبل أرضي مع مقبض V-Grip',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت القدمين واستقامة الجذع بزاوية 90 درجة مع انحناء خفيف في الركبة',
      'سحب المقبض نحو أسفل البطن مع ضم لوحي الكتف بقوة',
      'تمديد الذراعين ببطء للأمام مع الحفاظ على ثبات الجذع وعدم المرجحة'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 75
  },
  {
    id: 'cb-3',
    nameAr: 'Cable Face Pulls',
    nameEn: 'Cable Face Pulls',
    primaryMuscle: 'الكتف الخلفي والترابيز وأعلى الظهر (Rear Delts & Traps)',
    category: 'cable',
    equipment: 'جهاز كيبل مع ملحق الحبل على مستوى الوجه',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'ضبط بكرة الكيبل على مستوى العينين أو أعلى قليلاً',
      'مسك الحبل بقبضة محايدة وسحبه باتجاه جانبي الوجه والجبهة',
      'تدوير الكتفين للخارج وضم لوحي الكتف لتحسين صحة مفصل الكتف'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 8,
    restSeconds: 60
  },
  {
    id: 'cb-4',
    nameAr: 'Single-Arm Cable Extension',
    nameEn: 'Single-Arm Cable Extension',
    primaryMuscle: 'الترايسبس عزل فردي (Triceps Lateral & Medial Head)',
    category: 'cable',
    equipment: 'كيبل علوي بدون مقبض أو مقبض فردي D-Handle',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'الوقوف جانبياً أمام الكيبل مع تثبيت الكوع بجانب الجسم',
      'فرد الذراع لأسفل وللخارج قليلاً بحركة عزل نقية',
      'عصر عضلة الترايسبس في نهاية المدى والرجوع بزاوية 90 درجة'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 8,
    restSeconds: 60
  },
  {
    id: 'cb-5',
    nameAr: 'Triceps Rope Pushdown',
    nameEn: 'Triceps Rope Pushdown',
    primaryMuscle: 'الترايسبس (Triceps)',
    category: 'cable',
    equipment: 'جهاز كيبل وحبل',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت الكوعين بجانب الجسم تماماً',
      'فرد الذراعين لأسفل مع فتح الحبل في نهاية المدى لعصر كامل',
      'الرجوع البطيء حتى زاوية 90 درجة للكوع'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8.5,
    restSeconds: 60
  },
  {
    id: 'cb-6',
    nameAr: 'Overhead Cable Triceps Extension',
    nameEn: 'Overhead Cable Triceps Extension',
    primaryMuscle: 'الرأس الطويل للترايسبس (Triceps Long Head)',
    category: 'cable',
    equipment: 'جهاز كيبل وحبل ممسوك من الخلف',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'الوقوف بوضعية خطوة للأمام مع إمالة الجذع 45 درجة',
      'فرد الذراعين للأمام وللأعلى عبر الحبل مع إبقاء الكوعين ثابتين',
      'التحكم في النزول خلف الرأس لإطالة ممتازة للرأس الطويل'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 60
  },
  {
    id: 'cb-7',
    nameAr: 'High-to-Low Cable Crossover',
    nameEn: 'High-to-Low Cable Crossover',
    primaryMuscle: 'الصدر السفلي والأوسط (Lower & Mid Chest)',
    category: 'cable',
    equipment: 'جهاز كابل مزدوج (بكرات علوية)',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'انحناء طفيف بالجذع وتقديم قدم واحدة للثبات',
      'سحب المقابض من أعلى لأسفل وللداخل بحركة عناق حتى تتقارب اليدان أمام الحوض',
      'عصر أسفل الصدر ثانية كاملة والرجوع ببطء'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 8,
    restSeconds: 60
  },
  {
    id: 'cb-8',
    nameAr: 'Low-to-High Cable Fly',
    nameEn: 'Low-to-High Cable Fly',
    primaryMuscle: 'الصدر العلوي (Upper Chest Clavicular Head)',
    category: 'cable',
    equipment: 'جهاز كابل مزدوج (بكرات سفلية)',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'ضبط البكرات في أدنى نقطة ومسك المقابض براحة اليد للأعلى',
      'رفع الذراعين لأعلى وللداخل باتجاه منتصف الوجه أو أعلى الصدر',
      'التركيز على عصر ألياف الصدر العلوية في القمة'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 8,
    restSeconds: 60
  },
  {
    id: 'cb-9',
    nameAr: 'Cable Lateral Raises',
    nameEn: 'Cable Lateral Raises',
    primaryMuscle: 'الكتف الجانبي (Side Delts with Constant Tension)',
    category: 'cable',
    equipment: 'كيبل سفلي بمقبض فردي أو حزام المعصم',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تمرير الكابل من خلف الظهر أو أمامه ومسكه باليد البعيدة',
      'الرفع للجانب مع توتر عضلي مستمر في أسفل الحركة',
      'رفع الذراع لمستوى الكتف دون استخدام عزم الجسم'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 8.5,
    restSeconds: 60
  },
  {
    id: 'cb-10',
    nameAr: 'Cable Biceps Curls',
    nameEn: 'Cable Biceps Curls',
    primaryMuscle: 'البايسبس بتوتر مستمر (Biceps Constant Tension)',
    category: 'cable',
    equipment: 'كيبل سفلي مع بار مستقيم أو EZ',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت الكوعين ومسار السحب بقوة البايسبس النقي',
      'عصر البايسبس في القمة مع الاستفادة من المقاومة الأفقية للكيبل',
      'نزول محكوم خلال ثانيتين'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8,
    restSeconds: 60
  },

  // ==================== 4. تمارين الأجهزة والماكينات (MACHINES) ====================
  {
    id: 'mc-1',
    nameAr: 'Pec Deck (Butterfly)',
    nameEn: 'Pec Deck (Butterfly)',
    primaryMuscle: 'عزل الصدر (Chest Isolation)',
    category: 'machine',
    equipment: 'جهاز الفراشة Pec Deck',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'ضبط ارتفاع المقعد بحيث تكون المقابض بمحاذاة منتصف الصدر',
      'تثبيت الظهر ولوحي الكتف على المسند الخلفي',
      'ضم الذراعين للأمام وعصر الصدر ثانية كاملة قبل الرجوع البطيء'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 8.5,
    restSeconds: 60
  },
  {
    id: 'mc-2',
    nameAr: 'Machine Hack Squat',
    nameEn: 'Machine Hack Squat',
    primaryMuscle: 'الأرجل الأمامية (Quads Hypertrophy)',
    category: 'machine',
    equipment: 'جهاز هاك سكوات مائل',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'وضع الظهر والكتفين ملاصقين للمسند والوسائد',
      'النزول العميق بتحكم حتى ثني الركبتين 90 درجة أو أكثر لعزل الكوادز',
      'الدفع بكامل باطن القدم دون قفل مفصل الركبة بالكامل في الأعلى'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 120
  },
  {
    id: 'mc-3',
    nameAr: 'Leg Press',
    nameEn: 'Leg Press',
    primaryMuscle: 'الأرجل الشاملة (Quads, Glutes & Hamstrings)',
    category: 'machine',
    equipment: 'مكبس أرجل 45 درجة',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'وضع القدمين بمنتصف اللوحة بعرض الكتفين',
      'النزول بالوزن دون رفع أسفل الظهر أو الحوض عن المسند',
      'الدفع للأعلى بقوة مع الحفاظ على انثناء طفيف في الركبة لتجنب الإصابة'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'mc-4',
    nameAr: 'Leg Extensions',
    nameEn: 'Leg Extensions',
    primaryMuscle: 'عضلات الفخذ الأمامية عزل (Quads Isolation)',
    category: 'machine',
    equipment: 'جهاز فرد الأرجل Leg Extension',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'ضبط الوسادة لتستقر أعلى مفصل الكاحل تماماً',
      'فرد الساقين للأعلى وعصر عضلات الكوادز ثانية كاملة في القمة',
      'النزول البطيء لتحقيق أقصى إجهاد إيجابي وسلبي'
    ],
    defaultSets: 3,
    defaultReps: '12-15',
    targetRpe: 9,
    restSeconds: 60
  },
  {
    id: 'mc-5',
    nameAr: 'Leg Curls',
    nameEn: 'Leg Curls',
    primaryMuscle: 'عضلات الفخذ الخلفية (Hamstrings Isolation)',
    category: 'machine',
    equipment: 'جهاز ثني الأرجل (جالس أو مستلقي)',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت الحوض وتعديل مسند الفخذ بإحكام',
      'ثني الساقين للأسفل/للخلف بكامل قوة الهامسترينغ وعصر العضلة',
      'الرجوع بالوزن خلال ثانيتين إلى ثلاث ثوانٍ'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8.5,
    restSeconds: 60
  },
  {
    id: 'mc-6',
    nameAr: 'Leg Press Calves (Calf Raises)',
    nameEn: 'Leg Press Calves (Calf Raises)',
    primaryMuscle: 'عضلات السمانة (Gastrocnemius & Soleus)',
    category: 'machine',
    equipment: 'لوحة مكبس الأرجل أو جهاز السمانة الواقف',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'تثبيت أمشاط القدمين فقط على الحافة السفلية للوحة المكبس',
      'إطالة كاملة لكعب القدم للخلف للشعور بتمدد السمانة',
      'الدفع بأمشاط القدمين للأمام مع عصر السمانة في القمة ثانية كاملة'
    ],
    defaultSets: 3,
    defaultReps: '15-20',
    targetRpe: 9,
    restSeconds: 60
  },

  // ==================== 5. تمارين وزن الجسم والعقلة (BODYWEIGHT) ====================
  {
    id: 'bw-1',
    nameAr: 'Pull-ups / Chin-ups',
    nameEn: 'Pull-ups / Chin-ups',
    primaryMuscle: 'الظهر واللاتس والبايسبس (Lats & Biceps)',
    category: 'bodyweight',
    equipment: 'عقلة الجيم أو جهاز العقلة المساعدة',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'التعلق بالعقلة بقبضة واسعة وسحب الجسم للأعلى حتى يتجاوز الذقن البار',
      'سحب الأكواع لأسفل مع تفعيل عضلات الظهر',
      'النزول الكامل بتحكم وتكرار الحركة دون تأرجح'
    ],
    defaultSets: 3,
    defaultReps: '8-10',
    targetRpe: 8.5,
    restSeconds: 90
  },
  {
    id: 'bw-2',
    nameAr: 'Parallel Bar Dips',
    nameEn: 'Parallel Bar Dips',
    primaryMuscle: 'الصدر السفلي والترايسبس (Chest & Triceps)',
    category: 'bodyweight',
    equipment: 'جهاز المتوازي Dips Bar',
    thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
    executionCues: [
      'إمالة الجذع للأمام قليلاً لتركيز الحمل على عضلات الصدر',
      'النزول حتى زاوية 90 درجة لمفصل الكوع',
      'الدفع للأعلى بقوة مع عصر الصدر والترايسبس'
    ],
    defaultSets: 3,
    defaultReps: '10-12',
    targetRpe: 8.5,
    restSeconds: 90
  }
];

export const INITIAL_PROGRAM_AHMED: WorkoutProgram = {
  id: 'prog-ahmed-1',
  title: 'برنامج التنشيف وإعادة التشكيل المتقدم (Push / Pull / Legs)',
  description: 'خطة تدريبية متوازنة لزيادة الكثافة العضلية وحرق الدهون العنيدة مع الحفاظ على القوة.',
  splitType: 'push_pull_legs',
  daysPerWeek: 4,
  createdDate: '2026-09-01',
  days: [
    {
      id: 'day-1',
      dayName: 'اليوم 1: دفع (Push - صدر وأكتاف وترايسبس)',
      dayOfWeek: 0,
      focusArea: 'صدر، أكتاف أمامية، ترايسبس',
      estimatedMinutes: 65,
      completedToday: false,
      exercises: [
        {
          id: 'p-1',
          nameAr: 'Barbell Flat Bench Press',
          nameEn: 'Barbell Flat Bench Press',
          primaryMuscle: 'الصدر',
          equipment: 'بار أولمبي',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'احرص على أداء الإحماء التدريجي. لا تصل للفشل في الجولة الأولى.',
          executionCues: [
            'تثبيت لوحي الكتف للخلف',
            'نزول محكوم خلال ثانيتين',
            'دفع قوي مع المحافظة على ثبات الجذع'
          ],
          sets: [
            { setNumber: 1, targetReps: '8', targetRpe: 8, restSeconds: 120, actualWeight: 82.5, actualReps: 8, completed: true },
            { setNumber: 2, targetReps: '8', targetRpe: 8.5, restSeconds: 120, actualWeight: 82.5, actualReps: 8, completed: true },
            { setNumber: 3, targetReps: '6-8', targetRpe: 9, restSeconds: 150, actualWeight: 85, actualReps: 7, completed: false },
            { setNumber: 4, targetReps: '8-10', targetRpe: 9.5, restSeconds: 150, actualWeight: 80, actualReps: 9, completed: false },
          ]
        },
        {
          id: 'p-2',
          nameAr: 'Incline Dumbbell Press',
          nameEn: 'Incline Dumbbell Press',
          primaryMuscle: 'الصدر العلوي',
          equipment: 'دمبل ومقعد 30 درجة',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'تحكم بالنزول (3 ثوان نزول سلبي).',
          executionCues: ['زاوية المقعد 30 درجة', 'عصر الصدر في الأعلى'],
          sets: [
            { setNumber: 1, targetReps: '10', targetRpe: 8, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '8-10', targetRpe: 9, restSeconds: 90, completed: false },
          ]
        },
        {
          id: 'p-3',
          nameAr: 'Dumbbell Lateral Raise',
          nameEn: 'Dumbbell Lateral Raise',
          primaryMuscle: 'الكتف الجانبي',
          equipment: 'دمبل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'جولات متتالية مع تحكم صارم بدون مرجحة.',
          executionCues: ['الكوع بمستوى المعصم', 'توقف ثانية في القمة'],
          sets: [
            { setNumber: 1, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '12-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '15 + Drop set', targetRpe: 10, restSeconds: 60, completed: false },
          ]
        },
        {
          id: 'p-4',
          nameAr: 'Triceps Rope Pushdown',
          nameEn: 'Triceps Rope Pushdown',
          primaryMuscle: 'الترايسبس',
          equipment: 'كيبل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'افتح الحبل للأسفل واثبت ثانية.',
          executionCues: ['تثبيت الكوعين بجانب الجذع'],
          sets: [
            { setNumber: 1, targetReps: '12', targetRpe: 8, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '12', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 60, completed: false },
          ]
        }
      ]
    },
    {
      id: 'day-2',
      dayName: 'اليوم 2: سحب (Pull - ظهر وبايسبس وأكتاف خلفية)',
      dayOfWeek: 1,
      focusArea: 'ظهر علوي، مجنص، بايسبس',
      estimatedMinutes: 60,
      exercises: [
        {
          id: 'pl-1',
          nameAr: 'Wide-Grip Lat Pulldown',
          nameEn: 'Wide-Grip Lat Pulldown',
          primaryMuscle: 'الظهر العريض',
          equipment: 'كيبل علوي',
          executionCues: ['سحب الأكواع لأسفل', 'تمدد كامل في الصعود'],
          sets: [
            { setNumber: 1, targetReps: '10', targetRpe: 8, restSeconds: 90 },
            { setNumber: 2, targetReps: '10', targetRpe: 8.5, restSeconds: 90 },
            { setNumber: 3, targetReps: '8-10', targetRpe: 9, restSeconds: 90 },
          ]
        },
        {
          id: 'pl-2',
          nameAr: 'Barbell Bent-Over Row',
          nameEn: 'Barbell Bent-Over Row',
          primaryMuscle: 'وسط الظهر',
          equipment: 'بار أولمبي',
          executionCues: ['ثبات الظهر والعمود الفقري', 'سحب للسرة'],
          sets: [
            { setNumber: 1, targetReps: '8', targetRpe: 8, restSeconds: 90 },
            { setNumber: 2, targetReps: '8', targetRpe: 8.5, restSeconds: 90 },
            { setNumber: 3, targetReps: '8', targetRpe: 9, restSeconds: 90 },
          ]
        }
      ]
    },
    {
      id: 'day-3',
      dayName: 'اليوم 3: أرجل وبطن (Legs & Core)',
      dayOfWeek: 3,
      focusArea: 'أرجل أمامية وخلفية وبطات',
      estimatedMinutes: 70,
      exercises: [
        {
          id: 'lg-1',
          nameAr: 'Barbell Back Squat',
          nameEn: 'Barbell Back Squat',
          primaryMuscle: 'عضلات الفخذ والمؤخرة',
          equipment: 'قفص سكوات',
          executionCues: ['عمق موازٍ للأرض', 'دفع بكامل باطن القدم'],
          sets: [
            { setNumber: 1, targetReps: '8', targetRpe: 8, restSeconds: 150 },
            { setNumber: 2, targetReps: '8', targetRpe: 8.5, restSeconds: 150 },
            { setNumber: 3, targetReps: '6-8', targetRpe: 9, restSeconds: 180 },
          ]
        },
        {
          id: 'lg-2',
          nameAr: 'Romanian Deadlift (RDL)',
          nameEn: 'Romanian Deadlift (RDL)',
          primaryMuscle: 'عضلات الفخذ الخلفية',
          equipment: 'دمبل أو بار',
          executionCues: ['دفع الحوض للخلف', 'إحساس الإطالة'],
          sets: [
            { setNumber: 1, targetReps: '10', targetRpe: 8, restSeconds: 90 },
            { setNumber: 2, targetReps: '10', targetRpe: 8.5, restSeconds: 90 },
            { setNumber: 3, targetReps: '10', targetRpe: 9, restSeconds: 90 },
          ]
        }
      ]
    },
    {
      id: 'day-4',
      dayName: 'اليوم 4: علوي شامل وقوة (Upper Power)',
      dayOfWeek: 5,
      focusArea: 'عضلات الجزء العلوي الشاملة',
      estimatedMinutes: 60,
      exercises: [
        {
          id: 'up-1',
          nameAr: 'Seated Dumbbell Shoulder Press',
          nameEn: 'Seated Dumbbell Shoulder Press',
          primaryMuscle: 'أكتاف',
          equipment: 'دمبل',
          executionCues: ['نزول للأذن', 'دفع مستقيم'],
          sets: [
            { setNumber: 1, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
            { setNumber: 2, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          ]
        }
      ]
    }
  ]
};

export const PROGRAM_YOUSSEF_GAMAL: WorkoutProgram = {
  id: 'prog-youssef-1',
  title: 'جدول تمارين يوسف جمال المخصص (Chest/Shoulders - Back - Arms - Legs)',
  description: 'خطة تدريبية متقدمة من 4 أيام مقسمة لاستهداف الصدر والأكتاف، الظهر، الذراعين، والأرجل مع 3 مجموعات لكل تمرين (تكرار 10-12 للعضلات الكبيرة و 10-15 للعضلات الصغيرة).',
  splitType: 'custom',
  daysPerWeek: 4,
  createdDate: '2026-10-07',
  days: [
    {
      id: 'day-youssef-1',
      dayName: 'اليوم 1: صدر وأكتاف (Chest & Shoulders)',
      targetMuscleGroup: 'عضلات الصدر (العلوي والمستوي والداخلي) والكتف (الأمامي والجانبي) - (Large: 10-12 | Small: 10-15)',
      dayOfWeek: 0,
      focusArea: 'الصدر العلوي والمستوي، عزل الفراشة، الكتف الأمامي والجانبي',
      estimatedMinutes: 60,
      completedToday: false,
      exercises: [
        {
          id: 'ex-y-1-1',
          nameAr: 'تجميع دمبل عالي (Incline Dumbbell Press)',
          nameEn: 'Incline Dumbbell Press',
          primaryMuscle: 'الصدر العلوي (Upper Chest)',
          equipment: 'دمبل ومقعد مائل 30 درجة',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. النزول خلال ثانيتين مع ثبات واستقرار لوحي الكتف وعصر الصدر العلوي في القمة.',
          executionCues: [
            'زاوية المقعد 30 إلى 45 درجة لعزل الصدر العلوي',
            'الكوع بزاوية 60 درجة من الجذع لتجنب إجهاد مفصل الكتف',
            'دفع قوي مع عصر الصدر في أعلى نقطة دون قفل الكوع'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 90, completed: false }
          ]
        },
        {
          id: 'ex-y-1-2',
          nameAr: 'تجميع دمبل مستوي (Flat Dumbbell Press)',
          nameEn: 'Flat Dumbbell Press',
          primaryMuscle: 'الصدر الأوسط (Mid Chest)',
          equipment: 'دمبل ومقعد مستوي',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. حافظ على ثبات القدمين بالأرض ومسار متوازن للدمبلز.',
          executionCues: [
            'تثبيت لوحي الكتف للخلف والأسفل',
            'نزول محكوم بمحاذاة منتصف الصدر',
            'دفع متوازن والتركيز على انقباض عضلات الصدر'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 90, completed: false }
          ]
        },
        {
          id: 'ex-y-1-3',
          nameAr: 'تفتيح فراشة بالجهاز (Pec Deck / Butterfly)',
          nameEn: 'Pec Deck (Butterfly)',
          primaryMuscle: 'الصدر الداخلي وعزل الصدر',
          equipment: 'جهاز الفراشة (Pec Deck Machine)',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. عزل كامل مع عصر الصدر بقوة لمدة ثانية عند تلاقي المقابض.',
          executionCues: [
            'تثبيت انثناء خفيف ثابت في الأكواع طوال المدى الحركي',
            'عصر الصدر بقوة في نقطة الانقباض دون تقديم الأكتاف',
            'إطالة محكومة وبطيئة عند فتح الذراعين'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9.5, restSeconds: 60, completed: false }
          ]
        },
        {
          id: 'ex-y-1-4',
          nameAr: 'دفع دمبل للأكتاف جالساً (Dumbbell Shoulder Press)',
          nameEn: 'Dumbbell Shoulder Press',
          primaryMuscle: 'الكتف الأمامي والشامل (Anterior Deltoids)',
          equipment: 'دمبل ومقعد 75-80 درجة',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة. نزول لمستوى الأذنين ودفع مستقيم للأعلى دون تقويس أسفل الظهر.',
          executionCues: [
            'الجلوس بظهر مستقيم مشدود ومسند على المقعد',
            'دفع الدمبلز للأعلى دون ملامستهما في القمة',
            'نزول بطيء ومحكوم لحماية مفصل الكتف'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 8, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9, restSeconds: 90, completed: false }
          ]
        },
        {
          id: 'ex-y-1-5',
          nameAr: 'رفرفة جانبية بالدمبل (Dumbbell Lateral Raises)',
          nameEn: 'Dumbbell Lateral Raises',
          primaryMuscle: 'عضلات الكتف الجانبي (Lateral Delts)',
          equipment: 'دمبل خفيف إلى متوسط',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة. القيادة بالأكواع مع ثبات كامل وتجنب المرجحة تماماً.',
          executionCues: [
            'رفع الدمبل بالكوع مع ميلان خفيف جداً للأمام',
            'التوقف نصف ثانية عند موازاة الذراع للأرض',
            'النزول البطيء والمقاوم لضخ الدم في الكتف الجانبي'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9.5, restSeconds: 60, completed: false }
          ]
        }
      ]
    },
    {
      id: 'day-youssef-2',
      dayName: 'اليوم 2: ظهر (Back)',
      targetMuscleGroup: 'عضلات الظهر (سماكة وعرض اللاتس والترابيس) والكتف الخلفي - (Large: 10-12 | Small: 10-15)',
      dayOfWeek: 1,
      focusArea: 'سماكة وعرض الظهر، المجنص، والكتف الخلفي',
      estimatedMinutes: 60,
      completedToday: false,
      exercises: [
        {
          id: 'ex-y-2-1',
          nameAr: 'تجديف دمبل قبضة محايدة (Neutral Grip Dumbbell Row)',
          nameEn: 'Neutral Grip Dumbbell Row',
          primaryMuscle: 'المجنص (Lats) وسماكة الظهر',
          equipment: 'دمبل ومقعد مستوي',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. اسحب الكوع باتجاه الحوض لعزل اللاتس بأقصى كفاءة.',
          executionCues: [
            'تثبيت الركبة واليد المعاكسة على المقعد لاستقرار العمود الفقري',
            'سحب الدمبل في مسار مقوس خفيف نحو الحوض',
            'إطالة كاملة في الأسفل وعصر الظهر في الأعلى'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 90, completed: false }
          ]
        },
        {
          id: 'ex-y-2-2',
          nameAr: 'سحب بار قبضة علوية (Overhand Grip Barbell Row)',
          nameEn: 'Overhand Grip Barbell Row',
          primaryMuscle: 'أعلى الظهر وسماكة الترابيس (Upper Back & Traps)',
          equipment: 'بار أولمبي',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. ميل الجذع 45 درجة مع سحب البار نحو منتصف البطن.',
          executionCues: [
            'القبضة العلوية بعرض الكتفين مع استقامة كاملة للظهر',
            'سحب البار بالكوعين للخلف والأعلى',
            'عصر لوحي الكتف معاً والتنفس بانتظام'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 90, completed: false }
          ]
        },
        {
          id: 'ex-y-2-3',
          nameAr: 'سحب كابل أرضي جالس (Seated Cable Row)',
          nameEn: 'Seated Cable Row',
          primaryMuscle: 'منتصف الظهر واللاتس (Mid Back & Lat Thickness)',
          equipment: 'جهاز كيبل سحب أرضي ومقبض V',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. ثبات كامل للجذع دون إرجاع الظهر للخلف أثناء السحب.',
          executionCues: [
            'الجلوس باستقامة مع انثناء خفيف في الركبتين',
            'سحب المقبض لأسفل الأضلاع مع إرجاع الأكواع',
            'التحكم في الوزن أثناء الرجوع للأمام لإطالة اللاتس'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 75, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 75, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 75, completed: false }
          ]
        },
        {
          id: 'ex-y-2-4',
          nameAr: 'رفرفة كتف خلفي بالدمبل (Dumbbell Rear Delts)',
          nameEn: 'Dumbbell Rear Delts',
          primaryMuscle: 'الكتف الخلفي (Posterior Delts)',
          equipment: 'دمبل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة. أوزان مناسبة للتركيز على الرأس الخلفي للكتف فقط.',
          executionCues: [
            'الانحناء للأمام بزاوية تقارب التوازي مع الأرض',
            'رفع الدمبلين للخارج بواسطة الأكواع',
            'عصر الكتف الخلفي دون استخدام عضلات الظهر الكبيرة'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9.5, restSeconds: 60, completed: false }
          ]
        }
      ]
    },
    {
      id: 'day-youssef-3',
      dayName: 'اليوم 3: ذراعين (Arms - باي وتراي)',
      targetMuscleGroup: 'عضلات الذراعين (البايسبس والترايسبس بجميع الرؤوس) - (Small: 10-15 عدة)',
      dayOfWeek: 3,
      focusArea: 'تضخيم وبناء عضلات البايسبس والترايسبس بجميع زواياها',
      estimatedMinutes: 60,
      completedToday: false,
      exercises: [
        {
          id: 'ex-y-3-1',
          nameAr: 'تمديد ترايسبس كيبل يد واحدة (Single-Arm Cable Extension)',
          nameEn: 'Single-Arm Cable Extension',
          primaryMuscle: 'الترايسبس - الرأس الجانبي (Triceps Lateral Head)',
          equipment: 'جهاز كيبل فردي',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة لكل ذراع. ثبات كامل للكوع بجانب الجذع وعصر في نهاية المدى.',
          executionCues: [
            'تثبيت مفصل الكوع في مكان ثابت بجانب الأضلاع',
            'فرد الذراع للأسفل كاملاً وعصر الترايسبس لثانية',
            'عودة بطيئة ومحكومة حتى زاوية 90 درجة'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9.5, restSeconds: 60, completed: false }
          ]
        },
        {
          id: 'ex-y-3-2',
          nameAr: 'تمديد تراي بالحبل للأسفل (Rope Extension)',
          nameEn: 'Rope Extension',
          primaryMuscle: 'الترايسبس - الرأس الجانبي والطويل',
          equipment: 'جهاز كيبل وحبل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة. افتح طرفي الحبل للخارج في الأسفل لعصر أقصى.',
          executionCues: [
            'الضغط لأسفل مع فتح الحبل في قاع الحركة',
            'تثبيت الأكواع دون تقديمها للأمام',
            'الرجوع البطيء والمحكوم'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9.5, restSeconds: 60, completed: false }
          ]
        },
        {
          id: 'ex-y-3-3',
          nameAr: 'تمديد ترايسبس قبضة معكوسة (Reverse-Grip Barbell Extension)',
          nameEn: 'Reverse-Grip Barbell Extension',
          primaryMuscle: 'الترايسبس - الرأس الأنسي (Triceps Medial Head)',
          equipment: 'بار مستقيم أو كيبل قبضة معكوسة',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة. قبضة معكوسة (راحة اليد لأعلى) لاستهداف عميق للترايسبس.',
          executionCues: [
            'إمساك البار بقبضة معكوسة بعرض الكتفين',
            'فرد الذراعين لأسفل بتحكم تام',
            'التحكم في النزول السلبي أثناء العودة'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 8, restSeconds: 75, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 8.5, restSeconds: 75, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9, restSeconds: 75, completed: false }
          ]
        },
        {
          id: 'ex-y-3-4',
          nameAr: 'تبادل بايسبس بالدمبل (Alternating Dumbbell Curls)',
          nameEn: 'Alternating Dumbbell Curls',
          primaryMuscle: 'البايسبس (Biceps Brachii)',
          equipment: 'دمبل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة. تدوير المعصم للخارج في الأعلى لتحقيق قمة الانقباض.',
          executionCues: [
            'رفع الدمبل مع تدوير المعصم تدريجياً (Supination)',
            'تثبيت المرفق بجانب الجسم وعدم مرجحة الجذع',
            'نزول بطيء واستقامة الذراع في الأسفل'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 8, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9, restSeconds: 60, completed: false }
          ]
        },
        {
          id: 'ex-y-3-5',
          nameAr: 'مرجحة باي بالبار قبضة واسعة (Wide-Grip Barbell Curls)',
          nameEn: 'Wide-Grip Barbell Curls',
          primaryMuscle: 'البايسبس - الرأس القصير الداخلي (Short Head)',
          equipment: 'بار أولمبي أو EZ-Bar',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة. قبضة أوسع من عرض الكتفين لتعريض رأس البايسبس الداخلي.',
          executionCues: [
            'القبضة الواسعة مع ثبات الكتفين للخلف',
            'رفع البار للأعلى وعصر عضلات البايسبس في القمة',
            'نزول محكوم خلال ثانيتين'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 8, restSeconds: 75, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 8.5, restSeconds: 75, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9, restSeconds: 75, completed: false }
          ]
        },
        {
          id: 'ex-y-3-6',
          nameAr: 'مرجحة دمبل شاكوش هامر (Dumbbell Hammer Curls)',
          nameEn: 'Dumbbell Hammer Curls',
          primaryMuscle: 'عضلة البراكين والساعد (Brachialis & Brachioradialis)',
          equipment: 'دمبل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة. وضعية محايدة (قبضة شاكوش) لبناء سماكة وقوة الذراع والساعد.',
          executionCues: [
            'إمساك الدمبل عمودياً مع اتجاه راحتي اليد لبعضهما',
            'رفع الدمبل مع ثبات تام للأكواع',
            'نزول بطيء لبناء قوة الساعد'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9.5, restSeconds: 60, completed: false }
          ]
        }
      ]
    },
    {
      id: 'day-youssef-4',
      dayName: 'اليوم 4: أرجل وسمانة (Legs & Calves)',
      targetMuscleGroup: 'عضلات الأرجل (الفخذ الأمامي والخلفي والمؤخرة) والسمانة - (Large: 10-12 | Small: 10-15)',
      dayOfWeek: 5,
      focusArea: 'تطوير عضلات الفخذ الأمامي والخلفي والسمانة',
      estimatedMinutes: 65,
      completedToday: false,
      exercises: [
        {
          id: 'ex-y-4-1',
          nameAr: 'هاك سكوات بالجهاز (Machine Hack Squat)',
          nameEn: 'Machine Hack Squat',
          primaryMuscle: 'الفخذ الأمامي الرباعي (Quadriceps Sweep)',
          equipment: 'جهاز الهاك سكوات (Hack Squat Machine)',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. النزول لزاوية 90 درجة مع دفع قوي بكعبي القدمين.',
          executionCues: [
            'إسناد الظهر والكتفين بالكامل على وسائد الجهاز',
            'نزول عميق ومحكوم مع الحفاظ على مسار الركبتين باتجاه أصابع القدم',
            'الدفع للأعلى دون قفل مفاصل الركب بالكامل'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 120, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 120, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 120, completed: false }
          ]
        },
        {
          id: 'ex-y-4-2',
          nameAr: 'ضغط أرجل بالجهاز 45 درجة (Leg Press)',
          nameEn: 'Leg Press',
          primaryMuscle: 'الفخذ الشامل والمؤخرة (Quads & Glutes)',
          equipment: 'جهاز دفع الأرجل 45°',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. تباعد القدمين بعرض الكتفين مع نزول محكوم وحماية أسفل الظهر.',
          executionCues: [
            'وضع القدمين بمنتصف المنصة بعرض الكتفين',
            'نزول عميق ومحكوم دون رفع أسفل الظهر عن المسند',
            'دفع قوي وسلس مع التركيز على عضلات الفخذ'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 90, completed: false }
          ]
        },
        {
          id: 'ex-y-4-3',
          nameAr: 'فرد أرجل أمامي بالجهاز (Leg Extensions)',
          nameEn: 'Leg Extensions',
          primaryMuscle: 'عزل الفخذ الأمامي (Quadriceps Isolation)',
          equipment: 'جهاز رفرفة الأرجل جالساً',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. التوقف ثانية كاملة في قمة الحركة وعصر الفخذ الأمامي.',
          executionCues: [
            'ضبط الوسادة فوق الكاحل مباشرة ومحاذاة الركبة مع محور دوران الجهاز',
            'رفع الساقين للأعلى وعصر عضلات الفخذ الأمامية',
            'نزول بطيء لمقاومة الوزن'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9.5, restSeconds: 60, completed: false }
          ]
        },
        {
          id: 'ex-y-4-4',
          nameAr: 'ثني أرجل خلفي بالجهاز (Leg Curls)',
          nameEn: 'Leg Curls',
          primaryMuscle: 'عضلات الفخذ الخلفية (Hamstrings)',
          equipment: 'جهاز ثني الأرجل (مستلقياً أو جالساً)',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. ثبات الحوض وسحب الكعبين نحو المؤخرة مع ثني أصابع القدمين.',
          executionCues: [
            'تثبيت الحوض والوركين على المسند لتجنب مساعدة أسفل الظهر',
            'ثني الركبتين وسحب الوسادة لأقصى مدى حركي',
            'نزول بطيء وتمديد الفخذ الخلفي بالكامل'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8.5, restSeconds: 75, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 9, restSeconds: 75, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9.5, restSeconds: 75, completed: false }
          ]
        },
        {
          id: 'ex-y-4-5',
          nameAr: 'رفع سمانة على جهاز دفع الأرجل (Leg Press Calves)',
          nameEn: 'Leg Press Calves',
          primaryMuscle: 'عضلات السمانة والبطات (Calves - Gastrocnemius)',
          equipment: 'جهاز دفع الأرجل Leg Press',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة: توقف ثانية في أقصى إطالة وثانية في أقصى انقباض.',
          executionCues: [
            'وضع مشط القدمين على الحافة السفلية لمنصة الدفع مع استقامة الساقين',
            'الدفع بأمشاط القدمين للأمام لأقصى انقباض للسمانة',
            'نزول بطيء لاستشعار أقصى إطالة وتمدد لعضلة السمانة'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9.5, restSeconds: 60, completed: false }
          ]
        }
      ]
    }
  ]
};

export const INITIAL_TRAINEES: TraineeProfile[] = [
  {
    id: 'trainee-1',
    fullName: 'أحمد المنصوري',
    username: 'ahmed_mansouri',
    accessPin: '112233',
    avatarUrl: '/images/avatars/ahmed.jpg',
    phone: '+966 55 987 6543',
    email: 'ahmed.almansouri@example.com',
    age: 28,
    heightCm: 178,
    startingWeightKg: 86.4,
    currentWeightKg: 79.8,
    targetWeightKg: 75.0,
    goal: 'fat_loss',
    goalTitle: 'تنشيف دهون وإظهار التقسيمات العضلية (Fat Loss & Cut)',
    startDate: '2026-07-15',
    subscriptionEnd: '2026-10-15',
    status: 'pending_checkin',
    macroGoals: {
      calories: 2150,
      proteinGrams: 185,
      carbsGrams: 210,
      fatsGrams: 55,
      waterLiters: 3.8,
      fiberGrams: 32,
      cardioMinutesPerWeek: 120,
      cardioType: 'مشي يومي',
      stepGoal: 10000,
    },
    program: INITIAL_PROGRAM_AHMED,
    loggedMeals: [
      {
        id: 'm-1',
        name: 'شوفان مع سكوب واي بروتين وبذور الشيا وتوت بري',
        calories: 460,
        protein: 38,
        carbs: 56,
        fat: 8,
        serving: '1 زبدية (80غ شوفان + 30غ بروتين)',
        mealType: 'breakfast',
        loggedAt: '08:30 ص'
      },
      {
        id: 'm-2',
        name: 'صدر دجاج مشوي مع أرز بسمتي وخضار سوتيه وزيت زيتون',
        calories: 620,
        protein: 52,
        carbs: 72,
        fat: 12,
        serving: '200غ دجاج + 180غ أرز مطبوخ',
        mealType: 'lunch',
        loggedAt: '01:45 م'
      },
      {
        id: 'm-3',
        name: 'زبادي يوناني قليل الدسم مع 15غ لوز ني وحبة تفاح',
        calories: 270,
        protein: 22,
        carbs: 26,
        fat: 7,
        serving: '200غ زبادي + فواكه',
        mealType: 'snack',
        loggedAt: '05:15 م'
      }
    ],
    habits: [
      {
        date: '2026-09-27',
        waterGlasses: 11, // ~2.75L
        stepsCount: 8450,
        sleepHours: 7.5,
        energyLevel: 4,
        supplementsTaken: true,
        notes: 'الطاقة ممتازة خلال اليوم، الالتزام بالوجبات 100%'
      },
      {
        date: '2026-09-26',
        waterGlasses: 13,
        stepsCount: 11200,
        sleepHours: 8,
        energyLevel: 5,
        supplementsTaken: true
      },
      {
        date: '2026-09-25',
        waterGlasses: 12,
        stepsCount: 10100,
        sleepHours: 7,
        energyLevel: 4,
        supplementsTaken: true
      }
    ],
    checkIns: [
      {
        id: 'chk-w8',
        traineeId: 'trainee-1',
        weekNumber: 8,
        date: '2026-09-26',
        weightKg: 79.8,
        measurements: {
          waistCm: 81.5,
          chestCm: 104,
          thighCm: 59,
          armCm: 38.5,
          hipsCm: 96
        },
        photoFrontUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        photoBackUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        dietAdherenceScore: 9,
        workoutAdherenceScore: 10,
        sleepQualityScore: 8,
        hungerLevel: 'معتدل',
        digestionStatus: 'ممتاز',
        traineeNotes: 'مرحباً كوتش! نزلت هذا الأسبوع 700 غرام والخصر صغر سم إضافي. الأوزان في البينش بريس والسكوات ثابتة وقوية وما حسيت بأي دوخة أو إرهاق. جاهز لتوجيهاتك للأسبوع القادم.',
        status: 'pending'
      },
      {
        id: 'chk-w7',
        traineeId: 'trainee-1',
        weekNumber: 7,
        date: '2026-09-19',
        weightKg: 80.5,
        measurements: {
          waistCm: 82.5,
          chestCm: 104,
          thighCm: 59.5,
          armCm: 38.5,
          hipsCm: 97
        },
        photoFrontUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        photoBackUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        dietAdherenceScore: 8,
        workoutAdherenceScore: 9,
        sleepQualityScore: 7,
        hungerLevel: 'معتدل',
        digestionStatus: 'طبيعي',
        traineeNotes: 'الأسبوع كان ممتاز والتزمت بالخطوات اليومية 10 آلاف خطوة.',
        coachFeedback: {
          feedbackText: 'بطل يا أحمد! استمرارية أسطورية وتطور واضح في نشاف الخصر وعضلات البطن العلوية بدأت تبرز. سنبقي الماكروز الحالية كما هي لأن النزول 700غ مثالي جداً بدون خسارة عضل.',
          audioNoteUrl: 'mock-audio.mp3',
          reviewedAt: '2026-09-20',
          nextWeekTargetAdjustment: 'المحافظة على السعرات (2150) وزيادة شدة تمارين الصدر العلوي.'
        },
        status: 'reviewed'
      },
      {
        id: 'chk-w6',
        traineeId: 'trainee-1',
        weekNumber: 6,
        date: '2026-09-12',
        weightKg: 81.3,
        measurements: {
          waistCm: 83.5,
          chestCm: 103.5,
          thighCm: 60,
          armCm: 38.2
        },
        photoFrontUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        photoBackUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        dietAdherenceScore: 9,
        workoutAdherenceScore: 9,
        sleepQualityScore: 8,
        hungerLevel: 'معتدل',
        digestionStatus: 'ممتاز',
        traineeNotes: 'الأمور ممتازة.',
        coachFeedback: {
          feedbackText: 'استجابة ممتازة. النزول متواصل والأداء في التمرين تصاعدي.',
          reviewedAt: '2026-09-13',
          nextWeekTargetAdjustment: 'زيادة 10 غرام كارب في وجبة قبل التمرين لدعم الطاقة.'
        },
        status: 'reviewed'
      },
      {
        id: 'chk-w5',
        traineeId: 'trainee-1',
        weekNumber: 5,
        date: '2026-09-05',
        weightKg: 82.1,
        measurements: {
          waistCm: 84.5,
          chestCm: 103,
          thighCm: 60.5,
          armCm: 38.0
        },
        photoFrontUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        photoBackUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        dietAdherenceScore: 9,
        workoutAdherenceScore: 10,
        sleepQualityScore: 8,
        hungerLevel: 'معتدل',
        digestionStatus: 'ممتاز',
        traineeNotes: 'نزول 800غ وتحسن في شكل عضلات البطن.',
        status: 'reviewed'
      },
      {
        id: 'chk-w4',
        traineeId: 'trainee-1',
        weekNumber: 4,
        date: '2026-08-29',
        weightKg: 82.9,
        measurements: {
          waistCm: 85.5,
          chestCm: 102.5,
          thighCm: 61,
          armCm: 37.8
        },
        photoFrontUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        photoBackUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        dietAdherenceScore: 8,
        workoutAdherenceScore: 9,
        sleepQualityScore: 7,
        hungerLevel: 'معتدل',
        digestionStatus: 'طبيعي',
        traineeNotes: 'الأوزان ممتازة والخصر نزل سم كامل.',
        status: 'reviewed'
      },
      {
        id: 'chk-w3',
        traineeId: 'trainee-1',
        weekNumber: 3,
        date: '2026-08-22',
        weightKg: 83.8,
        measurements: {
          waistCm: 86.5,
          chestCm: 102,
          thighCm: 61.5,
          armCm: 37.5
        },
        photoFrontUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        photoBackUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        dietAdherenceScore: 9,
        workoutAdherenceScore: 9,
        sleepQualityScore: 8,
        hungerLevel: 'معتدل',
        digestionStatus: 'ممتاز',
        traineeNotes: 'استجابة سريعة للبرنامج الغذائي.',
        status: 'reviewed'
      },
      {
        id: 'chk-w2',
        traineeId: 'trainee-1',
        weekNumber: 2,
        date: '2026-08-15',
        weightKg: 84.7,
        measurements: {
          waistCm: 87.5,
          chestCm: 101.5,
          thighCm: 62,
          armCm: 37.2
        },
        photoFrontUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        photoBackUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        dietAdherenceScore: 8,
        workoutAdherenceScore: 9,
        sleepQualityScore: 7,
        hungerLevel: 'معتدل',
        digestionStatus: 'طبيعي',
        traineeNotes: 'تخلص الجسم من احتباس السوائل الأولي.',
        status: 'reviewed'
      },
      {
        id: 'chk-w1',
        traineeId: 'trainee-1',
        weekNumber: 1,
        date: '2026-08-08',
        weightKg: 85.5,
        measurements: {
          waistCm: 88.5,
          chestCm: 101,
          thighCm: 62.5,
          armCm: 37.0
        },
        photoFrontUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        photoBackUrl: '/src/assets/images/trainee_avatar_ahmed_1790515671172.jpg',
        dietAdherenceScore: 9,
        workoutAdherenceScore: 10,
        sleepQualityScore: 8,
        hungerLevel: 'منخفض',
        digestionStatus: 'ممتاز',
        traineeNotes: 'الأسبوع الأول كان حماسياً ونزل الوزن 900 غرام.',
        status: 'reviewed'
      }
    ],
    personalRecords: [
      { exerciseName: 'Barbell Flat Bench Press', weightKg: 95, reps: 5, date: '2026-09-20' },
      { exerciseName: 'Barbell Back Squat', weightKg: 125, reps: 6, date: '2026-09-15' },
      { exerciseName: 'Romanian Deadlift (RDL)', weightKg: 110, reps: 8, date: '2026-09-18' }
    ]
  },
  {
    id: 'trainee-2',
    fullName: 'سارة العتيبي',
    username: 'sara_otaibi',
    accessPin: '445566',
    avatarUrl: '/images/avatars/sara.jpg',
    phone: '+966 54 321 0987',
    email: 'sara.otb@example.com',
    age: 26,
    heightCm: 165,
    startingWeightKg: 68.0,
    currentWeightKg: 62.4,
    targetWeightKg: 58.0,
    goal: 'recomp',
    goalTitle: 'نحت القوام وزيادة الكتلة العضلية النسائية (Glutes & Tone)',
    startDate: '2026-08-01',
    subscriptionEnd: '2026-11-01',
    status: 'active',
    macroGoals: {
      calories: 1750,
      proteinGrams: 135,
      carbsGrams: 175,
      fatsGrams: 48,
      waterLiters: 3.0,
      fiberGrams: 28,
      cardioMinutesPerWeek: 90,
      cardioType: 'مشي يومي',
      stepGoal: 9000,
    },
    program: {
      id: 'prog-sara-1',
      title: 'خطة تشكيل القوام وزيادة القوة النسائية',
      description: 'تركيز على الأرجل الخلفية، المؤخرة، وتناسق الظهر والكتفين.',
      splitType: 'upper_lower',
      daysPerWeek: 4,
      createdDate: '2026-08-01',
      days: [
        {
          id: 's-day-1',
          dayName: 'اليوم 1: سفلية وتركيز مؤخرة (Lower Glute Focus)',
          focusArea: 'أرجل ومؤخرة',
          estimatedMinutes: 60,
          exercises: [
            {
              id: 'se-1',
              nameAr: 'Barbell Back Squat',
              nameEn: 'Barbell Back Squat',
              primaryMuscle: 'الأرجل والمؤخرة',
              equipment: 'بار أولمبي',
              executionCues: ['عمق متكامل', 'تفعيل الحوض'],
              sets: [
                { setNumber: 1, targetReps: '10', targetRpe: 8, restSeconds: 90 },
                { setNumber: 2, targetReps: '10', targetRpe: 8.5, restSeconds: 90 },
                { setNumber: 3, targetReps: '8', targetRpe: 9, restSeconds: 120 },
              ]
            }
          ]
        }
      ]
    },
    loggedMeals: [
      {
        id: 'sm-1',
        name: 'بيضتان مع شريحة توست حبوب كاملة وأفوكادو',
        calories: 340,
        protein: 18,
        carbs: 22,
        fat: 16,
        serving: 'فطور متكامل',
        mealType: 'breakfast',
        loggedAt: '09:00 ص'
      }
    ],
    habits: [
      {
        date: '2026-09-27',
        waterGlasses: 8,
        stepsCount: 7800,
        sleepHours: 7,
        energyLevel: 4,
        supplementsTaken: true
      }
    ],
    checkIns: [
      {
        id: 'chk-sara-w4',
        traineeId: 'trainee-2',
        weekNumber: 4,
        date: '2026-09-18',
        weightKg: 62.4,
        measurements: {
          waistCm: 68,
          chestCm: 89,
          thighCm: 53,
          armCm: 26,
          hipsCm: 99
        },
        photoFrontUrl: '/src/assets/images/trainee_avatar_sara_1790515684233.jpg',
        photoBackUrl: '/src/assets/images/trainee_avatar_sara_1790515684233.jpg',
        dietAdherenceScore: 10,
        workoutAdherenceScore: 10,
        sleepQualityScore: 8,
        hungerLevel: 'معتدل',
        digestionStatus: 'ممتاز',
        traineeNotes: 'ملاحظة تحسن كبير في شكل عضلات الظهر وارتفاع المؤخرة، ومرتاحة جداً مع كمية الكارب الحالية.',
        coachFeedback: {
          feedbackText: 'ممتازة يا سارة، الالتزام 100% ظاهر على قياسات الخصر والأرجل، استمري على نفس خطة التمرين مع زيادة تدريجية في أوزان الهيب ثرست.',
          reviewedAt: '2026-09-19',
          nextWeekTargetAdjustment: 'المحافظة على السعرات الحالية ورفع وزن السكوات 2.5 كغ.'
        },
        status: 'reviewed'
      }
    ],
    personalRecords: [
      { exerciseName: 'Hip Thrust', weightKg: 85, reps: 10, date: '2026-09-21' },
      { exerciseName: 'Barbell Squat', weightKg: 60, reps: 8, date: '2026-09-17' }
    ]
  },
  {
    id: 'trainee-3',
    fullName: 'عمر الحربي',
    username: 'omar_harbi',
    accessPin: '778899',
    avatarUrl: '/images/avatars/omar.jpg',
    phone: '+966 56 123 7890',
    email: 'omar.alharbi@example.com',
    age: 24,
    heightCm: 182,
    startingWeightKg: 72.0,
    currentWeightKg: 72.0,
    targetWeightKg: 78.5,
    goal: 'muscle_gain',
    goalTitle: 'بناء كتلة عضلية صافية وقوة بدنية (Hypertrophy & Clean Bulk)',
    startDate: '2026-09-16',
    subscriptionEnd: '2026-12-16',
    status: 'pending_checkin',
    macroGoals: {
      calories: 2850,
      proteinGrams: 165,
      carbsGrams: 360,
      fatsGrams: 75,
      waterLiters: 4.0,
      fiberGrams: 35,
      cardioMinutesPerWeek: 60,
      cardioType: 'مشي يومي',
      stepGoal: 8500,
    },
    program: {
      id: 'prog-omar-1',
      title: 'خطة الضخامة العضلية الشاملة (Push Pull Legs)',
      description: 'تركيز على الزيادة التدريجية في أحمال التمارين الأساسية والمركبة.',
      splitType: 'push_pull_legs',
      daysPerWeek: 4,
      createdDate: '2026-09-16',
      days: [
        {
          id: 'om-day-1',
          dayName: 'اليوم 1: دفع علوي وقوة (Push Power)',
          focusArea: 'صدر، أكتاف أمامية وجانبية، ترايسبس',
          estimatedMinutes: 65,
          exercises: [
            {
              id: 'om-ex-1',
              nameAr: 'Barbell Flat Bench Press',
              nameEn: 'Barbell Flat Bench Press',
              primaryMuscle: 'الصدر الأوسط',
              equipment: 'بار وأوزان',
              executionCues: ['تثبيت الأكتاف', 'دفع بقوة'],
              sets: [
                { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 120 },
                { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 120 },
                { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 150 },
              ]
            }
          ]
        }
      ]
    },
    loggedMeals: [
      {
        id: 'om-m1',
        name: 'شوفان بالحليب والموز وزبدة الفول السوداني ومصل اللبن',
        calories: 680,
        protein: 42,
        carbs: 85,
        fat: 18,
        serving: 'وجبة إفطار ضخامة',
        mealType: 'breakfast',
        loggedAt: '08:30 ص'
      }
    ],
    habits: [
      {
        date: '2026-09-27',
        waterGlasses: 10,
        stepsCount: 8200,
        sleepHours: 8,
        energyLevel: 5,
        supplementsTaken: true,
        notes: 'التمارين ممتازة والشهية مرتفعة.'
      }
    ],
    checkIns: [],
    personalRecords: [
      { exerciseName: 'Barbell Flat Bench Press', weightKg: 80, reps: 6, date: '2026-09-22' }
    ]
  },
  {
    id: 'trainee-4',
    fullName: 'يوسف جمال',
    username: 'youssef_gamal',
    accessPin: '123456',
    avatarUrl: '/images/avatars/youssef.jpg',
    phone: '+20 10 1234 5678',
    email: 'youssef.gamal@example.com',
    age: 25,
    heightCm: 178,
    startingWeightKg: 82.5,
    currentWeightKg: 78.0,
    targetWeightKg: 74.0,
    goal: 'fat_loss',
    goalTitle: 'بناء وتناسق عضلي وتنشيف متقدم (Hypertrophy & Shred)',
    startDate: '2026-08-10',
    subscriptionEnd: '2026-11-10',
    status: 'active',
    macroGoals: {
      calories: 2375,
      proteinGrams: 183,
      carbsGrams: 266,
      fatsGrams: 69,
      waterLiters: 3.8,
      fiberGrams: 34,
      cardioMinutesPerWeek: 90,
      cardioType: 'مشي يومي',
      stepGoal: 10000,
    },
    program: PROGRAM_YOUSSEF_GAMAL,
    customDietPlan: DIET_PLAN_YOUSSEF_GAMAL,
    loggedMeals: [
      {
        id: 'y-m1',
        name: '5 بيضات كاملين + 200غ طماطم + 200غ فول مدمس + 100غ جزر + 200غ خيار',
        calories: 687,
        protein: 51,
        carbs: 66,
        fat: 27,
        serving: 'فطار يوسف جمال المخصص بالجرامات',
        mealType: 'breakfast',
        loggedAt: '08:30 ص'
      },
      {
        id: 'y-m2',
        name: '65غ شوفان + 250 مل لبن + 30غ فول سوداني + 100غ موز',
        calories: 656,
        protein: 26,
        carbs: 83,
        fat: 28,
        serving: 'سناك الطاقة المحسوب',
        mealType: 'snack',
        loggedAt: '12:00 م'
      },
      {
        id: 'y-m3',
        name: '200غ رز بني/بسمتي + 150غ صدور فراخ + 100غ خيار + مخلل مالح',
        calories: 512,
        protein: 53,
        carbs: 58,
        fat: 7,
        serving: 'الغداء المتكامل',
        mealType: 'lunch',
        loggedAt: '03:30 م'
      },
      {
        id: 'y-m4',
        name: '200غ رز بني/بسمتي + 150غ صدور فراخ + 100غ خيار + 100غ طماطم',
        calories: 520,
        protein: 53,
        carbs: 60,
        fat: 7,
        serving: 'وجبة ما بعد التمرين للاستشفاء',
        mealType: 'dinner',
        loggedAt: '08:00 م'
      }
    ],
    habits: [
      {
        date: '2026-10-07',
        waterGlasses: 9,
        stepsCount: 8800,
        sleepHours: 8,
        energyLevel: 5,
        supplementsTaken: true,
        notes: 'الدايت مشبع وممتاز جداً والأوزان في التمرين تصاعدية!'
      }
    ],
    checkIns: [],
    personalRecords: [
      { exerciseName: 'Incline Dumbbell Press', weightKg: 32, reps: 10, date: '2026-10-02' },
      { exerciseName: 'Machine Hack Squat', weightKg: 100, reps: 10, date: '2026-09-28' }
    ]
  },
  {
    id: 'trainee-5',
    fullName: 'محمد قاسم',
    username: 'mohamed_qasim',
    accessPin: '789012',
    avatarUrl: '/images/avatars/mohamed.jpg',
    phone: '+966 50 789 0123',
    email: 'mohamed.qasim@example.com',
    age: 27,
    heightCm: 181,
    startingWeightKg: 88.0,
    currentWeightKg: 83.5,
    targetWeightKg: 78.0,
    goal: 'recomp',
    goalTitle: 'تدوير الكارب وسوبر سيت متقدم وتنشيف عضلي (Carb Cycle & Super-Sets)',
    startDate: '2026-09-01',
    subscriptionEnd: '2026-12-01',
    status: 'active',
    macroGoals: {
      calories: 2889,
      proteinGrams: 230,
      carbsGrams: 342,
      fatsGrams: 64,
      waterLiters: 4.0,
      fiberGrams: 35,
      cardioMinutesPerWeek: 120,
      cardioType: 'HIIT',
      stepGoal: 10000,
    },
    program: PROGRAM_MOHAMED_QASIM,
    customDietPlan: DIET_PLAN_MOHAMED_QASIM,
    loggedMeals: [
      {
        id: 'mq-m1',
        name: '65غ شوفان + 5 بياض بيض + 2 بيضة كاملة + 32غ زبدة فول سوداني + 30غ عسل',
        calories: 757,
        protein: 48,
        carbs: 75,
        fat: 31,
        serving: 'الوجبة الأولى (إفطار البطل)',
        mealType: 'breakfast',
        loggedAt: '08:00 ص'
      },
      {
        id: 'mq-m2',
        name: '300غ مكرونة + 150غ صدور دجاج + 100غ كوسة',
        calories: 678,
        protein: 63,
        carbs: 87,
        fat: 8,
        serving: 'الوجبة الثانية (غداء المكرونة والدجاج)',
        mealType: 'lunch',
        loggedAt: '01:30 م'
      },
      {
        id: 'mq-m3',
        name: '300غ رز بسمتي/بني + 150غ لحمة حمراء + 100غ خيار',
        calories: 675,
        protein: 48,
        carbs: 82,
        fat: 18,
        serving: 'الوجبة الثالثة (أرز ولحم بقري صافي)',
        mealType: 'snack',
        loggedAt: '05:30 م'
      },
      {
        id: 'mq-m4',
        name: '300غ رز أبيض + 200غ صدور دجاج + 100غ جزر + 50غ بقدونس',
        calories: 779,
        protein: 73,
        carbs: 99,
        fat: 9,
        serving: 'الوجبة الرابعة (أرز أبيض ودجاج مضاعف)',
        mealType: 'dinner',
        loggedAt: '09:00 م'
      }
    ],
    habits: [
      {
        date: '2026-10-07',
        waterGlasses: 10,
        stepsCount: 9500,
        sleepHours: 8,
        energyLevel: 5,
        supplementsTaken: true,
        notes: 'الالتزام بيوم الكارب العالي أعطاني بمب غير طبيعي في تمرين الصدر والترايسبس!'
      }
    ],
    checkIns: [],
    personalRecords: [
      { exerciseName: 'Incline Dumbbell Press', weightKg: 38, reps: 10, date: '2026-10-04' },
      { exerciseName: 'Leg Press 45 Degree', weightKg: 280, reps: 12, date: '2026-10-01' },
      { exerciseName: 'Wide-Grip Lat Pulldown', weightKg: 85, reps: 11, date: '2026-09-29' }
    ]
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-mq-1',
    senderRole: 'coach',
    senderName: 'كوتش عبدالله قاسم',
    traineeId: 'trainee-5',
    text: 'أهلاً يا كابتن محمد قاسم! تم تفعيل خطة تدوير الكارب (Carb Cycling) وجدول السوبر سيت التدريبي المتقدم مع تحديد العضلات المستهدفة لكل يوم ونظام التكرار المخصص (10-12 للعضلات الكبيرة و 10-15 للعضلات الصغيرة). يمكنك التبديل بين يوم الكارب العالي ويوم الكارب المنخفض مباشرة من صفحة التغذية.',
    timestamp: 'اليوم 09:30 ص',
    read: true
  },
  {
    id: 'msg-youssef-1',
    senderRole: 'coach',
    senderName: 'كوتش عبدالله قاسم',
    traineeId: 'trainee-4',
    text: 'أهلاً يا بطل يوسف! تم تحديث نظامك الغذائي المخصص بالجرامات بدقة (الفطار، السناك، الغداء، وبعد التمرين) مع ضبط تكرارات جدول التمارين (10-12 للعضلات الكبيرة و10-15 للعضلات الصغيرة) وتحديد العضلة المستهدفة لكل يوم.',
    timestamp: 'اليوم 09:00 ص',
    read: true
  },
  {
    id: 'msg-1',
    senderRole: 'coach',
    senderName: 'كوتش طارق',
    traineeId: 'trainee-1',
    text: 'صباح الخير يا أحمد! شفت تقرير متابعتك للأسبوع الثامن، ما شاء الله نزول 700غ مع ثبات أوزان التمرين إنجاز ممتاز جداً.',
    timestamp: '2026-09-26 10:30 ص',
    read: true
  },
  {
    id: 'msg-2',
    senderRole: 'trainee',
    senderName: 'أحمد المنصوري',
    traineeId: 'trainee-1',
    text: 'أهلاً كوتش طارق! الله يسعدك يا رب، بصراحة الخطة مريحة ومستوى طاقتي في النادي عالي جداً بفضل وجبة الكارب قبل التمرين.',
    timestamp: '2026-09-26 10:45 ص',
    read: true
  },
  {
    id: 'msg-3',
    senderRole: 'coach',
    senderName: 'كوتش طارق',
    traineeId: 'trainee-1',
    text: 'ممتاز! اليوم عندك تمرين الدفع (Push)، ركز في الجولة الثالثة بالبينش بريس على إيقاف البار ثانية على الصدر قبل الدفع لنزيد الحمل الميكانيكي. معك خطوة بخطوة!',
    timestamp: '2026-09-27 08:15 ص',
    read: true
  }
];
