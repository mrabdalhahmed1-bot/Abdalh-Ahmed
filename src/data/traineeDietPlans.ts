import { TraineeDietPlan, DietMealSection } from '../types/fitness';

/**
 * النظام الغذائي المخصص ليوسف جمال
 * حسب طلب الكوتش الدقيق بالجرامات:
 * - فطار: 5 بيضات كاملين + 200 طماطم + 200 فول مدمس + 100 جزر + 200 خيار
 * - سناك: 65 شوفان + 250 لبن + 30 فول سوداني + 100 موز
 * - الغدا: 200 رز بني او بسمتي + 150 صدور فراخ + 100 خيار + مخلل مالح
 * - بعد التمرين: 200 رز بني او بسمتي + 150 صدور فراخ + 100 خيار + 100 طماطم
 */
export const DIET_PLAN_YOUSSEF_GAMAL: TraineeDietPlan = {
  planType: 'standard',
  coachNotes: 'الخطة مصممة بالجرامات الدقيقة للحفاظ على الطاقة والبناء العضلي الصافي. يمكنك زيادة أو إنقاص الجرامات مع الحفاظ على نفس الأصناف.',
  standardMeals: [
    {
      id: 'youssef-breakfast',
      title: 'Breakfast',
      titleAr: 'وجبة الإفطار',
      totalCalories: 687,
      note: 'إفطار متكامل غني بالبروتين الكامل والدهون الصحية والألياف',
      foods: [
        {
          id: 'yf-b1',
          name: 'بيض كامل مسلوق أو مقلي بمسحة خفيفة',
          grams: 250,
          portion: '5 بيضات كاملين',
          calories: 360,
          protein: 31.5,
          carbs: 2,
          fat: 24.5,
          image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80',
          note: 'مصدر بروتين ممتاز كامل الأحماض الأمينية'
        },
        {
          id: 'yf-b2',
          name: 'فول مدمس مهروس مع كمون وليمون',
          grams: 200,
          portion: '200 غرام فول مدمس',
          calories: 220,
          protein: 15,
          carbs: 39,
          fat: 1.5,
          fiber: 10,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
          note: 'كارب معقد عالي الألياف لشبع مستدام'
        },
        {
          id: 'yf-b3',
          name: 'طماطم طازجة مقطعة',
          grams: 200,
          portion: '200 غرام طماطم',
          calories: 36,
          protein: 1.8,
          carbs: 7.8,
          fat: 0.4,
          fiber: 2.4,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
          note: 'غنية بالليكوبين ومضادات الأكسدة'
        },
        {
          id: 'yf-b4',
          name: 'خيار طازج شرائح',
          grams: 200,
          portion: '200 غرام خيار',
          calories: 30,
          protein: 1.3,
          carbs: 7.2,
          fat: 0.2,
          fiber: 1.2,
          image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&auto=format&fit=crop&q=80',
          note: 'ترطيب ومعادن أساسية'
        },
        {
          id: 'yf-b5',
          name: 'جزر طازج مقطع',
          grams: 100,
          portion: '100 غرام جزر',
          calories: 41,
          protein: 1,
          carbs: 10,
          fat: 0.2,
          fiber: 2.8,
          image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80',
          note: 'بيتا كاروتين وفيتامين A'
        }
      ]
    },
    {
      id: 'youssef-snack',
      title: 'Snack',
      titleAr: 'وجبة سناك الطاقة',
      totalCalories: 656,
      note: 'مزيج مثالي قبل التمرين بـ 60-90 دقيقة لشحن مخازن الجليكوجين',
      foods: [
        {
          id: 'yf-s1',
          name: 'شوفان حبة كاملة',
          grams: 65,
          portion: '65 غرام شوفان',
          calories: 247,
          protein: 8.8,
          carbs: 42.9,
          fat: 4.5,
          fiber: 6.8,
          image: 'https://images.unsplash.com/photo-1517093709142-3e7cf5e80d44?w=500&auto=format&fit=crop&q=80',
          note: 'كارب بطيء الامتصاص لطاقة مستقرة'
        },
        {
          id: 'yf-s2',
          name: 'حليب / لبن طبيعي طازج',
          grams: 250,
          portion: '250 مل لبن',
          calories: 150,
          protein: 8,
          carbs: 12,
          fat: 8,
          image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80',
          note: 'بروتين الكازين والكالسيوم'
        },
        {
          id: 'yf-s3',
          name: 'فول سوداني محمص غير مملح',
          grams: 30,
          portion: '30 غرام فول سوداني',
          calories: 170,
          protein: 7.8,
          carbs: 4.8,
          fat: 14.8,
          fiber: 2.5,
          image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=500&auto=format&fit=crop&q=80',
          note: 'دهون غير مشبعة تعزز إنتاج التستوستيرون'
        },
        {
          id: 'yf-s4',
          name: 'موز طازج',
          grams: 100,
          portion: '100 غرام موز (1 حبة متوسطة)',
          calories: 89,
          protein: 1.1,
          carbs: 23,
          fat: 0.3,
          fiber: 2.6,
          image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
          note: 'بوتاسيوم لمنع الشد العضلي وضخ الدم'
        }
      ]
    },
    {
      id: 'youssef-lunch',
      title: 'Lunch',
      titleAr: 'وجبة الغداء',
      totalCalories: 512,
      note: 'وجبة غداء نظيفة لدعم الاستشفاء والأداء البدني',
      foods: [
        {
          id: 'yf-l1',
          name: 'أرز بني أو بسمتي مطبوخ',
          grams: 200,
          portion: '200 غرام رز بني أو بسمتي',
          calories: 240,
          protein: 5.3,
          carbs: 52,
          fat: 1.6,
          fiber: 3.5,
          image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80',
          note: 'مصدر كارب نظيف وسهل الهضم'
        },
        {
          id: 'yf-l2',
          name: 'صدور دجاج مشوية خالية من الجلد',
          grams: 150,
          portion: '150 غرام صدور فراخ',
          calories: 247,
          protein: 46.5,
          carbs: 0,
          fat: 5.4,
          image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80',
          note: 'بروتين نقي لدعم البناء والتعافي'
        },
        {
          id: 'yf-l3',
          name: 'خيار طازج',
          grams: 100,
          portion: '100 غرام خيار',
          calories: 15,
          protein: 0.7,
          carbs: 3.6,
          fat: 0.1,
          image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&auto=format&fit=crop&q=80',
          note: 'ترطيب وألياف'
        },
        {
          id: 'yf-l4',
          name: 'مخلل مالح خفيف لمعادلة الصوديوم',
          grams: 30,
          portion: 'مخلل مالح خفيف',
          calories: 10,
          protein: 0.5,
          carbs: 2,
          fat: 0.1,
          image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
          note: 'صوديوم متوازن لضبط ضغط وضخ الدم أثناء التمرين'
        }
      ]
    },
    {
      id: 'youssef-post-workout',
      title: 'Post Workout',
      titleAr: 'وجبة ما بعد التمرين',
      totalCalories: 520,
      note: 'إعادة بناء الألياف العضلية وتجديد الجليكوجين فور الانتهاء من الحصة',
      foods: [
        {
          id: 'yf-pw1',
          name: 'أرز بني أو بسمتي مطبوخ',
          grams: 200,
          portion: '200 غرام رز بني أو بسمتي',
          calories: 240,
          protein: 5.3,
          carbs: 52,
          fat: 1.6,
          fiber: 3.5,
          image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80',
          note: 'تغذية العضلات بالكارب بعد الإجهاد'
        },
        {
          id: 'yf-pw2',
          name: 'صدور دجاج مشوية متبلة',
          grams: 150,
          portion: '150 غرام صدور فراخ',
          calories: 247,
          protein: 46.5,
          carbs: 0,
          fat: 5.4,
          image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80',
          note: 'تخليق بروتيني سريع'
        },
        {
          id: 'yf-pw3',
          name: 'خيار طازج',
          grams: 100,
          portion: '100 غرام خيار',
          calories: 15,
          protein: 0.7,
          carbs: 3.6,
          fat: 0.1,
          image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&auto=format&fit=crop&q=80',
          note: 'ترطيب وإنعاش'
        },
        {
          id: 'yf-pw4',
          name: 'طماطم طازجة',
          grams: 100,
          portion: '100 غرام طماطم',
          calories: 18,
          protein: 0.9,
          carbs: 3.9,
          fat: 0.2,
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
          note: 'فيتامين C وأملاح معدنية'
        }
      ]
    }
  ]
};

/**
 * النظام الغذائي لمحمد قاسم (نظام الكارب سايكل Carb Cycling)
 * يوم للكارب العالي ويوم للكارب القليل بدقة الجرامات المطلوبة:
 * - الوجبة الأولى: 65 شوفان + 5 بياض بيض + 2 بيضة كاملين + معلقتين زبدة فول سوداني (32غ) + 30 عسل
 * - الوجبة الثانية: (300 مكرونة في العالي / 200 في القليل) + 150 صدور فراخ + 100 كوسة
 * - الوجبة الثالثة: (300 رز بسمتي أو بني في العالي / 200 في القليل) + 150 لحمة + 100 خيار
 * - الوجبة الرابعة: 300 رز أبيض + 200 صدور فراخ + 100 جزر + 50 بقدونس
 */
export const DIET_PLAN_MOHAMED_QASIM: TraineeDietPlan = {
  planType: 'carb_cycling',
  defaultDayType: 'high',
  coachNotes: 'نظام تدوير الكارب المتقدم (Carb Cycling): يتم تطبيق يوم الكارب العالي في أيام التدريب الشديدة (أرجل / ظهر) ويوم الكارب المنخفض في أيام الراحة أو التدريب الخفيف لحرق الدهون مع الاحتفاظ بالقوة.',
  highCarbDay: {
    title: 'يوم الكارب العالي (High Carb Day)',
    description: 'مخصص لأيام التمارين القوية لدعم امتلاء الجليكوجين وزيادة الطاقة والقوة الانفجارية.',
    targetMacros: {
      calories: 2889,
      protein: 230,
      carbs: 342,
      fat: 64
    },
    meals: [
      {
        id: 'mq-high-m1',
        title: 'Meal 1',
        titleAr: 'الوجبة الأولى (إفطار البطل)',
        totalCalories: 757,
        note: 'وجبة الصباح المتكاملة: طاقة فورية ودهون صحية وبناء عضلي',
        foods: [
          {
            id: 'mq-h-1-1',
            name: 'شوفان حبة كاملة',
            grams: 65,
            portion: '65 غرام شوفان',
            calories: 247,
            protein: 8.8,
            carbs: 42.9,
            fat: 4.5,
            image: 'https://images.unsplash.com/photo-1517093709142-3e7cf5e80d44?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-1-2',
            name: 'بياض بيض نقي',
            grams: 165,
            portion: '5 بياض بيض',
            calories: 85,
            protein: 18,
            carbs: 1,
            fat: 0.3,
            image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-1-3',
            name: 'بيض كامل طبيعي',
            grams: 100,
            portion: '2 بيضة كاملين',
            calories: 144,
            protein: 12.6,
            carbs: 0.8,
            fat: 9.8,
            image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-1-4',
            name: 'زبدة فول سوداني طبيعية 100%',
            grams: 32,
            portion: 'معلقتين زبدة فول سوداني (32 غرام)',
            calories: 190,
            protein: 8,
            carbs: 6,
            fat: 16,
            image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-1-5',
            name: 'عسل نحل طبيعي نقي',
            grams: 30,
            portion: '30 غرام عسل',
            calories: 91,
            protein: 0.1,
            carbs: 24.6,
            fat: 0,
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80'
          }
        ]
      },
      {
        id: 'mq-high-m2',
        title: 'Meal 2',
        titleAr: 'الوجبة الثانية (غداء المكرونة والدجاج)',
        totalCalories: 678,
        note: 'كارب عالي من المكرونة لدعم التدريب مع بروتين الدجاج الصافي',
        foods: [
          {
            id: 'mq-h-2-1',
            name: 'مكرونة مسلوقة (قمح كامل أو كلاسيكية)',
            grams: 300,
            portion: '300 غرام مكرونة مطبوخة',
            calories: 414,
            protein: 15,
            carbs: 84,
            fat: 2.1,
            image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-2-2',
            name: 'صدور دجاج مشوية متبلة',
            grams: 150,
            portion: '150 غرام صدور فراخ',
            calories: 247,
            protein: 46.5,
            carbs: 0,
            fat: 5.4,
            image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-2-3',
            name: 'كوسة مطبوخة / مشوية على البخار',
            grams: 100,
            portion: '100 غرام كوسة',
            calories: 17,
            protein: 1.2,
            carbs: 3.1,
            fat: 0.3,
            image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=500&auto=format&fit=crop&q=80'
          }
        ]
      },
      {
        id: 'mq-high-m3',
        title: 'Meal 3',
        titleAr: 'الوجبة الثالثة (أرز ولحم بقري صافي)',
        totalCalories: 675,
        note: 'لحم بقري غني بالزنك والحديد والكرياتين الطبيعي مع أرز بسمتي',
        foods: [
          {
            id: 'mq-h-3-1',
            name: 'أرز بسمتي أو بني مطبوخ',
            grams: 300,
            portion: '300 غرام رز بسمتي أو بني',
            calories: 360,
            protein: 8,
            carbs: 78,
            fat: 2.5,
            image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-3-2',
            name: 'لحمة حمراء صافية مشوية / مفرومة قليلة الدهن',
            grams: 150,
            portion: '150 غرام لحمة',
            calories: 300,
            protein: 39,
            carbs: 0,
            fat: 15,
            image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-3-3',
            name: 'خيار طازج شرائح',
            grams: 100,
            portion: '100 غرام خيار',
            calories: 15,
            protein: 0.7,
            carbs: 3.6,
            fat: 0.1,
            image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&auto=format&fit=crop&q=80'
          }
        ]
      },
      {
        id: 'mq-high-m4',
        title: 'Meal 4',
        titleAr: 'الوجبة الرابعة (أرز أبيض ودجاج مضاعف)',
        totalCalories: 779,
        note: 'وجبة عشاء غنية بـ 200غ صدور دجاج وأرز أبيض سريع الهضم',
        foods: [
          {
            id: 'mq-h-4-1',
            name: 'أرز أبيض مطبوخ سهل الامتصاص',
            grams: 300,
            portion: '300 غرام رز أبيض',
            calories: 390,
            protein: 8.1,
            carbs: 85.5,
            fat: 0.9,
            image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-4-2',
            name: 'صدور دجاج مشوية طرية',
            grams: 200,
            portion: '200 غرام صدور فراخ',
            calories: 330,
            protein: 62,
            carbs: 0,
            fat: 7.2,
            image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-4-3',
            name: 'جزر طازج مبشور أو شرائح',
            grams: 100,
            portion: '100 غرام جزر',
            calories: 41,
            protein: 1,
            carbs: 10,
            fat: 0.2,
            image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-h-4-4',
            name: 'بقدونس طازج مفروم',
            grams: 50,
            portion: '50 غرام بقدونس',
            calories: 18,
            protein: 1.5,
            carbs: 3.2,
            fat: 0.4,
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  },
  lowCarbDay: {
    title: 'يوم الكارب المنخفض (Low Carb Day)',
    description: 'يوم تقليل الكربوهيدرات لحث الجسم على حرق الدهون المخزنة مع ثبات الكتلة العضلية تماماً.',
    targetMacros: {
      calories: 2631,
      protein: 223,
      carbs: 288,
      fat: 63
    },
    meals: [
      {
        id: 'mq-low-m1',
        title: 'Meal 1',
        titleAr: 'الوجبة الأولى (إفطار البطل)',
        totalCalories: 757,
        note: 'نفس تركيبة الإفطار لحماية القوة العضلية والنشاط الذهني',
        foods: [
          {
            id: 'mq-l-1-1',
            name: 'شوفان حبة كاملة',
            grams: 65,
            portion: '65 غرام شوفان',
            calories: 247,
            protein: 8.8,
            carbs: 42.9,
            fat: 4.5,
            image: 'https://images.unsplash.com/photo-1517093709142-3e7cf5e80d44?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-1-2',
            name: 'بياض بيض نقي',
            grams: 165,
            portion: '5 بياض بيض',
            calories: 85,
            protein: 18,
            carbs: 1,
            fat: 0.3,
            image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-1-3',
            name: 'بيض كامل طبيعي',
            grams: 100,
            portion: '2 بيضة كاملين',
            calories: 144,
            protein: 12.6,
            carbs: 0.8,
            fat: 9.8,
            image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-1-4',
            name: 'زبدة فول سوداني طبيعية',
            grams: 32,
            portion: 'معلقتين زبدة فول سوداني (32 غرام)',
            calories: 190,
            protein: 8,
            carbs: 6,
            fat: 16,
            image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-1-5',
            name: 'عسل نحل طبيعي نقي',
            grams: 30,
            portion: '30 غرام عسل',
            calories: 91,
            protein: 0.1,
            carbs: 24.6,
            fat: 0,
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80'
          }
        ]
      },
      {
        id: 'mq-low-m2',
        title: 'Meal 2',
        titleAr: 'الوجبة الثانية (تقليل الكارب: 200غ مكرونة)',
        totalCalories: 540,
        note: 'تم تقليص المكرونة من 300غ إلى 200غ لخلق العجز السعري المطلوب',
        foods: [
          {
            id: 'mq-l-2-1',
            name: 'مكرونة مسلوقة (مخفضة)',
            grams: 200,
            portion: '200 غرام مكرونة مطبوخة',
            calories: 276,
            protein: 10,
            carbs: 56,
            fat: 1.4,
            image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-2-2',
            name: 'صدور دجاج مشوية متبلة',
            grams: 150,
            portion: '150 غرام صدور فراخ',
            calories: 247,
            protein: 46.5,
            carbs: 0,
            fat: 5.4,
            image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-2-3',
            name: 'كوسة مطبوخة سوتيه',
            grams: 100,
            portion: '100 غرام كوسة',
            calories: 17,
            protein: 1.2,
            carbs: 3.1,
            fat: 0.3,
            image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=500&auto=format&fit=crop&q=80'
          }
        ]
      },
      {
        id: 'mq-low-m3',
        title: 'Meal 3',
        titleAr: 'الوجبة الثالثة (تقليل الكارب: 200غ أرز ولحم)',
        totalCalories: 555,
        note: 'تم تقليص الأرز من 300غ إلى 200غ مع ثبات 150غ لحمة وخيار',
        foods: [
          {
            id: 'mq-l-3-1',
            name: 'أرز بسمتي أو بني مطبوخ (مخفض)',
            grams: 200,
            portion: '200 غرام رز بسمتي أو بني',
            calories: 240,
            protein: 5.3,
            carbs: 52,
            fat: 1.6,
            image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-3-2',
            name: 'لحمة حمراء صافية مشوية قليلة الدهن',
            grams: 150,
            portion: '150 غرام لحمة',
            calories: 300,
            protein: 39,
            carbs: 0,
            fat: 15,
            image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-3-3',
            name: 'خيار طازج شرائح',
            grams: 100,
            portion: '100 غرام خيار',
            calories: 15,
            protein: 0.7,
            carbs: 3.6,
            fat: 0.1,
            image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&auto=format&fit=crop&q=80'
          }
        ]
      },
      {
        id: 'mq-low-m4',
        title: 'Meal 4',
        titleAr: 'الوجبة الرابعة (أرز أبيض ودجاج مضاعف)',
        totalCalories: 779,
        note: 'نفس الوجبة الرابعة بالكامل لضمان استشفاء ليلي عميق',
        foods: [
          {
            id: 'mq-l-4-1',
            name: 'أرز أبيض مطبوخ',
            grams: 300,
            portion: '300 غرام رز أبيض',
            calories: 390,
            protein: 8.1,
            carbs: 85.5,
            fat: 0.9,
            image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-4-2',
            name: 'صدور دجاج مشوية طرية',
            grams: 200,
            portion: '200 غرام صدور فراخ',
            calories: 330,
            protein: 62,
            carbs: 0,
            fat: 7.2,
            image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-4-3',
            name: 'جزر طازج',
            grams: 100,
            portion: '100 غرام جزر',
            calories: 41,
            protein: 1,
            carbs: 10,
            fat: 0.2,
            image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80'
          },
          {
            id: 'mq-l-4-4',
            name: 'بقدونس طازج مفروم',
            grams: 50,
            portion: '50 غرام بقدونس',
            calories: 18,
            protein: 1.5,
            carbs: 3.2,
            fat: 0.4,
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
          }
        ]
      }
    ]
  }
};
