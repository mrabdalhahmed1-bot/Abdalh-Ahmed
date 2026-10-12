import React, { useState, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Smartphone, 
  Lock,
  X
} from 'lucide-react';
import { TraineeProfile } from '../../types/fitness';

interface TraineeLoginPageProps {
  onOpenInstallGuide?: () => void;
}

export const TraineeLoginPage: React.FC<TraineeLoginPageProps> = ({ onOpenInstallGuide }) => {
  const { 
    trainees, 
    loginTrainee, 
    loginAsCoach, 
    verifyCoachCredentials,
    appIcon
  } = useFitness();

  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetedTrainee, setTargetedTrainee] = useState<TraineeProfile | null>(null);

  // Coach Login Modal State
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [coachUserInput, setCoachUserInput] = useState('');
  const [coachPinInput, setCoachPinInput] = useState('');
  const [showCoachPin, setShowCoachPin] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);

  // Check URL query parameters on mount to prefill username or greet trainee
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlTraineeId = searchParams.get('traineeId') || searchParams.get('trainee');
      const urlUser = searchParams.get('user') || searchParams.get('username');

      if (urlTraineeId) {
        const found = trainees.find(t => t.id === urlTraineeId);
        if (found) {
          setTargetedTrainee(found);
          setUsername(found.username || found.fullName);
        }
      } else if (urlUser) {
        const found = trainees.find(t => 
          (t.username && t.username.toLowerCase() === urlUser.toLowerCase()) ||
          t.fullName.toLowerCase() === urlUser.toLowerCase()
        );
        if (found) {
          setTargetedTrainee(found);
          setUsername(found.username || found.fullName);
        } else {
          setUsername(urlUser);
        }
      }
    } catch {}
  }, [trainees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('يرجى كتابة اسم المستخدم أولاً');
      return;
    }

    if (!pin.trim()) {
      setErrorMessage('يرجى كتابة الرقم السري الخاص بك');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = loginTrainee(username, pin);
      setIsLoading(false);

      if (!result.success) {
        setErrorMessage(result.error || 'اسم المستخدم أو الرقم السري غير صحيح. يرجى التأكد من البيانات أو مراجعة الكوتش.');
      }
    }, 400);
  };

  const handleCoachLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCoachError(null);

    if (!coachUserInput.trim()) {
      setCoachError('يرجى كتابة اسم مستخدم المدرب');
      return;
    }
    if (!coachPinInput.trim()) {
      setCoachError('يرجى إدخال الرقم السري للمدرب');
      return;
    }

    const isValid = verifyCoachCredentials(coachUserInput, coachPinInput);
    if (isValid) {
      setIsCoachModalOpen(false);
      loginAsCoach();
    } else {
      setCoachError('اسم مستخدم المدرب أو الرقم السري غير صحيح');
    }
  };

  const handleWhatsAppCoachHelp = () => {
    const text = `مرحباً كوتش عبدالله قاسم 👋\nأنا متدرب وأحتاج لمعرفة اسم المستخدم والرمز السري الخاص بي للدخول إلى التطبيق 💪`;
    const cleanPhone = '201068298126';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-x-hidden selection:bg-emerald-500 selection:text-neutral-950 font-['Cairo',sans-serif]">
      
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Bar / Brand Tag */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-emerald-500/40 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/10 overflow-hidden">
            <img 
              src={appIcon || '/images/icon-512.png'} 
              alt="Coach Logo" 
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/images/icon-192.png';
              }}
            />
          </div>
          <div>
            <span className="font-black text-sm text-white block leading-tight">Abdullah Qasim</span>
            <span className="text-[10px] font-bold text-emerald-400 block">AQ Coaching Portal</span>
          </div>
        </div>

        {onOpenInstallGuide && (
          <button
            type="button"
            onClick={onOpenInstallGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>تثبيت التطبيق 📲</span>
          </button>
        )}
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto relative z-10">
        <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative overflow-hidden">
          
          {/* Top Emerald Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500" />

          {/* Coach Avatar & Verified Badge */}
          <div className="text-center mb-6">
            <div className="relative inline-block mx-auto mb-3">
              <div className="w-20 h-20 rounded-2xl bg-neutral-950 border-2 border-emerald-500/50 p-1 shadow-xl shadow-emerald-500/20 overflow-hidden">
                <img 
                  src="/images/icon-512.png" 
                  alt="Coach Abdullah Qasim" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = '/images/brand-banner.jpg';
                  }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 text-neutral-950 rounded-full border-2 border-neutral-900 flex items-center justify-center text-xs font-black shadow-md" title="معتمد">
                ✓
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>البوابة الرسمية للمتدربين</span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              تسجيل دخول المتدرب
            </h1>

            {targetedTrainee ? (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs">
                مرحباً بك يا <strong className="text-white font-bold">{targetedTrainee.fullName}</strong>! أدخل رقمك السري للدخول إلى ملفك.
              </div>
            ) : (
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed">
                أدخل اسم المستخدم والرقم السري المعتمد من <strong className="text-emerald-400">كوتش عبدالله قاسم</strong> للوصول إلى خطتك الرياضية وجدول التغذية.
              </p>
            )}
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block text-red-300 mb-0.5">خطأ في تسجيل الدخول</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field 1: Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-300 text-right">
                اسم المستخدم <span className="text-neutral-500 font-normal">(Username)</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="أدخل اسم المستخدم (مثال: youssef_gamal)"
                  className="w-full bg-neutral-950 border border-neutral-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl px-4 py-3.5 pr-11 text-sm text-white placeholder:text-neutral-500 transition-all outline-none font-medium text-right"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                />
                <div className="absolute right-3.5 text-emerald-400 pointer-events-none">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Field 2: Secret PIN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-neutral-300 text-right">
                  الرقم السري <span className="text-neutral-500 font-normal">(PIN / كلمة المرور)</span>
                </label>
                <button
                  type="button"
                  onClick={handleWhatsAppCoachHelp}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
                >
                  نسيت الرقم السري؟
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="أدخل الرقم السري (مثال: 123456)"
                  className="w-full bg-neutral-950 border border-neutral-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl px-4 py-3.5 pr-11 pl-11 text-sm text-white placeholder:text-neutral-500 transition-all outline-none font-mono tracking-wider text-right"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                />
                <div className="absolute right-3.5 text-emerald-400 pointer-events-none">
                  <KeyRound className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute left-3.5 text-neutral-400 hover:text-neutral-200 transition-colors p-1 cursor-pointer"
                  title={showPin ? 'إخفاء الرقم السري' : 'إظهار الرقم السري'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-400 hover:text-neutral-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer accent-emerald-500"
                />
                <span>تذكر بيانات دخولي على هذا الجهاز</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-[0.98] text-neutral-950 font-black rounded-2xl text-base shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ التحقق وتجهيز ملفك الرياضي...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-neutral-950" />
                  <span>تسجيل الدخول إلى حسابي الرياضي 🚀</span>
                </>
              )}
            </button>
          </form>

          {/* Coach WhatsApp Help Direct Link with Phone 01068298126 */}
          <div className="mt-6 pt-5 border-t border-neutral-800 text-center">
            <button
              type="button"
              onClick={handleWhatsAppCoachHelp}
              className="text-xs text-neutral-300 hover:text-emerald-400 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-emerald-500/40 w-full"
            >
              <span>تحتاج مساعدة؟ تواصل مباشرة مع كوتش عبدالله واتس اب:</span>
              <strong className="text-emerald-400 font-mono font-black text-sm" dir="ltr">01068298126</strong>
              <span>💬</span>
            </button>
          </div>

        </div>

        {/* Footer: Coach Secure Login Button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setCoachUserInput('');
              setCoachPinInput('');
              setCoachError(null);
              setIsCoachModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-400 text-xs font-bold transition-all cursor-pointer shadow-lg"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>أنت المدرب؟ دخول لوحة تحكم كوتش عبدالله قاسم 👑</span>
          </button>
        </div>

      </div>

      {/* Coach Authentication Modal */}
      {isCoachModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-neutral-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-right">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-500" />
            
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">تسجيل دخول المدرب</h3>
                  <span className="text-[10px] text-emerald-400 font-bold">بوابة كوتش عبدالله قاسم</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCoachModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {coachError && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{coachError}</span>
              </div>
            )}

            <form onSubmit={handleCoachLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  اسم مستخدم المدرب (Username)
                </label>
                <input
                  type="text"
                  value={coachUserInput}
                  onChange={(e) => setCoachUserInput(e.target.value)}
                  placeholder="اسم المستخدم (افتراضي: coach)"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none"
                  autoCapitalize="none"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  الرقم السري للمدرب (PIN / كلمة المرور)
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showCoachPin ? 'text' : 'password'}
                    value={coachPinInput}
                    onChange={(e) => setCoachPinInput(e.target.value)}
                    placeholder="الرقم السري (افتراضي: 123456)"
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-neutral-500 outline-none font-mono"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCoachPin(!showCoachPin)}
                    className="absolute right-2.5 p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showCoachPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                <div>اسم المستخدم الافتراضي: <strong className="text-white font-mono">coach</strong></div>
                <div>الرقم السري الافتراضي: <strong className="text-emerald-400 font-mono">123456</strong></div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCoachModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  دخول لوحة المدرب 👑
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* App Copyright */}
      <div className="w-full text-center py-2 text-[11px] text-neutral-600 relative z-10">
        جميع الحقوق محفوظة © {new Date().getFullYear()} كوتش عبدالله قاسم (AQ Coaching)
      </div>

    </div>
  );
};
