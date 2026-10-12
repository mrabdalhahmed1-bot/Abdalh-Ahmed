import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useFitness } from '../../context/FitnessContext';
import { Download, Smartphone, X, CheckCircle2, AlertCircle, ArrowUpRight, Sparkles, Maximize2 } from 'lucide-react';

interface PWAInstallBannerProps {
  onOpenGuide: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenGuide }) => {
  const { isInstallable, isInstalled, isStandalone, isIOS, install } = usePWAInstall();
  const { appIcon } = useFitness();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    } catch (e) {}
  };

  // If already running inside standalone app window or dismissed by user in this session, do not render
  if (isStandalone || isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      const outcome = await install();
      if (!outcome) {
        // If beforeinstallprompt was not available or dismissed, open the guide
        onOpenGuide();
      }
    } catch (e) {
      onOpenGuide();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <aside 
      aria-label="تثبيت التطبيق على الهاتف"
      className="bg-gradient-to-r from-emerald-950/95 via-neutral-900 to-emerald-950/95 border-b border-emerald-500/40 px-3 sm:px-6 py-2.5 shadow-xl relative z-30 transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: App Icon + Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-xl bg-neutral-900 border-2 border-emerald-500 shadow-md shadow-emerald-500/30 flex items-center justify-center p-1.5">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" rx="20" fill="#18181b"/>
                <circle cx="50" cy="50" r="30" fill="#10b981" opacity="0.2"/>
                <rect x="24" y="47" width="52" height="6" rx="2" fill="#e4e4e7"/>
                <rect x="42" y="45" width="16" height="10" rx="2" fill="#10b981"/>
                <rect x="18" y="34" width="6" height="32" rx="2" fill="#f4f4f5"/>
                <rect x="76" y="34" width="6" height="32" rx="2" fill="#f4f4f5"/>
              </svg>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full animate-ping"></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-white truncate">
                تثبيت التطبيق على الهاتف وشاشته الكاملة
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 hidden sm:inline-block">
                بدون شريط المتصفح
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 truncate">
              {isIOS 
                ? 'على الآيفون: اضغط زر المشاركة ⎋ ثم "إضافة إلى الشاشة الرئيسية"'
                : isInstallable 
                  ? 'اضغط زر التثبيت لتنزيل التطبيق بأيقونتك على شاشة الهاتف وشاشته الكاملة'
                  : 'لتشغيل التطبيق شاشة كاملة بدون شريط المتصفح، اضغط إخفاء شريط المتصفح'}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 mr-auto sm:mr-0">
          {/* Quick Instant Fullscreen Mode to eliminate browser address bar immediately */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 hover:border-emerald-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer"
            title="إخفاء شريط المتصفح وتشغيل وضع ملء الشاشة الكامل"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إخفاء شريط المتصفح</span>
            <span className="sm:hidden text-[11px]">ملء الشاشة</span>
          </button>

          {isInstallable ? (
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-neutral-950 text-xs font-black rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isInstalling ? 'جارٍ التثبيت...' : 'تثبيت التطبيق الآن 📱'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>طريقة تثبيت التطبيق 📲</span>
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="إخفاء هذا الشريط"
            aria-label="إخفاء"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
};
