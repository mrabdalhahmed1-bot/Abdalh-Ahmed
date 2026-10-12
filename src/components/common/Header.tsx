import React from 'react';
import { useFitness } from '../../context/FitnessContext';
import { 
  Dumbbell, 
  MessageSquare, 
  RotateCcw, 
  ChevronDown, 
  UserCheck,
  ShieldCheck,
  Flame,
  Smartphone,
  Image as ImageIcon,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onOpenChat: () => void;
  onOpenNewTraineeModal: () => void;
  onOpenInstallGuide: () => void;
  onOpenCustomIconModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenChat, 
  onOpenNewTraineeModal,
  onOpenInstallGuide,
  onOpenCustomIconModal
}) => {
  const { 
    userRole, 
    setUserRole, 
    trainees, 
    currentTraineeId, 
    setCurrentTraineeId, 
    activeTrainee, 
    coachInfo, 
    messages,
    resetDemoData,
    appIcon,
    logoutTrainee,
    loginAsCoach
  } = useFitness();

  const unreadMessagesCount = messages.filter(
    m => !m.read && m.senderRole !== userRole && m.traineeId === currentTraineeId
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Title with Single Visual Motif */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 flex items-center justify-center p-0.5 overflow-hidden">
            <img 
              src="/images/icon-512.png" 
              alt="Abdullah Qasim Logo" 
              className="w-full h-full object-cover rounded-lg" 
              onError={(e) => {
                e.currentTarget.src = '/images/brand-banner.jpg';
              }}
            />
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-black text-base sm:text-lg tracking-tight text-white leading-tight text-center">
              Abdullah Qasim
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-emerald-400 text-center block w-full">
              Online Personal Trainer
            </span>
          </div>
        </div>

        {/* Zone 2: Role Switcher & Contextual Trainee Select */}
        <div className="flex items-center gap-2 sm:gap-4">
          {userRole === 'coach' ? (
            <>
              {/* Interactive Role Switcher */}
              <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setUserRole('coach')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-emerald-500 text-neutral-950 shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>بوابة المدرب</span>
                </button>
                <button
                  onClick={() => setUserRole('trainee')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all text-neutral-400 hover:text-white cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>واجهة المتدرب</span>
                </button>
              </div>

              {/* Active Trainee Selector */}
              <div className="relative flex items-center bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-lg px-2.5 py-1.5 transition-colors">
                <span className="text-xs text-neutral-400 ml-1.5 hidden md:inline">المتدرب:</span>
                <select
                  value={currentTraineeId}
                  onChange={(e) => setCurrentTraineeId(e.target.value)}
                  className="bg-transparent text-xs font-medium text-emerald-400 focus:outline-none cursor-pointer appearance-none pr-1 pl-4"
                  dir="rtl"
                >
                  {trainees.map((t) => (
                    <option key={t.id} value={t.id} className="bg-neutral-900 text-white">
                      {t.fullName} ({t.currentWeightKg} كغ)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-neutral-400 pointer-events-none absolute left-2" />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 sm:px-3 py-1.5">
                <img 
                  src={activeTrainee.avatarUrl} 
                  alt={activeTrainee.fullName} 
                  className="w-5 h-5 rounded-full object-cover border border-emerald-500/40 shrink-0"
                  onError={(e) => { e.currentTarget.src = '/images/brand-banner.jpg'; }}
                />
                <span className="text-xs font-bold text-white max-w-[100px] sm:max-w-[140px] truncate">
                  {activeTrainee.fullName}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded hidden sm:inline">
                  متدرب
                </span>
              </div>

              <button
                type="button"
                onClick={logoutTrainee}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold transition-colors cursor-pointer"
                title="تسجيل الخروج والعودة لشاشة الدخول"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">خروج</span>
              </button>

              <button
                type="button"
                onClick={loginAsCoach}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-medium transition-colors cursor-pointer"
                title="بوابة المدرب"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">الكوتش</span>
              </button>
            </div>
          )}
        </div>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Instant App Install Button */}
          <button
            onClick={onOpenInstallGuide}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="تثبيت التطبيق على الموبايل فوراً (أندرويد وآيفون) 📲"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">تثبيت التطبيق 📲</span>
          </button>

          {/* Quick Chat Button */}
          <button
            onClick={onOpenChat}
            className="relative p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700/60 cursor-pointer"
            title="المحادثة المباشرة مع المدرب / المتدرب"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-neutral-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={() => {
              if (window.confirm('هل تريد إعادة تعيين البيانات التجريبية إلى الوضع الافتراضي؟')) {
                resetDemoData();
              }
            }}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors border border-neutral-700/60 hidden sm:block"
            title="إعادة تعيين البيانات التجريبية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Mini Avatar */}
          <div className="flex items-center gap-2 pr-2 border-r border-neutral-800">
            <img
              src={userRole === 'coach' ? coachInfo.avatar : activeTrainee.avatarUrl}
              alt="Avatar"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
              onError={(e) => {
                // styled fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-semibold text-white leading-tight">
                {userRole === 'coach' ? coachInfo.name : activeTrainee.fullName}
              </span>
              <span className="text-[10px] text-neutral-400">
                {userRole === 'coach' ? 'مدرب رئيسي' : activeTrainee.goalTitle.slice(0, 20) + '...'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
