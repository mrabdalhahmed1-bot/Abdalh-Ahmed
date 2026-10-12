import { WorkoutProgram } from '../types/fitness';

export const PROGRAM_MOHAMED_QASIM: WorkoutProgram = {
  id: 'prog-mohamed-qasim-1',
  title: 'جدول تدريب محمد قاسم المتقدم (Super-Sets & Carb Cycle Hybrid)',
  description: 'خطة تدريبية متقدمة مبنية على نظام السوبر سيت (Super-Sets) المكثف لرفع معدل الحرق وضخ الدم، مع تحديد العضلة المستهدفة لكل يوم تدريبي بدقة وتوزيع التكرارات (10-12 للعضلات الكبيرة و 10-15 للعضلات الصغيرة).',
  splitType: 'custom',
  daysPerWeek: 4,
  createdDate: '2026-10-07',
  days: [
    {
      id: 'day-mq-1',
      dayName: 'اليوم 1: دفع (صدر وترايسبس)',
      targetMuscleGroup: 'عضلات الصدر (العلوي والمستوي) والترايسبس (Large Muscle: Chest 10-12 reps | Small: Triceps 10-15 reps)',
      focusArea: 'الصدر العلوي، الصدر الأوسط، عزل الصدر بالفراشة، ورؤوس الترايسبس الجانبية والطويلة',
      estimatedMinutes: 65,
      completedToday: false,
      exercises: [
        {
          id: 'ex-mq-1-1',
          nameAr: 'تجميع دمبل عالي مائل (Incline Dumbbell Press)',
          nameEn: 'Incline Dumbbell Press',
          primaryMuscle: 'الصدر العلوي (Upper Chest)',
          equipment: 'دمبل ومقعد 30 درجة',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. انزل بثبات خلال ثانيتين واضغط للأعلى مع عصر الصدر العلوي دون قفل المرفقين.',
          executionCues: [
            'زاوية المقعد 30 إلى 40 درجة لتركيز الحمل على ألياف الصدر العلوية',
            'الكوع بزاوية 60 درجة لتفادي الضغط على مفصل الكتف',
            'دفع قوي متزن وعصر عضلات الصدر في القمة'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 90, completed: false }
          ]
        },
        {
          id: 'ex-mq-1-2',
          nameAr: 'سوبر سيت الصدر: تجميع مستوي + تفتيح فراشة بالجهاز',
          nameEn: 'Flat DB Press + Pec Deck Fly (Super-Set)',
          primaryMuscle: 'الصدر الأوسط وعزل الصدر (Chest Hypertrophy)',
          equipment: 'دمبل ومقعد مستوي + جهاز الفراشة Pec Deck',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          isSuperSet: true,
          superSetName: 'سوبر سيت الصدر المزدوج 🔥',
          superSetNotes: 'العب تجميع الدمبل المستوي ثم انتقل فوراً بدون راحة لجهاز الفراشة، وبعد انتهاء الزوج خذ راحة 75 ثانية.',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة لكل تمرين في السوبر سيت. بمجرد الانتهاء من الدمبل توجه مباشرة للفراشة دون راحة.',
          executionCues: [
            'التمرين الأول: تجميع دمبل مستوي 10-12 عدة بتحكم',
            'الانتقال المباشر بدون راحة إلى جهاز الفراشة Pec Deck',
            'التمرين الثاني: 10-12 عدة مع عصر الصدر لثانية في قمة الحركة',
            'راحة 75-90 ثانية بعد إنهاء الزوج بالكامل'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12 + 10-12', targetRpe: 8.5, restSeconds: 75, completed: false },
            { setNumber: 2, targetReps: '10-12 + 10-12', targetRpe: 9, restSeconds: 75, completed: false },
            { setNumber: 3, targetReps: '10-12 + 10-12', targetRpe: 9.5, restSeconds: 75, completed: false }
          ],
          superSetPair: {
            id: 'ex-mq-1-2-b',
            nameAr: 'تفتيح فراشة بالجهاز (Pec Deck Fly)',
            nameEn: 'Pec Deck Machine Fly',
            primaryMuscle: 'عزل الصدر والخط الداخلي',
            equipment: 'جهاز Pec Deck',
            thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
            executionCues: ['انثناء بسيط في المرفقين', 'عصر الصدر في المنتصف'],
            sets: [
              { setNumber: 1, targetReps: '10-12', restSeconds: 75 },
              { setNumber: 2, targetReps: '10-12', restSeconds: 75 },
              { setNumber: 3, targetReps: '10-12', restSeconds: 75 }
            ]
          }
        },
        {
          id: 'ex-mq-1-3',
          nameAr: 'سوبر سيت الترايسبس: دفع كيبل بالحبل + تمديد دمبل فوق الرأس',
          nameEn: 'Triceps Rope Pushdown + Overhead Extension (Super-Set)',
          primaryMuscle: 'الترايسبس - الرأس الجانبي والرأس الطويل',
          equipment: 'كيبل بحبل + دمبل فردي',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          isSuperSet: true,
          superSetName: 'سوبر سيت الترايسبس الحارق 🔥',
          superSetNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة. فتح الحبل لأسفل ثم فوراً تمديد دمبل خلف الرأس لاستطالة الرأس الطويل.',
          coachNotes: 'عضلة صغيرة: 10-15 عدة لكل تمرين. ثبات كامل للمرفقين بجانب الجذع.',
          executionCues: [
            'التمرين الأول: دفع كيبل بالحبل 10-15 عدة مع فتح الحبل بالأسفل',
            'الانتقال المباشر بدون راحة لتمديد الدمبل فوق الرأس 10-15 عدة',
            'عصر كامل في كل تكرار لضخ الدم في الترايسبس',
            'راحة 60 ثانية بعد إنهاء الزوج'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15 + 10-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15 + 10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15 + 10-15', targetRpe: 9.5, restSeconds: 60, completed: false }
          ],
          superSetPair: {
            id: 'ex-mq-1-3-b',
            nameAr: 'تمديد دمبل ترايسبس فوق الرأس (Overhead Triceps Extension)',
            nameEn: 'Overhead Dumbbell Triceps Extension',
            primaryMuscle: 'الترايسبس - الرأس الطويل',
            equipment: 'دمبل ومقعد',
            thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
            executionCues: ['المرفقين للأعلى', 'إطالة كاملة خلف الرأس'],
            sets: [
              { setNumber: 1, targetReps: '10-15', restSeconds: 60 },
              { setNumber: 2, targetReps: '10-15', restSeconds: 60 },
              { setNumber: 3, targetReps: '10-15', restSeconds: 60 }
            ]
          }
        }
      ]
    },
    {
      id: 'day-mq-2',
      dayName: 'اليوم 2: سحب (ظهر وبايسبس)',
      targetMuscleGroup: 'عضلات الظهر (سماكة وعرض اللاتس) والبايسبس والكتف الخلفي (Large: Back 10-12 reps | Small: Biceps 10-15 reps)',
      focusArea: 'المجنص Latissimus Dorsi، سماكة منتصف الظهر، الرأس الطويل والقصير للبايسبس، والكتف الخلفي',
      estimatedMinutes: 65,
      completedToday: false,
      exercises: [
        {
          id: 'ex-mq-2-1',
          nameAr: 'سحب عالي للظهر قبضة واسعة (Lat Pulldown)',
          nameEn: 'Wide-Grip Lat Pulldown',
          primaryMuscle: 'عضلات اللاتس وعرض الظهر (Lats Width)',
          equipment: 'جهاز السحب العالي',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. سحب البار نحو أعلى الصدر وسحب لوحي الكتف للأسفل.',
          executionCues: [
            'القبضة أوسع من الكتفين بقليل مع ميل خفيف بالجذع للخلف',
            'القيادة بالأكواع وسحب البار لعظمة الترقوة',
            'رجوع بطيء لإطالة اللاتس بالكامل'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 90, completed: false }
          ]
        },
        {
          id: 'ex-mq-2-2',
          nameAr: 'سوبر سيت الظهر والكتف الخلفي: سحب أرضي جالس + رفرفة كتف خلفي بالدمبل',
          nameEn: 'Seated Cable Row + Rear Delt Fly (Super-Set)',
          primaryMuscle: 'سماكة الظهر والكتف الخلفي (Mid Back & Rear Delts)',
          equipment: 'كيبل سحب أرضي + دمبل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          isSuperSet: true,
          superSetName: 'سوبر سيت سماكة الظهر والكتف الخلفي 🔥',
          superSetNotes: 'عضلة كبيرة للظهر 10-12 عدة + عضلة صغيرة للكتف الخلفي 10-15 عدة مباشرة دون راحة بينهما، ثم راحة 75 ثانية.',
          coachNotes: 'الظهر 10-12 عدة والكتف الخلفي 10-15 عدة. ثبات الجذع وعدم التأرجح أثناء السحب والرفرفة.',
          executionCues: [
            'التمرين الأول: سحب كيبل أرضي 10-12 عدة لعصر منتصف الظهر',
            'الانتقال المباشر بدون راحة لرفرفة الكتف الخلفي 10-15 عدة بالدمبل',
            'عصر عضلات الكتف الخلفي في قمة الحركة',
            'راحة 75 ثانية بعد إنهاء الزوج'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12 + 10-15', targetRpe: 8.5, restSeconds: 75, completed: false },
            { setNumber: 2, targetReps: '10-12 + 10-15', targetRpe: 9, restSeconds: 75, completed: false },
            { setNumber: 3, targetReps: '10-12 + 10-15', targetRpe: 9.5, restSeconds: 75, completed: false }
          ],
          superSetPair: {
            id: 'ex-mq-2-2-b',
            nameAr: 'رفرفة كتف خلفي بالدمبل (Dumbbell Rear Delt Flyes)',
            nameEn: 'Dumbbell Rear Delt Flyes',
            primaryMuscle: 'الكتف الخلفي (Rear Delts)',
            equipment: 'دمبل',
            thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
            executionCues: ['انحناء الجذع للأمام', 'رفع الدمبلين بالكوعين'],
            sets: [
              { setNumber: 1, targetReps: '10-15', restSeconds: 75 },
              { setNumber: 2, targetReps: '10-15', restSeconds: 75 },
              { setNumber: 3, targetReps: '10-15', restSeconds: 75 }
            ]
          }
        },
        {
          id: 'ex-mq-2-3',
          nameAr: 'سوبر سيت البايسبس: مرجحة بار مستقيم + مرجحة شاكوش هامر بالدمبل',
          nameEn: 'Barbell Curl + DB Hammer Curl (Super-Set)',
          primaryMuscle: 'البايسبس وعضلة الساعد والبراكين (Arm Thickness)',
          equipment: 'بار أولمبي أو EZ + دمبل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          isSuperSet: true,
          superSetName: 'سوبر سيت ضخامة البايسبس والساعد 🔥',
          superSetNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة لكل تمرين. مرجحة البار للبايسبس ثم فوراً الهامر لتعريض الذراع.',
          coachNotes: 'عضلة صغيرة: 10-15 عدة. منع مرجحة الظهر نهائياً والتركيز على عصر البايسبس.',
          executionCues: [
            'التمرين الأول: مرجحة بالبار 10-15 عدة مع ثبات المرفقين',
            'الانتقال المباشر لمرجحة الشاكوش بالدمبل 10-15 عدة',
            'نزول بطيء ومحكوم للتحكم بالوزن',
            'راحة 60 ثانية بعد إنهاء الزوج'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15 + 10-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15 + 10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15 + 10-15', targetRpe: 9.5, restSeconds: 60, completed: false }
          ],
          superSetPair: {
            id: 'ex-mq-2-3-b',
            nameAr: 'مرجحة دمبل شاكوش هامر (Dumbbell Hammer Curls)',
            nameEn: 'Dumbbell Hammer Curls',
            primaryMuscle: 'عضلة الساعد والبراكين (Brachialis)',
            equipment: 'دمبل',
            thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
            executionCues: ['قبضة محايدة رأسية', 'رفع للأعلى دون تأرجح'],
            sets: [
              { setNumber: 1, targetReps: '10-15', restSeconds: 60 },
              { setNumber: 2, targetReps: '10-15', restSeconds: 60 },
              { setNumber: 3, targetReps: '10-15', restSeconds: 60 }
            ]
          }
        }
      ]
    },
    {
      id: 'day-mq-3',
      dayName: 'اليوم 3: أرجل وسمانة (Legs & Calves)',
      targetMuscleGroup: 'عضلات الأرجل (الفخذ الأمامي والخلفي والمؤخرة) والسمانة (Large: Legs 10-12 reps | Small: Calves 10-15 reps)',
      focusArea: 'الكوادرسبس Quadriceps، الهامسترنج Hamstrings، وعضلات السمانة Gastrocnemius',
      estimatedMinutes: 65,
      completedToday: false,
      exercises: [
        {
          id: 'ex-mq-3-1',
          nameAr: 'ضغط أرجل بالجهاز 45 درجة (Leg Press)',
          nameEn: 'Leg Press 45 Degree',
          primaryMuscle: 'الفخذ الشامل والكوادرسبس (Quads & Glutes)',
          equipment: 'جهاز Leg Press',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة كبيرة: 3 مجموعات × 10-12 عدة. نزول عميق محكوم مع تثبيت أسفل الظهر تماماً على مسند الجهاز.',
          executionCues: [
            'القدمان في منتصف المنصة بعرض الكتفين',
            'نزول عميق بزاوية 90 درجة مع دفع بكعب القدمين',
            'عدم قفل مفصل الركبة في القمة لحماية الأربطة'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12', targetRpe: 8, restSeconds: 120, completed: false },
            { setNumber: 2, targetReps: '10-12', targetRpe: 8.5, restSeconds: 120, completed: false },
            { setNumber: 3, targetReps: '10-12', targetRpe: 9, restSeconds: 120, completed: false }
          ]
        },
        {
          id: 'ex-mq-3-2',
          nameAr: 'سوبر سيت الفخذ: فرد أرجل أمامي + ثني أرجل خلفي بالجهاز',
          nameEn: 'Leg Extension + Leg Curl (Super-Set)',
          primaryMuscle: 'الفخذ الأمامي والخلفي (Quads & Hamstrings)',
          equipment: 'جهاز رفرفة أرجل + جهاز ثني أرجل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          isSuperSet: true,
          superSetName: 'سوبر سيت توازن الفخذ الشامل 🔥',
          superSetNotes: 'عضلة كبيرة: 10-12 عدة فرد أمامي ثم مباشرة 10-12 عدة ثني خلفي بدون راحة بينهما، ثم راحة 90 ثانية.',
          coachNotes: 'عضلة كبيرة: 10-12 عدة لكل تمرين. ثبات تام للحوض وعصر في قمة الحركة.',
          executionCues: [
            'التمرين الأول: فرد أرجل أمامي 10-12 عدة مع عصر الكواد ثانية بالقمة',
            'الانتقال المباشر لجهاز ثني الأرجل الخلفي 10-12 عدة',
            'النزول البطيء لمقاومة الوزن واستطالة الهامسترنج',
            'راحة 90 ثانية بعد إنهاء الزوج'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12 + 10-12', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10-12 + 10-12', targetRpe: 9, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '10-12 + 10-12', targetRpe: 9.5, restSeconds: 90, completed: false }
          ],
          superSetPair: {
            id: 'ex-mq-3-2-b',
            nameAr: 'ثني أرجل خلفي بالجهاز (Lying / Seated Leg Curl)',
            nameEn: 'Leg Curl Machine',
            primaryMuscle: 'عضلات الفخذ الخلفية (Hamstrings)',
            equipment: 'جهاز Leg Curl',
            thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
            executionCues: ['ثني الركبتين بالكامل', 'نزول محكوم'],
            sets: [
              { setNumber: 1, targetReps: '10-12', restSeconds: 90 },
              { setNumber: 2, targetReps: '10-12', restSeconds: 90 },
              { setNumber: 3, targetReps: '10-12', restSeconds: 90 }
            ]
          }
        },
        {
          id: 'ex-mq-3-3',
          nameAr: 'سوبر سيت السمانة: رفع سمانة واقفاً بالجهاز + رفع سمانة بوزن الجسم',
          nameEn: 'Standing Calf Raise + Bodyweight Calves (Super-Set)',
          primaryMuscle: 'عضلات السمانة (Gastrocnemius & Soleus)',
          equipment: 'جهاز السمانة واقفاً أو منصة ودرج',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          isSuperSet: true,
          superSetName: 'سوبر سيت تفجير السمانة 🔥',
          superSetNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة بالجهاز ثم 15 عدة بوزن الجسم بدون راحة، ثم راحة 60 ثانية.',
          coachNotes: 'عضلة صغيرة: 10-15 عدة. تمديد كامل في الأسفل وثبات لثانية في قمة الانقباض.',
          executionCues: [
            'التمرين الأول: رفع سمانة بالوزن 10-15 عدة مع ثبات بالقمة',
            'الانتقال المباشر لأداء 10-15 عدة سريعة بوزن الجسم على حافة المنصة',
            'عصر السمانة حتى الاحتراق العضلي التام',
            'راحة 60 ثانية بعد إنهاء الزوج'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15 + 10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15 + 10-15', targetRpe: 9.5, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15 + 10-15', targetRpe: 10, restSeconds: 60, completed: false }
          ],
          superSetPair: {
            id: 'ex-mq-3-3-b',
            nameAr: 'رفع سمانة حرة بوزن الجسم على المنصة (Burnout Calves)',
            nameEn: 'Bodyweight Edge Calf Raises',
            primaryMuscle: 'السمانة ومقاومة الإجهاد',
            equipment: 'منصة / درج',
            thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
            executionCues: ['إطالة كاملة في القاع', 'دفع قوي برؤوس الأصابع'],
            sets: [
              { setNumber: 1, targetReps: '10-15', restSeconds: 60 },
              { setNumber: 2, targetReps: '10-15', restSeconds: 60 },
              { setNumber: 3, targetReps: '10-15', restSeconds: 60 }
            ]
          }
        }
      ]
    },
    {
      id: 'day-mq-4',
      dayName: 'اليوم 4: أكتاف وترابيس وبطن',
      targetMuscleGroup: 'عضلات الأكتاف (الجانبي والأمامي والخلفي) والترابيس والبطن (Small: Shoulders/Abs 10-15 reps | Large: Traps 10-12 reps)',
      focusArea: 'الكتف الجانبي ثلاثي الأبعاد، الكتف الأمامي، الترابيس Traps، وعضلات البطن والكور Abs',
      estimatedMinutes: 65,
      completedToday: false,
      exercises: [
        {
          id: 'ex-mq-4-1',
          nameAr: 'دفع دمبل للأكتاف جالساً (Seated DB Shoulder Press)',
          nameEn: 'Seated Dumbbell Shoulder Press',
          primaryMuscle: 'الكتف الأمامي والشامل (Anterior Deltoids)',
          equipment: 'دمبل ومقعد 75-80 درجة',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          coachNotes: 'عضلة صغيرة: 3 مجموعات × 10-15 عدة. دفع قوي للأعلى ونزول هادئ لمستوى الأذنين.',
          executionCues: [
            'الجلوس بظهر مفرود ومسند على المقعد',
            'دفع الدمبلز للأعلى دون ملامسة في القمة',
            'نزول بطيء ومحكوم لحماية مفصل الكتف'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15', targetRpe: 8, restSeconds: 90, completed: false },
            { setNumber: 2, targetReps: '10-15', targetRpe: 8.5, restSeconds: 90, completed: false },
            { setNumber: 3, targetReps: '10-15', targetRpe: 9, restSeconds: 90, completed: false }
          ]
        },
        {
          id: 'ex-mq-4-2',
          nameAr: 'سوبر سيت الأكتاف ثلاثي الأبعاد: رفرفة جانبية بالدمبل + فيس بول بالكيبل والحبل',
          nameEn: 'DB Lateral Raises + Cable Face Pull (Super-Set)',
          primaryMuscle: 'الكتف الجانبي والكتف الخلفي (Lateral & Rear Delts)',
          equipment: 'دمبل + جهاز كيبل وحبل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          isSuperSet: true,
          superSetName: 'سوبر سيت الكتف ثلاثي الأبعاد 3D Delts 🔥',
          superSetNotes: 'عضلة صغيرة: 10-15 عدة رفرفة جانبية ثم مباشرة 10-15 عدة فيس بول بالحبل بدون راحة بينهما، ثم راحة 60 ثانية.',
          coachNotes: 'عضلة صغيرة: 10-15 عدة. القيادة بالأكواع وعصر الكتف الجانبي والخلفي.',
          executionCues: [
            'التمرين الأول: رفرفة جانبية 10-15 عدة بالكوعين بدون مرجحة',
            'الانتقال المباشر للفيس بول 10-15 عدة مع سحب الحبل باتجاه الجبهة وتدوير المعصمين للخارج',
            'عصر عضلات الكتف الخلفي وأعلى الظهر لثانية كاملة',
            'راحة 60 ثانية بعد إنهاء الزوج'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-15 + 10-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-15 + 10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-15 + 10-15', targetRpe: 9.5, restSeconds: 60, completed: false }
          ],
          superSetPair: {
            id: 'ex-mq-4-2-b',
            nameAr: 'فيس بول بالكيبل والحبل (Cable Face Pull)',
            nameEn: 'Cable Face Pull with Rope',
            primaryMuscle: 'الكتف الخلفي والمدورات والترابيس',
            equipment: 'كيبل وحبل',
            thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
            executionCues: ['سحب الحبل للوجه', 'فتح المرفقين للخارج'],
            sets: [
              { setNumber: 1, targetReps: '10-15', restSeconds: 60 },
              { setNumber: 2, targetReps: '10-15', restSeconds: 60 },
              { setNumber: 3, targetReps: '10-15', restSeconds: 60 }
            ]
          }
        },
        {
          id: 'ex-mq-4-3',
          nameAr: 'سوبر سيت الترابيس والبطن: ترابيس بالدمبل + طحن بطن بالكيبل',
          nameEn: 'DB Shrugs + Cable Crunch (Super-Set)',
          primaryMuscle: 'الترابيس (Large: 10-12) والبطن والكور (Small: 10-15)',
          equipment: 'دمبل ثقيل + جهاز كيبل وحبل',
          thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
          isSuperSet: true,
          superSetName: 'سوبر سيت قوة الترابيس والبطن الحديدية 🔥',
          superSetNotes: 'ترابيس (عضلة كبيرة: 10-12 عدة) + طحن بطن بالكيبل (عضلة صغيرة: 10-15 عدة) بدون راحة بينهما، ثم راحة 60 ثانية.',
          coachNotes: 'عضلة كبيرة ترابيس 10-12 عدة، بطن 10-15 عدة. رفع الكتفين للأعلى رأسياً دون لف المفصل.',
          executionCues: [
            'التمرين الأول: ترابيس بالدمبل 10-12 عدة مع عصر الترابيس ثانية في القمة',
            'الانتقال المباشر لطحن البطن بالكيبل (Cable Crunch) 10-15 عدة مع عصر عضلات البطن في الأسفل',
            'التحكم في العودة وعدم استخدام أسفل الظهر',
            'راحة 60 ثانية بعد إنهاء الزوج'
          ],
          sets: [
            { setNumber: 1, targetReps: '10-12 + 10-15', targetRpe: 8.5, restSeconds: 60, completed: false },
            { setNumber: 2, targetReps: '10-12 + 10-15', targetRpe: 9, restSeconds: 60, completed: false },
            { setNumber: 3, targetReps: '10-12 + 10-12', targetRpe: 9.5, restSeconds: 60, completed: false }
          ],
          superSetPair: {
            id: 'ex-mq-4-3-b',
            nameAr: 'طحن وشد البطن بالكيبل جاثياً (Cable Kneeling Crunch)',
            nameEn: 'Cable Kneeling Crunch',
            primaryMuscle: 'عضلات البطن الستة (Six-Pack Abs)',
            equipment: 'كيبل وحبل',
            thumbnailUrl: '/src/assets/images/exercise_gym_demo_1790515694928.jpg',
            executionCues: ['تقويس العمود الفقري وعصر البطن', 'ثبات الوركين'],
            sets: [
              { setNumber: 1, targetReps: '10-15', restSeconds: 60 },
              { setNumber: 2, targetReps: '10-15', restSeconds: 60 },
              { setNumber: 3, targetReps: '10-15', restSeconds: 60 }
            ]
          }
        }
      ]
    }
  ]
};
