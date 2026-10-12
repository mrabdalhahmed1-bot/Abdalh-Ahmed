import React, { useState, useRef } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { 
  X, 
  Upload, 
  Check, 
  Smartphone, 
  Image as ImageIcon, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Share2,
  ExternalLink,
  MessageCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CustomAppIconModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomAppIconModal: React.FC<CustomAppIconModalProps> = ({ isOpen, onClose }) => {
  const { appIcon, updateAppIcon, resetAppIcon } = useFitness();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewImage(result);
    };
    reader.onerror = () => {
      setErrorMessage('تعذر قراءة الصورة من جهازك، يرجى المحاولة مرة أخرى.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveIcon = async () => {
    if (!previewImage) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const res = await updateAppIcon(previewImage);
      setIsSaving(false);
      setSuccessMessage('🎉 تم حفظ واعتماد الصورة كأيقونة رسمية للتطبيق بنجاح!');
    } catch {
      setIsSaving(false);
      setErrorMessage('حدث خطأ أثناء حفظ الصورة');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('هل تريد استعادة الأيقونة الافتراضية الرسمية للتطبيق؟')) {
      resetAppIcon();
      setPreviewImage(null);
      setSuccessMessage('تمت استعادة الأيقونة الافتراضية بنجاح.');
    }
  };

  const handleShareToWhatsApp = () => {
    const text = encodeURIComponent(
      `💪 رابط التطبيق الرياضي التدريبي:\n${currentUrl}\n\n1. افتح الرابط في Chrome\n2. اضغط (⋮) ثم "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const currentActiveIcon = previewImage || appIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-neutral-100 my-6 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                تعيين صورتك المحمّلة كأيقونة رسمية للتطبيق
              </h3>
              <span className="text-xs text-neutral-400">
                حل فوري لمشكلة تثبيت الأيقونة على هواتف أندرويد وآيفون
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Why Chrome needed this - Reassurance Banner */}
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-xs leading-relaxed">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-1">
                لماذا كانت نتائج البحث في جوجل محيرة؟
              </span>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                متصفح <strong>Google Chrome</strong> على الهواتف لا يسمح للمستخدم باختيار صورة من استوديو الهاتف يدوياً أثناء التثبيت، بل يسحب الأيقونة تلقائياً من برمجة التطبيق نفسه. 
                <br />
                <strong>الحل البسيط:</strong> بدلاً من البرامج المعقدة، قمنا ببرمجة هذه الميزة لك: فقط اختر الصورة التي حملتها على هاتفك من الزر بالأسفل وسيقوم التطبيق بتثبيتها وتحديث الأيقونة الرسمية فوراً!
              </p>
            </div>
          </div>

          {/* Upload Box */}
          <div className="bg-neutral-950 border-2 border-dashed border-neutral-800 hover:border-emerald-500/60 rounded-2xl p-6 text-center transition-colors">
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden" 
              id="app-icon-file-input"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 shadow-inner">
                <Upload className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  اختر الصورة التي قمت بتحميلها على الهاتف
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  اضغط على الزر وافتح الاستوديو أو ملفات التنزيل على هاتفك لاختيار صورتك
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>اختيار الصورة من الهاتف (الاستوديو)</span>
              </button>
            </div>
          </div>

          {/* Live Previews of the Icon */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>معاينة حية: كيف ستظهر صورتك كأيقونة على الهاتف:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
              
              {/* Android Squircle Preview */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                <div className="w-16 h-16 rounded-[22%] p-1.5 bg-neutral-950 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src={currentActiveIcon} 
                    alt="Android Icon Preview" 
                    className="w-full h-full object-cover rounded-[18%]" 
                  />
                </div>
                <span className="text-xs font-bold text-white mt-2.5">التطبيق</span>
                <span className="text-[10px] text-emerald-400">أندرويد Chrome (WebAPK)</span>
              </div>

              {/* iPhone / iOS Preview */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                <div className="w-16 h-16 rounded-2xl p-1 bg-neutral-950 border-2 border-neutral-700 shadow-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={currentActiveIcon} 
                    alt="iOS Icon Preview" 
                    className="w-full h-full object-cover rounded-xl" 
                  />
                </div>
                <span className="text-xs font-bold text-white mt-2.5">التطبيق</span>
                <span className="text-[10px] text-neutral-400">آيفون Safari (Home)</span>
              </div>

              {/* App Bar / Header Motif */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                <div className="w-12 h-12 rounded-xl p-1 bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center overflow-hidden shadow-sm">
                  <img 
                    src={currentActiveIcon} 
                    alt="Header Logo Preview" 
                    className="w-full h-full object-cover rounded-lg" 
                  />
                </div>
                <span className="text-xs font-bold text-white mt-2.5">شعار المنصة</span>
                <span className="text-[10px] text-emerald-400">في رأس الصفحة واللوحة</span>
              </div>

            </div>
          </div>

          {/* Action Button: Confirm & Save */}
          {previewImage && (
            <div className="p-4 bg-neutral-950 border border-emerald-500/40 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-white">هل أعجبتك المعاينة؟</h5>
                  <span className="text-[11px] text-neutral-300">
                    اضغط هنا لتحديث أيقونة التطبيق الرسمية وحفظها في المنصة
                  </span>
                </div>
                <button
                  onClick={handleSaveIcon}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 stroke-[3]" />
                  )}
                  <span>{isSaving ? 'جارٍ المعالجة والحفظ...' : 'اعتماد وحفظ كأيقونة رسمية للتطبيق'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Alerts / Feedback */}
          {successMessage && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-2xl text-xs text-emerald-300 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{successMessage}</span>
              </div>

              {/* 3 Simple Steps on Phone */}
              <div className="p-3 bg-neutral-900/90 rounded-xl border border-emerald-500/30 space-y-2 text-white">
                <span className="font-bold text-xs text-emerald-400 block">
                  الخطوة الأخيرة لتظهر الأيقونة الجديدة على شاشة هاتفك:
                </span>
                <ol className="space-y-1.5 text-[11px] text-neutral-300 list-decimal list-inside leading-relaxed">
                  <li>
                    على شاشة هاتفك، احذف أيقونة التطبيق السابقة (اضغط عليها مطولاً واختر <strong>"إزالة"</strong> أو "إلغاء التثبيت").
                  </li>
                  <li>
                    افتح الرابط في تطبيق <strong>Google Chrome</strong> على هاتفك واضغط على زر الثلاث نقاط (<strong>⋮</strong>).
                  </li>
                  <li>
                    اضغط <strong>"تثبيت التطبيق" (Install App)</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
                  </li>
                </ol>
                <div className="text-[10px] text-emerald-400 pt-1 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>ستظهر صورتك المحمّلة فوراً كأيقونة للتطبيق على شاشة هاتفك مع تطبيقاتك الأخرى!</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleShareToWhatsApp}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>إرسال الرابط لنفسي في واتساب لتثبيته الآن</span>
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800/60 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Reset Option */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
            <span className="text-neutral-400 text-[11px]">
              هل تريد العودة للأيقونة الافتراضية؟
            </span>
            <button
              onClick={handleResetToDefault}
              className="text-neutral-400 hover:text-white underline text-[11px] transition-colors"
            >
              استعادة الأيقونة الرياضية الافتراضية
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            أيقونات PWA متوافقة بنسبة 100% مع معايير Google Chrome & Apple WebKit
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
