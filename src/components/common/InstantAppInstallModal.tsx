import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useFitness } from '../../context/FitnessContext';
import { getPublicInstallUrl, PUBLIC_SHARED_APP_URL } from '../../utils/appUrl';
import { 
  X, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Share2, 
  Copy, 
  ExternalLink, 
  Apple, 
  Chrome, 
  Sparkles, 
  QrCode, 
  AlertTriangle,
  ArrowDown,
  PlusSquare,
  ShieldCheck,
  Check
} from 'lucide-react';

interface InstantAppInstallModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  targetTraineeName?: string;
}

export const InstantAppInstallModal: React.FC<InstantAppInstallModalProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  targetTraineeName
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isInAppBrowser, isStandalone, install } = usePWAInstall();
  const { appIcon, triggerCheer, activeTrainee } = useFitness();
  
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [activePlatformTab, setActivePlatformTab] = useState<'auto' | 'android' | 'ios'>('auto');

  // Detect URL parameter (?install=1 or ?download=1)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const isInstallRequested = params.get('install') === '1' || 
                                 params.get('install') === 'true' || 
                                 params.get('download') === '1' || 
                                 params.get('pwa') === '1';
      if (isInstallRequested && !isStandalone) {
        setInternalIsOpen(true);
      }
    } catch {}
  }, [isStandalone]);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const installUrl = getPublicInstallUrl(activeTrainee?.id);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(installUrl)}&color=10b981&bgcolor=09090b&margin=1`;

  const handleInstallClick = async () => {
    try {
      const outcome = await install();
      if (outcome) {
        triggerCheer('ألف مبروك! 🎉 تم تثبيت التطبيق بنجاح على هاتفك');
        setTimeout(() => handleClose(), 1500);
      }
    } catch {}
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(installUrl);
    setCopiedLink(true);
    triggerCheer('تم نسخ رابط التثبيت الفوري 📋');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const traineeNameStr = targetTraineeName || activeTrainee?.fullName || 'البطل';
    const message = `مرحباً يا ${traineeNameStr}! 💪\nرابط تثبيت تطبيق التدريب والتغذية المباشر على هاتفك (أندرويد وآيفون):\n${installUrl}\n\nاضغط على الرابط وسيتثبت التطبيق فوراً على شاشتك الرئيسية ويعمل بشاشة كاملة بدون متجر تطبيقات! 🚀`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const detectedPlatform = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';
  const effectivePlatform = activePlatformTab === 'auto' ? detectedPlatform : activePlatformTab;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-emerald-500/50 rounded-3xl shadow-2xl text-neutral-100 my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Header */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-neutral-900 to-emerald-950 p-6 border-b border-neutral-800 text-center">
          <button 
            type="button"
            onClick={handleClose}
            className="absolute top-4 left-4 p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative mx-auto w-20 h-20 mb-3">
            <div className="w-full h-full rounded-2xl bg-neutral-950 border-2 border-emerald-400 p-1 shadow-xl shadow-emerald-500/20 overflow-hidden">
              <img 
                src={appIcon || '/images/icon-512.png'} 
                alt="App Icon" 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.src = '/images/icon-192.png';
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 text-neutral-950 rounded-full border-2 border-neutral-900 flex items-center justify-center text-xs font-black shadow-md">
              ✓
            </span>
          </div>

          <h3 className="text-xl font-black text-white">
            تثبيت التطبيق على هاتفك 📲
          </h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-xs mx-auto">
            تطبيق <strong className="text-emerald-400">كوتش عبدالله قاسم</strong> للتدريب والمتابعة الرياضية
          </p>

          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>تثبيت فوري شاشة كاملة</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[11px] font-medium border border-neutral-700">
              بدون متجر تطبيقات
            </span>
          </div>
        </div>

        {/* Platform Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 px-6 pt-4 bg-neutral-950/60 border-b border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setActivePlatformTab('android')}
            className={`flex items-center gap-1.5 pb-3 font-bold border-b-2 transition-all px-3 cursor-pointer ${
              effectivePlatform === 'android'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Chrome className="w-4 h-4 text-emerald-400" />
            <span>هواتف أندرويد (Android)</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePlatformTab('ios')}
            className={`flex items-center gap-1.5 pb-3 font-bold border-b-2 transition-all px-3 cursor-pointer ${
              effectivePlatform === 'ios'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4 text-neutral-200" />
            <span>آيفون وآيباد (iOS)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">

          {/* Already Installed Alert */}
          {isStandalone && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">التطبيق مثبت بالفعل على هاتفك!</h4>
              <p className="text-xs text-neutral-300">
                أنت تستخدم التطبيق الآن في وضع الشاشة الكاملة كأنه تطبيق هاتف أصلي.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                متابعة إلى حسابي الآن 🚀
              </button>
            </div>
          )}

          {/* Warning for in-app browser (e.g. WhatsApp / Instagram) */}
          {isInAppBrowser && !isStandalone && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>أنت تتصفح من داخل تطبيق واتساب / انستغرام!</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                متصفح واتساب الداخلي يمنع التثبيت المباشر. لتثبيت التطبيق بنقرة واحدة:
                اضغط على النقاط الثلاث <strong>(⋮)</strong> بالأعلى أو زر المشاركة واختر <strong>"فتح في المتصفح الافتراضي (Chrome أو Safari)"</strong>.
              </p>
            </div>
          )}

          {/* ANDROID INSTRUCTIONS & 1-TAP INSTALL */}
          {effectivePlatform === 'android' && !isStandalone && (
            <div className="space-y-4">
              {isInstallable ? (
                <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">جاهز للتثبيت بنقرة واحدة</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      اضغط الزر أدناه وسيتم تنزيل أيقونة التطبيق على شاشتك الرئيسية فوراً.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-neutral-950 font-black rounded-xl text-sm shadow-xl shadow-emerald-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>تثبيت التطبيق على الموبايل فوراً 📲</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Chrome className="w-4 h-4 text-emerald-400" />
                    <span>طريقة التثبيت في متصفح Chrome لأندرويد:</span>
                  </h4>
                  <ol className="space-y-2.5 text-xs text-neutral-300">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                      <span>افتح الرابط في متصفح <strong>Google Chrome</strong> على هاتفك.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                      <span>اضغط على قائمة النقاط الثلاث <strong>(⋮)</strong> في الزاوية العلوية اليمنى.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                      <span>اضغط على <strong>"تثبيت التطبيق" (Install app)</strong> أو <strong>"الإضافة إلى الشاشة الرئيسية"</strong>.</span>
                    </li>
                  </ol>
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>طلب التثبيت التلقائي</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* IOS (IPHONE / IPAD) INSTRUCTIONS */}
          {effectivePlatform === 'ios' && !isStandalone && (
            <div className="space-y-4">
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Apple className="w-5 h-5 text-white" />
                    <span className="text-xs font-bold text-white">خطوات تثبيت الآيفون في متصفح Safari:</span>
                  </div>
                  <span className="text-[10px] font-mono bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                    Safari Only
                  </span>
                </div>

                <div className="space-y-3 text-xs text-neutral-300">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <span className="font-bold text-white block mb-0.5">اضغط على زر المشاركة (Share)</span>
                      <p className="text-[11px] text-neutral-400">
                        موجود في الشريط السفلي لمتصفح سفاري (أيقونة المربع وسهم لأعلى <span className="inline-block px-1 bg-neutral-800 rounded font-mono">⎋</span>).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <span className="font-bold text-white block mb-0.5">اختر "إضافة إلى الصفحة الرئيسية"</span>
                      <p className="text-[11px] text-neutral-400">
                        مرر للأسفل في القائمة واضغط على <strong>Add to Home Screen ⊞</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <span className="font-bold text-white block mb-0.5">اضغط "إضافة" (Add) في الزاوية العلوية</span>
                      <p className="text-[11px] text-neutral-400">
                        سيظهر التطبيق فوراً على شاشة هاتفك الرئيسية بأيقونته الرياضية ويعمل كأي تطبيق أصلي!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 pt-1">
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                  <span>زر المشاركة ⎋ موجود في شريط سفاري السفلي بالأسفل</span>
                </div>
              </div>
            </div>
          )}

          {/* DESKTOP / LAPTOP SCAN QR CODE OPTION */}
          {effectivePlatform === 'desktop' && !isStandalone && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">امسح الكود بكاميرا هاتفك (آيفون أو أندرويد)</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    افتح كاميرا الهاتف ووجّهها للكود ليفتح الرابط ويبدأ التثبيت الفوري مباشرة
                  </p>
                </div>
                <div className="flex justify-center py-2">
                  <div className="p-2 bg-neutral-900 border border-emerald-500/40 rounded-2xl shadow-lg">
                    <img src={qrCodeUrl} alt="Install QR Code" className="w-40 h-40 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Direct Link Share & Copy Box */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>رابط التثبيت المباشر لإرساله للمتدربين:</span>
              </span>
              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQR ? 'إخفاء الرمز' : 'رمز QR'}</span>
              </button>
            </div>

            {showQR && (
              <div className="flex justify-center p-3 bg-neutral-900 rounded-xl border border-neutral-800">
                <img src={qrCodeUrl} alt="Install QR" className="w-36 h-36 rounded-lg" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={installUrl}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 focus:outline-none select-all"
                dir="ltr"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                  copiedLink 
                    ? 'bg-emerald-500 text-neutral-950' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'تم النسخ!' : 'نسخ'}</span>
              </button>
            </div>

            <p className="text-[10px] text-amber-400 font-medium">
              💡 ملاحظة: هذا الرابط العام يعمل عند أي متدرب في العالم بدون حساب Google وبدون خطأ 403. لا تنسخ رابط صفحة المطوّر (aistudio).
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="py-2.5 px-3 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>إرسال عبر واتساب</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>متابعة إلى التطبيق 🚀</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
