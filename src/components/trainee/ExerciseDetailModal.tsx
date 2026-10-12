import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Check, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  Info, 
  ShieldAlert, 
  Dumbbell, 
  CheckCircle2,
  Clock,
  Volume2
} from 'lucide-react';

interface SetData {
  setNumber: number;
  targetReps: number;
  targetWeightKg?: number;
  actualReps?: number;
  actualWeight?: number;
  completed: boolean;
  restSeconds: number;
}

interface ExerciseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    id: string;
    nameAr: string;
    nameEn: string;
    targetSets: number;
    targetReps: string | number;
    rpeTarget: number;
    restSeconds: number;
    tempo: string;
    equipment: string;
    videoUrl?: string;
    notes?: string;
    sets: SetData[];
  };
  setInputs: Record<string, { weight: string; reps: string }>;
  onWeightChange: (setNumber: number, val: string) => void;
  onRepsChange: (setNumber: number, val: string) => void;
  onSaveSet: (setNumber: number, defaultReps: string | number, defaultWeight: number, restSec: number) => void;
  onToggleSet: (setNumber: number) => void;
  onOpenSwap: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  isOpen,
  onClose,
  exercise,
  setInputs,
  onWeightChange,
  onRepsChange,
  onSaveSet,
  onToggleSet,
  onOpenSwap
}) => {
  const [viewMode, setViewMode] = useState<'video' | 'cues'>('video');

  if (!isOpen) return null;

  // Verified HD 10-15s concise technique video mappings (direct action without intro/talking)
  const getExerciseVideoDetails = () => {
    const text = `${exercise.id} ${exercise.nameAr} ${exercise.nameEn}`.toLowerCase();
    
    if (text.includes('pec deck') || text.includes('butterfly') || text.includes('فراشة')) {
      return {
        ytId: 'Z5889KqB06U',
        start: 10,
        formNotes: 'تثبيت انثناء خفيف في الأكواع، عصر عضلات الصدر في المنتصف لثانية كاملة، وتفادي تقديم الأكتاف للأمام'
      };
    }
    if (text.includes('rear delt') || text.includes('خلفي')) {
      return {
        ytId: 'EA7uJyZSZPU',
        start: 8,
        formNotes: 'الانحناء للأمام مع الحفاظ على استقامة الظهر، رفع الدمبل بالكوعين للأعلى لعزل الكتف الخلفي'
      };
    }
    if (text.includes('hammer') || text.includes('شاكوش')) {
      return {
        ytId: 'zC3nLlEvin4',
        start: 8,
        formNotes: 'مسكة محايدة عمودية كالمطرقة، ثبات المرفقين تماماً، ورفع الدمبل لعصر عضلة البراكين والساعد'
      };
    }
    if (text.includes('hack squat') || text.includes('هاك')) {
      return {
        ytId: '0tn5K9NlCfo',
        start: 10,
        formNotes: 'إسناد الظهر بالكامل على الوسادة، النزول لزاوية 90 درجة مع دفع قوي بكعبي القدمين'
      };
    }
    if (text.includes('calf') || text.includes('calves') || text.includes('سمانة')) {
      return {
        ytId: 'N3awlEyY980',
        start: 8,
        formNotes: 'مدى حركي كامل للسمانة مع ثبات ثانية في القمة وأقصى إطالة في القاع'
      };
    }
    if (text.includes('leg extension') || text.includes('فرد أرجل')) {
      return {
        ytId: 'YyvSfVjQeL0',
        start: 8,
        formNotes: 'ضبط وسادة الجهاز فوق الكاحل، رفع الساقين للأعلى وعصر الفخذ الأمامي لثانية، ونزول بطيء'
      };
    }
    if (text.includes('leg curl') || text.includes('ثني أرجل')) {
      return {
        ytId: 'ELOCsoDSmrg',
        start: 8,
        formNotes: 'تثبيت الحوض على المسند، ثني الركبتين وسحب الوسادة نحو المؤخرة مع تحكم في النزول السلبي'
      };
    }
    if (text.includes('leg press') || text.includes('ضغط أرجل')) {
      return {
        ytId: 'IZxyjW7MPJQ',
        start: 10,
        formNotes: 'القدمين بعرض الكتفين بمنتصف المنصة، نزول عميق محكوم ودفع دون إقفال مفاصل الركبة'
      };
    }
    if (text.includes('bench') || text.includes('flat')) {
      return {
        ytId: 'SCVCLChPQFY',
        start: 12,
        formNotes: 'تثبيت لوحي الكتف للخلف، نزول محكوم في ثانيتين، ودفع انفجاري بالصدر دون قفل الكوع مفرطاً'
      };
    }
    if (text.includes('incline')) {
      return {
        ytId: '8iPEnn-ltC8',
        start: 10,
        formNotes: 'زاوية مقعد 30 درجة، الأكواع بزاوية 60 درجة من الجذع، مع عصر الصدر العلوي في القمة'
      };
    }
    if (text.includes('lateral') || text.includes('raise')) {
      return {
        ytId: '3VcKaXpzqRo',
        start: 8,
        formNotes: 'رفع الدمبل بالكوع مع ميلان خفيف للأمام، والنزول البطيء لعزل الكتف الجانبي'
      };
    }
    if (text.includes('triceps') || text.includes('pushdown')) {
      return {
        ytId: 'vB5OHsJ3EME',
        start: 14,
        formNotes: 'تثبيت الكوعين بجانب الأضلاع، والضغط لأسفل مع فتح الحبل لعصر الرأس الطويل'
      };
    }
    if (text.includes('squat')) {
      return {
        ytId: 'bEv6CCg2BC8',
        start: 10,
        formNotes: 'فتح الصدر، ثبات باطن القدمين، النزول المتوازي مع شد عضلات البطن Core'
      };
    }
    if (text.includes('row')) {
      return {
        ytId: '6FZHJGzMFEc',
        start: 8,
        formNotes: 'انحناء الحوض بزاوية 45 درجة، سحب البار نحو السرة مع عصر لوحي الكتف'
      };
    }
    if (text.includes('pulldown')) {
      return {
        ytId: 'CAwf7n6Luuc',
        start: 12,
        formNotes: 'قبضة واسعة مع إمالة الصدر للخلف قليلاً، وسحب الأكواع نحو الأضلاع لأسفل'
      };
    }
    if (text.includes('bicep') || text.includes('curl')) {
      return {
        ytId: 'soxrZlIl35U',
        start: 8,
        formNotes: 'تثبيت المرفق بالكامل، الدوران الخارجي للرسغ (Supination) وعصر الباي في القمة'
      };
    }
    if (text.includes('deadlift') || text.includes('rdl')) {
      return {
        ytId: '_oyxCn2iSjU',
        start: 10,
        formNotes: 'دفع الحوض للخلف مع انثناء ركبة خفيف، ثبات الظهر واستشعار التمدد في الفخذ الخلفي'
      };
    }
    if (text.includes('shoulder press')) {
      return {
        ytId: 'qEwKCR5JCog',
        start: 10,
        formNotes: 'دفع عمودي بتحكم دون تقويس أسفل الظهر، ونزول الدمبل لمستوى الأذنين'
      };
    }

    return {
      ytId: 'SCVCLChPQFY',
      start: 10,
      formNotes: 'تأدية المدى الحركي الكامل بتركيز عالٍ مع ضبط سرعة النزول (Tempo 2-0-1)'
    };
  };

  const videoData = getExerciseVideoDetails();
  const completedCount = exercise.sets.filter(s => s.completed).length;
  const isFullyDone = completedCount === exercise.sets.length;
  const [videoKey, setVideoKey] = useState(0);

  const getExerciseCustomTips = (): Array<{ title: string; desc: string }> => {
    const text = `${exercise.id} ${exercise.nameAr} ${exercise.nameEn}`.toLowerCase();

    if (text.includes('bench') || text.includes('flat')) {
      return [
        {
          title: 'تثبيت القاعدة ولوحي الكتف (Scapular Retraction):',
          desc: 'اسحب لوحي الكتف للخلف والأسفل واغرس كعبي قدميك في الأرض بقوة لتوظيف الدفع الأرضي Leg Drive.'
        },
        {
          title: 'مسار البار وزاوية الأكواع (Elbow Angle):',
          desc: 'المس أسفل عظمة القص، وحافظ على زاوية أكواع 70-75 درجة لتفادي احتكاك أوتار الكتف وتفجير ألياف الصدر.'
        },
        {
          title: 'قفل الكوع والتنفس السليم:',
          desc: 'احبس نفسك أثناء النزول المحكوم في ثانيتين، وازفر في الثلث الأخير من الدفع بدون قفل مفصل الكوع بالكامل.'
        }
      ];
    }
    if (text.includes('incline')) {
      return [
        {
          title: 'زاوية مسند المقعد المثالية (30°):',
          desc: 'اضبط المقعد على زاوية 30 درجة لتركيز الحمل الأقصى على ألياف الصدر العلوي Clavicular Head بدون تحويله لتمرين كتف.'
        },
        {
          title: 'مسار الدمبل المقوس (Arc Motion):',
          desc: 'انزل بالدمبلز بمحاذاة الصدر العلوي، ثم ادفع في مسار هلالي خفيف للأعلى دون صدم الأوزان في القمة.'
        },
        {
          title: 'التحكم بالنزول السلبي (3s Eccentric):',
          desc: 'انزل في 3 ثوانٍ بطيئة لاستثارة أكبر قدر من الألياف العضلية وضمان ثبات المفصل.'
        }
      ];
    }
    if (text.includes('lateral') || text.includes('raise')) {
      return [
        {
          title: 'قيادة الرفع بالمرفقين (Lead with Elbows):',
          desc: 'ارفع الدمبلز بأكواعك وليس بمعصمك، مع ميلان طفيف للجذع للأمام بمقدار 5 درجات لتفعيل الرأس الجانبي.'
        },
        {
          title: 'إلغاء الترابيس العلوية (Depress Traps):',
          desc: 'اخفض كتفيك بعيداً عن أذنيك وتوقف بمجرد وصول المرفق لمستوى الكتف لعزل الكتف الجانبي 100%.'
        },
        {
          title: 'منع الزخم والتأرجح (No Momentum):',
          desc: 'ثبّت ركبتيك وجذعك تماماً وتجنب النتر لضمان وصول التحفيز للألياف العضلية المستهدفة.'
        }
      ];
    }
    if (text.includes('triceps') || text.includes('pushdown')) {
      return [
        {
          title: 'تثبيت المرفقين بجانب الأضلاع:',
          desc: 'ألصق مرفقيك بجانبيك تماماً ولا تدعهما يتحركان للأمام أو الخلف أثناء الدفع أو الصعود.'
        },
        {
          title: 'فتح الحبل في أسفل الحركة:',
          desc: 'عند النزول الكامل، باعد طرفي الحبل للخارج واضغط بقوة لعصر الرؤوس الثلاثة لعضلة الترايسبس.'
        },
        {
          title: 'المدى الحركي الكامل في الصعود:',
          desc: 'دع الساعدين يصعدان حتى زاوية 90 درجة مع الحفاظ على التوتر المستمر في العضلة.'
        }
      ];
    }
    if (text.includes('squat')) {
      return [
        {
          title: 'حبس النفس والضغط البطني (Bracing):',
          desc: 'خذ نفساً بطنياً عميقاً واحبسه كأنك تستعد لضربة، لتكوين أسطوانة هوائية تحمي فقراتك القطنية.'
        },
        {
          title: 'مسار الركبتين وثبات القدم:',
          desc: 'ادفع ركبتيك للخارج في اتجاه أصابع القدمين، وتأكد من ثبات القدم كقاعدة ثلاثية Tri-pod.'
        },
        {
          title: 'عمق النزول المتوازي والانفجار:',
          desc: 'انزل حتى يوازي مفصل الفخذ ركبتيك، ثم ادفع من منتصف القدم بقوة للأعلى.'
        }
      ];
    }
    if (text.includes('deadlift') || text.includes('rdl')) {
      return [
        {
          title: 'مفصلة الحوض للخلف (Hip Hinge):',
          desc: 'الحركة تبدأ بدفع المؤخرة للخلف مع ثبات انثناء الركبة البسيط، والنزول بمفصل الحوض فقط.'
        },
        {
          title: 'التصاق البار بالساقين:',
          desc: 'أبقِ الوزن ملاصقاً لقدميك أثناء النزول والصعود لحماية أسفل الظهر من عزم الدوران الزائد.'
        },
        {
          title: 'عصر عضلات الهامسترينغ والمؤخرة:',
          desc: 'توقف فور استشعار أقصى استطالة خلفية، وادفع الحوض للأمام مع عصر العضلات في القمة.'
        }
      ];
    }
    if (text.includes('row')) {
      return [
        {
          title: 'زاوية الجذع واستقامة العمود الفقري:',
          desc: 'اثبت بزاوية ميلان 45 درجة مع ظهر مستقيم، واسحب البار باتجاه السرة وعصر لوحي الكتف معاً.'
        },
        {
          title: 'سحب المرفقين للخلف:',
          desc: 'قد الحركة بمرفقيك متخيلًا سحبهما لجيوب بنطالك الخلفية لعزل اللاتس والظهر الأوسط.'
        },
        {
          title: 'ثبات الرقبة أثناء الرفع:',
          desc: 'انظر للأمام والأسفل وحافظ على رقبتك في خط مستقيم مع عمودك الفقري.'
        }
      ];
    }
    if (text.includes('pulldown')) {
      return [
        {
          title: 'بدء الحركة بإسقاط لوحي الكتف:',
          desc: 'قبل ثني المرفق، أسقط لوحي كتفك لأسفل، ثم اسحب البار بالأكواع نحو الصدر العلوي.'
        },
        {
          title: 'الصدر للأعلى والميلان الخفيف:',
          desc: 'ابرز قفصك الصدري للأعلى مع ميلان 10 درجات خفيفة للخلف، وتجنب التأرجح العنيف بالجسم.'
        },
        {
          title: 'التمدد الكامل بالأعلى:',
          desc: 'اسمح لعضلات اللاتس بالتمدد الكامل في نهاية كل تكرار مع التحكم الكامل بالوزن.'
        }
      ];
    }
    if (text.includes('bicep') || text.includes('curl')) {
      return [
        {
          title: 'عزل تام للمرفقين:',
          desc: 'ثبّت مرفقيك بجانبك أو للخلف ولا ترفعهما للأمام حتى لا تتدخل عضلات الكتف الأمامي.'
        },
        {
          title: 'دوران الرسغ الخارجي (Supination):',
          desc: 'لف راحة يدك للخارج أثناء الصعود واضغط بقوة في القمة لمدة ثانية لعصر قمة البايسبس.'
        },
        {
          title: 'النزول البطيء المتحكم به:',
          desc: 'انزل بالوزن ببطء في ثانيتين حتى الامتداد الكامل للذراع لتفعيل ألياف الباي الطويلة.'
        }
      ];
    }
    if (text.includes('shoulder press')) {
      return [
        {
          title: 'زاوية الدفع الآمنة (Scapular Plane):',
          desc: 'ادفع الدمبلز بزاوية أكواع 60 درجة من الجسم وتجنب فتحها للوراء بزاوية 90 لتفادي تمزق الأوتار.'
        },
        {
          title: 'ثبات الظهر وأسفل العمود الفقري:',
          desc: 'ألصق أسفل ظهرك بالمسند واشد عضلات بطنك لمنع أي تقوس خطير أثناء رفع الأوزان الثقيلة.'
        },
        {
          title: 'النزول لمستوى الأذنين فقط:',
          desc: 'انزل بالوزن حتى مستوى الأذنين بتحكم كامل، ثم ادفع عمودياً دون قفل المرفقين في القمة.'
        }
      ];
    }

    return [
      {
        title: 'المدى الحركي الكامل المدروس (Full ROM):',
        desc: 'أدّ الحركة بمدى حركي كامل دون إنقاص المدى لضمان تحفيز جميع الألياف العضلية المستهدفة.'
      },
      {
        title: 'التحكم في سرعة الإيقاع (Tempo 2-0-1):',
        desc: 'النزول السلبي في ثانيتين محكومتين والصعود الانفجاري المنضبط في ثانية واحدة مع ثبات كامل.'
      },
      {
        title: 'التنفس وثبات عضلات الجذع (Core):',
        desc: 'خذ شهيقاً أثناء الهبوط وازفر مع دفع الوزن مع شد عضلات البطن لحماية المفاصل.'
      }
    ];
  };

  const customTips = getExerciseCustomTips();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 border border-neutral-800 my-6">
        
        {/* Top Header - Pure Professional English Name */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
                {exercise.nameEn || exercise.nameAr}
              </h3>
              {isFullyDone && (
                <span className="p-1 rounded-md bg-emerald-500 text-neutral-950">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">{exercise.equipment}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSwap}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="استبدال هذا التمرين وكتابة السبب"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استبدال</span>
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Box - Pure Technique Demonstration */}
        <div className="relative w-full aspect-video bg-black border-b border-neutral-800 overflow-hidden">
          <iframe
            key={videoKey}
            src={`https://www.youtube-nocookie.com/embed/${videoData.ytId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${videoData.ytId}&playsinline=1&rel=0&modestbranding=1`}
            title={`تكنيك تمرين ${exercise.nameEn}`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="eager"
          />
        </div>

        {/* Scrollable Content (Tips & Inside Logging) */}
        <div className="p-4 sm:p-5 space-y-5 max-h-[55vh] overflow-y-auto">
          
          {/* Coach's Proper Form & Safety Tips - Tailored to this exact exercise */}
          <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-black text-white">إرشادات الكوتش لتكنيك تمرين {exercise.nameEn}:</h4>
            </div>

            <ul className="space-y-2.5 text-xs text-neutral-300 pr-1">
              {customTips.map((tip, tIdx) => (
                <li key={tIdx} className="leading-relaxed bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800/80">
                  <strong className="text-emerald-400 block mb-0.5">{tip.title}</strong>
                  <span className="text-neutral-300">{tip.desc}</span>
                </li>
              ))}
            </ul>

            {exercise.notes && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                <strong>ملاحظة الكوتش المخصصة:</strong> {exercise.notes}
              </div>
            )}
          </div>

          {/* Direct Inside-Modal Weight & Reps Logging (تسجيل الأوزان والتكرارات من داخل التمرين) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-white">تسجيل الجولات من داخل التمرين</h4>
                <p className="text-[10px] text-neutral-400">سجل وزنك الفعلي وتكرارك وسيتم حفظه فورياً</p>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                isFullyDone
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}>
                {completedCount} / {exercise.sets.length} جولات مكتملة
              </span>
            </div>

            {/* Sets Table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[10px] font-bold text-neutral-400 px-2">
                <span className="col-span-2">الجولة</span>
                <span className="col-span-3 text-center">الوزن الفعلي (كغ)</span>
                <span className="col-span-3 text-center">التكرارات</span>
                <span className="col-span-4 text-center">التسجيل</span>
              </div>

              {exercise.sets.map((set) => {
                const setKey = `${exercise.id}-${set.setNumber}`;
                const currentWeightVal = setInputs[setKey]?.weight !== undefined 
                  ? setInputs[setKey].weight 
                  : (set.actualWeight ? set.actualWeight.toString() : '');
                const currentRepsVal = setInputs[setKey]?.reps !== undefined 
                  ? setInputs[setKey].reps 
                  : (set.actualReps ? set.actualReps.toString() : (set.targetReps ? set.targetReps.toString() : ''));

                return (
                  <div
                    key={set.setNumber}
                    className={`grid grid-cols-12 items-center p-2.5 rounded-xl text-xs transition-colors border ${
                      set.completed 
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                        : 'bg-neutral-950 border-neutral-800 text-neutral-200'
                    }`}
                  >
                    {/* Set Number */}
                    <span className="col-span-2 font-black text-neutral-300 flex items-center gap-1">
                      {set.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-neutral-500 font-mono">#{set.setNumber}</span>
                      )}
                    </span>

                    {/* Weight Input */}
                    <div className="col-span-3 px-1">
                      <input
                        type="number"
                        step="0.5"
                        value={currentWeightVal}
                        onChange={(e) => onWeightChange(set.setNumber, e.target.value)}
                        disabled={set.completed}
                        placeholder={set.actualWeight ? `${set.actualWeight}` : "كغ"}
                        className={`w-full py-1.5 px-2 rounded-lg text-center font-mono font-bold text-xs border outline-none transition-all ${
                          set.completed
                            ? 'bg-neutral-900 border-emerald-500/30 text-emerald-400'
                            : 'bg-neutral-900 border-neutral-700 text-white focus:border-emerald-500'
                        }`}
                      />
                    </div>

                    {/* Reps Input */}
                    <div className="col-span-3 px-1">
                      <input
                        type="number"
                        value={currentRepsVal}
                        onChange={(e) => onRepsChange(set.setNumber, e.target.value)}
                        disabled={set.completed}
                        placeholder={set.targetReps ? `${set.targetReps}` : "عدة"}
                        className={`w-full py-1.5 px-2 rounded-lg text-center font-mono font-bold text-xs border outline-none transition-all ${
                          set.completed
                            ? 'bg-neutral-900 border-emerald-500/30 text-emerald-400'
                            : 'bg-neutral-900 border-neutral-700 text-white focus:border-emerald-500'
                        }`}
                      />
                    </div>

                    {/* Completion Action */}
                    <div className="col-span-4 flex items-center justify-center">
                      {set.completed ? (
                        <button
                          onClick={() => onToggleSet(set.setNumber)}
                          className="w-full py-1.5 px-2 rounded-xl bg-emerald-500 text-neutral-950 font-black text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition-all cursor-pointer"
                          title="تم الإنجاز بعلامة صح خضراء - اضغط للتعديل"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3] text-neutral-950" />
                          <span>تم ✓</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSaveSet(set.setNumber, set.targetReps, set.actualWeight || 50, set.restSeconds)}
                          className="w-full py-1.5 px-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-neutral-950 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                          title="إضافة وتسجيل الجولة"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={onOpenSwap}
            className="text-xs text-neutral-400 hover:text-emerald-400 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>طلب استبدال هذا التمرين مع كتابة السبب للكوتش</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs shadow-md transition-all cursor-pointer"
          >
            إغلاق وحفظ
          </button>
        </div>

      </div>
    </div>
  );
};
