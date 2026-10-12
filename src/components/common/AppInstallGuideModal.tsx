import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useFitness } from '../../context/FitnessContext';
import { getPublicInstallUrl } from '../../utils/appUrl';
import { 
  X, 
  Smartphone, 
  Download, 
  Check, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Apple, 
  Chrome, 
  QrCode, 
  Share2, 
  Users, 
  CheckCircle2
} from 'lucide-react';

interface AppInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomIconModal?: () => void;
}

export const AppInstallGuideModal: React.FC<AppInstallGuideModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenCustomIconModal
}) => {
  const { isInstallable, isStandalone, install } = usePWAInstall();
  const { appIcon } = useFitness();
  const [copiedDev, setCopiedDev] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'trainees'>('install');

  if (!isOpen) return null;

  const currentUrl = getPublicInstallUrl();
  
  // Clean QR code URL using public QR API with dark background and emerald styling
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}&color=10b981&bgcolor=09090b&margin=1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedDev(true);
    setTimeout(() => setCopiedDev(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-neutral-100 my-6 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-emerald-500/40 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/10 overflow-hidden shrink-0">
              <img 
                src={appIcon} 
                alt="App Icon" 
                className="w-full h-full object-cover rounded-xl" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">دليل تثبيت التطبيق</h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  PWA APP
                </span>
              </div>
              <span className="text-xs text-neutral-400">
                مرجعك الرسمي لتشغيل التطبيق على الجوال
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (فقط خيار 1 وخيار 2 المطلوبين) */}
        <div className="flex items-center border-b border-neutral-800 bg-neutral-950/60 px-4 sm:px-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('install')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'install'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. تنزيل التطبيق والأيقونة على الجوال</span>
          </button>
          
          <button
            onClick={() => setActiveTab('trainees')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'trainees'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. كيف يستخدمه المتدرب؟</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* TAB 1: INSTALLATION & APP ICON */}
          {activeTab === 'install' && (
            <div className="space-y-6">
              
              {/* App Identity Banner */}
              <div className="p-5 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl shadow-emerald-500/20 shrink-0 bg-neutral-950 flex items-center justify-center p-1">
                    <img 
                      src={appIcon} 
                      alt="Official App Icon" 
                      className="w-full h-full object-cover rounded-xl" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base sm:text-lg font-black text-white">Abdullah Qasim</h4>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        جاهز للتثبيت
                      </span>
                    </div>
                    <span className="text-xs text-neutral-300 block mt-0.5">
                      تطبيق ويب تقدمي (PWA) يُثبّت بأيقونته الرسمية دون الحاجة إلى متجر App Store
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 mt-1">
                      {isStandalone ? '✓ التطبيق مثبت حالياً على جهازك ويعمل كـ Standalone App' : '⚡ يفتح بكامل الشاشة وبدون شريط عنوان المتصفح'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {onOpenCustomIconModal && (
                    <button
                      type="button"
                      onClick={onOpenCustomIconModal}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/40 transition-colors shadow-sm cursor-pointer"
                      title="تعيين صورتك المحمّلة كأيقونة للتطبيق"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تغيير / تعيين صورتك كأيقونة 🎨</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Direct Link & QR Code Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Link Share Box */}
                <div className="md:col-span-2 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>رابط المنصة المباشر للتثبيت:</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                        HTTPS آمن 🔒
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">
                      انسخ هذا الرابط وأرسله لمتدربيك أو افتحه على هاتفك لتثبيت التطبيق مباشرة:
                    </p>
                    
                    <div className="flex items-center gap-2 p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                      <input 
                        type="text" 
                        readOnly 
                        value={currentUrl} 
                        className="bg-transparent text-xs font-mono text-emerald-300 w-full focus:outline-none select-all"
                        dir="ltr"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                        title="نسخ الرابط"
                      >
                        {copiedDev ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copiedDev ? 'تم النسخ!' : 'نسخ'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>فتح في نافذة جديدة</span>
                    </a>
                  </div>
                </div>

                {/* QR Code Box */}
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-32 h-32 rounded-xl bg-neutral-900 border border-neutral-800 p-2 flex items-center justify-center shadow-inner overflow-hidden">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code for App Install" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">امسح الكاميرا للتثبيت</span>
                    <span className="text-[10px] text-neutral-400 block">افتح كاميرا الهاتف ووجّهها للمربع</span>
                  </div>
                </div>

              </div>

              {/* Instructions by Platform */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* iOS Instructions */}
                <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/80">
                    <div className="p-2 rounded-xl bg-white/10 text-white">
                      <Apple className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">هواتف آيفون (Apple iOS)</h5>
                      <span className="text-[10px] text-neutral-400">Safari Browser</span>
                    </div>
                  </div>

                  <ol className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">1</span>
                      <div>
                        <span className="font-semibold text-white">افتح الرابط في متصفح Safari:</span>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          تأكد من فتح الرابط داخل متصفح Safari الرئيسي للآيفون.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">2</span>
                      <div>
                        <span className="font-semibold text-white">اضغط زر المشاركة (Share):</span>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          المربع الصغير الذي يخرج منه سهم للأعلى أسفل شاشة Safari.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">3</span>
                      <div>
                        <span className="font-semibold text-white">اختر "إضافة إلى الشاشة الرئيسية":</span>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          مرر القائمة لأسفل واختر <strong>(Add to Home Screen)</strong>.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">4</span>
                      <div>
                        <span className="font-semibold text-white">اضغط "إضافة" (Add):</span>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          في أعلى الزاوية. ستظهر أيقونة التطبيق فوراً على شاشتك الرئيسية!
                        </p>
                      </div>
                    </li>
                  </ol>

                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                    <span>سيعمل التطبيق في نافذة مستقلة وبكامل الشاشة بدون شريط سفلي أو علوي!</span>
                  </div>
                </div>

                {/* Android Instructions */}
                <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/80">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Chrome className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">هواتف أندرويد (Samsung / Xiaomi / Huawei)</h5>
                      <span className="text-[10px] text-neutral-400">Google Chrome Browser</span>
                    </div>
                  </div>

                  {/* Direct 1-Click Install Button if supported */}
                  {isInstallable && (
                    <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-emerald-400 text-xs">تثبيت فوري مباشر مدعوم بجهازك الآن!</div>
                        <div className="text-[11px] text-neutral-300">اضغط الزر لتثبيته فوراً كتطبيق مستقل بدون متصفح.</div>
                      </div>
                      <button
                        onClick={async () => {
                          const res = await install();
                          if (res) onClose();
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 stroke-[2.5]" />
                        <span>تثبيت التطبيق الآن 📱</span>
                      </button>
                    </div>
                  )}

                  <ol className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">1</span>
                      <div>
                        <span className="font-semibold text-white">افتح الرابط في تطبيق Google Chrome:</span>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          تأكد من فتح الرابط في تطبيق Chrome مباشرة.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">2</span>
                      <div>
                        <span className="font-semibold text-white">اضغط على زر النقاط الثلاث (⋮):</span>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          في أعلى الزاوية بجانب شريط العنوان.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">3</span>
                      <div>
                        <span className="font-semibold text-white">اختر "تثبيت التطبيق" (Install App):</span>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          أو اختر "إضافة إلى الشاشة الرئيسية".
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">4</span>
                      <div>
                        <span className="font-semibold text-white">اضغط "تثبيت" (Install):</span>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          ستظهر أيقونة التطبيق الرسمية فوراً على شاشتك الرئيسية بجانب تطبيقاتك الأخرى!
                        </p>
                      </div>
                    </li>
                  </ol>

                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                    <span>النتيجة: تطبيق متكامل وسريع جداً أثناء التدريب في النادي بدون متجر تطبيقات.</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: HOW TRAINEES USE IT (المطلوب: حذف المقدمة وحذف رسالة الواتساب والإبقاء على الخطوات الأساسية) */}
          {activeTab === 'trainees' && (
            <div className="space-y-4">
              
              <div className="space-y-3">
                
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 text-sm border border-emerald-500/30">
                    1
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">جدول تمارينه لليوم (Interactive Workout Tracker)</span>
                    <span className="text-xs text-neutral-400">يسجل أوزانه وتكراراته جولة بجولة مع مؤقت الراحة الذكي (60ث / 90ث / 120ث).</span>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 text-sm border border-emerald-500/30">
                    2
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">متتبع الماكروز والوجبات اليومي (Daily Macro Tracker)</span>
                    <span className="text-xs text-neutral-400">حلقات تفاعلية تحسب له البروتين والكارب والدهون والسعرات، مع تسجيل سهل للوجبات.</span>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 text-sm border border-emerald-500/30">
                    3
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">متتبع شرب الماء والخطوات والعادات</span>
                    <span className="text-xs text-neutral-400">تسجيل لترات الماء المستهلكة، ساعات النوم، والمكملات الغذائية اليومية.</span>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 text-sm border border-emerald-500/30">
                    4
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">إرسال التقرير الأسبوعي والمحادثة معك</span>
                    <span className="text-xs text-neutral-400">نموذج سهل لرفع الوزن الجديد والمقاسات وصور التطور والتواصل المباشر في الشات.</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Abdullah Qasim · تطبيق PWA متوافق مع كافة الهواتف
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق الدليل
          </button>
        </div>

      </div>
    </div>
  );
};
