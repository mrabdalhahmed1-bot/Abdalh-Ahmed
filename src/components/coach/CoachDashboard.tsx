import React, { useState, useRef } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { TraineeProfile, WeeklyCheckIn } from '../../types/fitness';
import { getPublicInstallUrl, getPublicTraineeProfileUrl, getPublicBaseUrl, PUBLIC_SHARED_APP_URL } from '../../utils/appUrl';
import { CheckInReviewModal } from './CheckInReviewModal';
import { TraineeDetailModal } from './TraineeDetailModal';
import { NewTraineeModal } from './NewTraineeModal';
import { CoachProfileModal } from './CoachProfileModal';
import { WeeklyCheckInAlerts } from './WeeklyCheckInAlerts';
import { CoachSideSystemDrawer } from './CoachSideSystemDrawer';
import { AddExerciseModal } from './AddExerciseModal';
import { resolveExerciseVideo } from '../../utils/exerciseVideoMap';
import { 
  Users, 
  ClipboardCheck, 
  TrendingUp, 
  Flame, 
  Search, 
  Plus, 
  ChevronRight, 
  Calendar, 
  Scale, 
  Sparkles, 
  Dumbbell, 
  Filter,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  UserCheck,
  Share2,
  Settings,
  Smartphone,
  QrCode,
  AlertTriangle,
  Bell,
  Image as ImageIcon,
  Utensils,
  Moon,
  RotateCw,
  Activity,
  Zap,
  Download,
  FolderDown,
  FileArchive,
  Copy,
  ExternalLink,
  Trash2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Video,
  Play,
  X
} from 'lucide-react';

interface CoachDashboardProps {
  onOpenChat: () => void;
  onOpenInstallGuide?: () => void;
  onOpenCustomIconModal?: () => void;
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ 
  onOpenChat,
  onOpenInstallGuide,
  onOpenCustomIconModal
}) => {
  const { 
    trainees, 
    coachInfo, 
    setCurrentTraineeId, 
    setUserRole, 
    exerciseCatalog,
    swappedMeals,
    weeklySleepHours,
    messages,
    deleteTrainee,
    triggerCheer,
    requestTraineeCheckIn
  } = useFitness();

  const swapMessages = messages.filter(m => m.text.includes('استبدال') || m.text.includes('بديل'));

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'missing' | 'active'>('all');
  
  // Modals
  const [selectedTraineeForDetail, setSelectedTraineeForDetail] = useState<TraineeProfile | null>(null);
  const [reviewCheckInTarget, setReviewCheckInTarget] = useState<{ checkIn: WeeklyCheckIn; trainee: TraineeProfile } | null>(null);
  const [showNewTraineeModal, setShowNewTraineeModal] = useState(false);
  const [showCoachProfileModal, setShowCoachProfileModal] = useState(false);
  const [isSideSystemDrawerOpen, setIsSideSystemDrawerOpen] = useState(false);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [selectedExerciseForVideoModal, setSelectedExerciseForVideoModal] = useState<any | null>(null);
  const [exerciseFilterCategory, setExerciseFilterCategory] = useState<string>('all');
  const [exerciseFilterSearch, setExerciseFilterSearch] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'trainees' | 'pendingReviews' | 'exercises' | 'calculator' | 'reports'>('trainees');

  // Trainee deletion & credentials link state
  const [traineeToDelete, setTraineeToDelete] = useState<TraineeProfile | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [copiedInstallId, setCopiedInstallId] = useState<string | null>(null);

  const handleCopyTraineeLink = (trainee: TraineeProfile) => {
    const link = getPublicTraineeProfileUrl(trainee.id);
    navigator.clipboard.writeText(link);
    setCopiedLinkId(trainee.id);
    triggerCheer(`تم نسخ رابط ملف ${trainee.fullName} بنجاح 📋`);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  const handleCopyTraineeInstallLink = (trainee: TraineeProfile) => {
    const link = getPublicInstallUrl(trainee.id);
    navigator.clipboard.writeText(link);
    setCopiedInstallId(trainee.id);
    triggerCheer(`تم نسخ رابط التثبيت الفوري لهاتف ${trainee.fullName} 📲`);
    setTimeout(() => setCopiedInstallId(null), 2500);
  };

  const handleShareTraineeInstallWhatsApp = (trainee: TraineeProfile) => {
    const link = getPublicInstallUrl(trainee.id);
    const text = `مرحباً يا ${trainee.fullName} 💪\nمعك ${coachInfo.name}.\n\n📲 رابط تثبيت تطبيق التدريب والتغذية على هاتفك مباشرة:\n${link}\n\nاضغط على الرابط وسيبدأ التثبيت الفوري على شاشتك الرئيسية (أندرويد وآيفون) بدون الحاجة لمتجر تطبيقات! 🚀`;
    const cleanPhone = trainee.phone.replace(/[^0-9]/g, '');
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // Reports Filter & View State
  const [selectedReportTraineeId, setSelectedReportTraineeId] = useState<string>('all');
  const [activeReportSubTab, setActiveReportSubTab] = useState<'all' | 'adherence' | 'swaps' | 'recovery'>('all');

  // Calculator State
  const [calcWeight, setCalcWeight] = useState(80);
  const [calcHeight, setCalcHeight] = useState(175);
  const [calcAge, setCalcAge] = useState(28);
  const [calcGoal, setCalcGoal] = useState<'cut' | 'bulk' | 'recomp'>('cut');
  const [calcResult, setCalcResult] = useState<{ calories: number; protein: number; carbs: number; fat: number } | null>(null);

  // Helper to determine if trainee is missing weekly check-in submission
  const isTraineeMissingCheckIn = (trainee: TraineeProfile): boolean => {
    // If they have an unreviewed pending check-in, they HAVE submitted their data
    if (trainee.checkIns.some(c => c.status === 'pending')) return false;

    const now = new Date();
    const sortedCheckIns = [...trainee.checkIns].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latest = sortedCheckIns[0] || null;

    if (latest) {
      const daysSince = Math.floor((now.getTime() - new Date(latest.date).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince >= 7 || trainee.status === 'pending_checkin';
    } else {
      const startDate = trainee.startDate ? new Date(trainee.startDate) : new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
      const daysSince = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince >= 7 || trainee.status === 'pending_checkin';
    }
  };

  // Compute pending check-ins (submitted by trainees, awaiting coach feedback)
  const allPendingCheckIns = trainees.flatMap(t => 
    t.checkIns.filter(c => c.status === 'pending').map(c => ({ checkIn: c, trainee: t }))
  );

  // Helper to normalize Arabic characters for robust search (Request 11)
  const normalizeArabic = (str: string) => {
    return (str || '')
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F]/g, '');
  };

  // Trainees who have NOT submitted their weekly report yet
  const traineesMissingCheckIn = trainees.filter(isTraineeMissingCheckIn);

  // Request 11: Search strictly by trainee name and username, ignoring status filters when query exists
  const filteredTrainees = trainees.filter(t => {
    const q = normalizeArabic(searchQuery);
    if (q.length > 0) {
      const nameMatch = normalizeArabic(t.fullName).includes(q);
      const userMatch = t.username ? normalizeArabic(t.username).includes(q) : false;
      return nameMatch || userMatch;
    }

    if (statusFilter === 'pending') {
      return t.status === 'pending_checkin';
    }
    if (statusFilter === 'missing') {
      return isTraineeMissingCheckIn(t);
    }
    if (statusFilter === 'active') {
      return t.status === 'active';
    }
    return true;
  });

  const handleOpenWhatsApp = (trainee: TraineeProfile) => {
    const cleanPhone = trainee.phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `مرحباً يا ${trainee.fullName} 💪\nمعك ${coachInfo.name}.\n\nأهدافك اليوم في خطة ${trainee.goalTitle}:\n- السعرات: ${trainee.macroGoals.calories} Cal\n- البروتين: ${trainee.macroGoals.proteinGrams}g\n- الماء: ${trainee.macroGoals.waterLiters} لتر\n\nتذكر تسجيل جولات تمرين اليوم وإرسال التقرير الأسبوعي في التطبيق. عاش يا بطل!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleOpenWhatsAppReminder = (trainee: TraineeProfile) => {
    const cleanPhone = trainee.phone.replace(/[^0-9]/g, '');
    const nextWeek = trainee.checkIns.length > 0 
      ? Math.max(...trainee.checkIns.map(c => c.weekNumber)) + 1 
      : 1;
    const msg = encodeURIComponent(
      `مرحباً يا ${trainee.fullName} 💪\nمعك ${coachInfo.name} من منصة التدريب الرياضي.\n\nتذكير ودي بضرورة تسجيل وإرسال التقييم الأسبوعي (الأسبوع ${nextWeek}) في التطبيق:\n- تسجيل وزن الصباح على الريق\n- قياس محيط الخصر\n- صور التطور ونسبة التزامك\n\nبانتظار تقريرك لنراجع التطور ونضبط خطتك للأسبوع القادم. بالتوفيق يا بطل! 🚀`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleRunCalculator = (e: React.FormEvent) => {
    e.preventDefault();
    const bmr = 10 * calcWeight + 6.25 * calcHeight - 5 * calcAge + 5;
    const tdee = Math.round(bmr * 1.4); // moderate activity
    let cal = tdee;
    if (calcGoal === 'cut') cal = Math.round(tdee - 450);
    if (calcGoal === 'bulk') cal = Math.round(tdee + 350);

    const prot = Math.round(calcWeight * 2.2);
    const fat = Math.round((cal * 0.25) / 9);
    const carbs = Math.round((cal - (prot * 4 + fat * 9)) / 4);

    setCalcResult({ calories: cal, protein: prot, carbs, fat });
  };

  return (
    <div className="space-y-8 pb-16 relative">
      
      {/* Sleek Floating 3-Dash Trigger Button on the screen side edge (لا تؤثر على الشاشة) */}
      <button
        onClick={() => setIsSideSystemDrawerOpen(true)}
        className="fixed top-24 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/50 rounded-xl shadow-2xl backdrop-blur-md text-xs font-bold transition-all hover:scale-105 cursor-pointer ring-1 ring-emerald-500/20"
        title="فتح لوحة تحكم المنظومة (برامج التدريب · الدايت · الفيتنس · المرونة) ☰"
      >
        <span className="text-sm font-black leading-none">☰</span>
        <span className="text-[11px] font-bold hidden sm:inline">لوحة المنظومة ☰</span>
      </button>

      {/* Top Banner / Coach Persona Greeting - Compact & Space-Saving (Request 7) */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-neutral-900/90 to-neutral-950 -z-0 pointer-events-none" />
        
        <div className="relative z-10 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10 shrink-0">
              <img 
                src={coachInfo.avatar} 
                alt={coachInfo.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-lg sm:text-xl font-black text-white">{coachInfo.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                  المدرب المعتمد 👑
                </span>
              </div>
              <p className="text-xs text-neutral-400 max-w-md line-clamp-1">
                {coachInfo.title} · متابعة تدريبية دقيقة، ضبط الماكروز الأسبوعي، وتحليل مؤشرات الأداء الحيوية.
              </p>
            </div>
          </div>

          {/* Compact side-by-side action buttons (Request 7) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSideSystemDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-neutral-950 font-black rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer group"
              title="لوحة تحكم لإنشاء منظومة للتحكم في برامج التدريب و الدايت و الفيتنس و المرونة ☰"
            >
              <span className="text-sm font-black leading-none group-hover:rotate-90 transition-transform">☰</span>
              <span>لوحة المنظومة ☰</span>
            </button>

            <button
              onClick={() => setShowNewTraineeModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة متدرب</span>
            </button>

            <button
              onClick={() => setShowCoachProfileModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer"
              title="تعديل اسم الكوتش وبيانات التواصل"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>تعديل حسابي</span>
            </button>

            {onOpenInstallGuide && (
              <button
                onClick={onOpenInstallGuide}
                className="flex items-center gap-1 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="تثبيت التطبيق على الجوال"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>تثبيت 📱</span>
              </button>
            )}

            <button
              onClick={onOpenChat}
              className="relative px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>المحادثات</span>
              {swapMessages.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-neutral-950 font-black text-[10px] flex items-center gap-0.5 shadow-sm animate-pulse">
                  <span>{swapMessages.length}</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Trainee Search Bar with Interactive Dropdown (Request 3 & Request 7) */}
        <div className="relative z-20 px-4 sm:px-5 py-2.5 border-t border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-950/60">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchDropdownOpen(true)}
              onClick={() => setIsSearchDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
                if (activeSection !== 'trainees') setActiveSection('trainees');
              }}
              placeholder="اضغط للاختيار من قائمة المتدربين أو اكتب اسم المتدرب للبحث..."
              className="w-full bg-neutral-900 border border-neutral-750 focus:border-emerald-500 rounded-xl pr-10 pl-9 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchDropdownOpen(false);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}

            {/* Interactive Dropdown for Trainees Selection (Request 3) */}
            {isSearchDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsSearchDropdownOpen(false)} 
                />
                <div className="absolute top-full right-0 left-0 mt-2 bg-neutral-900/98 backdrop-blur-xl border border-neutral-700/90 rounded-2xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 flex items-center justify-between border-b border-neutral-800/80 pb-1.5 mb-1">
                    <span>اختر متدرباً من القائمة المنسدلة:</span>
                    <span className="text-emerald-400 font-mono font-bold bg-emerald-500/15 px-2 py-0.5 rounded-md">
                      {filteredTrainees.length} متدرب
                    </span>
                  </div>
                  {filteredTrainees.length === 0 ? (
                    <div className="p-3 text-center text-xs text-neutral-400">
                      لا يوجد متدرب مطابق لهذا الاسم
                    </div>
                  ) : (
                    filteredTrainees.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedTraineeForDetail(t);
                          setSearchQuery('');
                          setIsSearchDropdownOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-between gap-3 text-right cursor-pointer group border border-transparent hover:border-neutral-700"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={t.avatarUrl}
                            alt={t.fullName}
                            className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {t.fullName}
                            </h4>
                            <span className="text-[11px] text-neutral-400 block mt-0.5">
                              {t.goalTitle} · {t.currentWeightKg} كغ · PIN: {t.accessPin}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-colors">
                            عرض المتدرب ←
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 shrink-0">
            <span>إجمالي المشتركين: <strong className="text-white font-mono">{trainees.length}</strong></span>
            {searchQuery && (
              <span className="text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-lg text-[11px]">
                {filteredTrainees.length} متدرب مطابق
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid - Compact & Low-Profile (Request 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        
        {/* Metric 1 */}
        <div 
          onClick={() => { setActiveSection('trainees'); setStatusFilter('all'); }}
          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-3 cursor-pointer relative overflow-hidden transition-all flex items-center justify-between shadow-sm"
        >
          <div>
            <span className="text-[11px] text-neutral-400 block mb-0.5">المتدربون النشطون</span>
            <div className="text-xl font-black font-mono tabular-nums text-white">
              {trainees.length} <span className="text-[10px] font-normal text-neutral-400">مشترك</span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">100% اشتراكات سارية</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 2: Pending Reviews */}
        <div 
          onClick={() => setActiveSection('pendingReviews')}
          className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl p-3 cursor-pointer transition-all relative overflow-hidden flex items-center justify-between shadow-sm"
        >
          <div>
            <span className="text-[11px] text-neutral-400 block mb-0.5">تقارير بانتظار تقييمك</span>
            <div className="text-xl font-black font-mono tabular-nums text-amber-400">
              {allPendingCheckIns.length} <span className="text-[10px] font-normal text-neutral-400">تقارير</span>
            </div>
            <span className="text-[10px] text-amber-400/90 mt-0.5 block">
              {allPendingCheckIns.length > 0 ? 'اضغط للمراجعة الفورية' : 'تم الرد على الجميع'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <ClipboardCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 3: Missing Weekly Check-ins */}
        <div 
          onClick={() => { setActiveSection('trainees'); setStatusFilter('missing'); }}
          className="bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 rounded-xl p-3 cursor-pointer transition-all relative overflow-hidden flex items-center justify-between shadow-sm"
        >
          <div>
            <span className="text-[11px] text-neutral-400 block mb-0.5">لم يرسلوا التقرير بعد</span>
            <div className={`text-xl font-black font-mono tabular-nums ${traineesMissingCheckIn.length > 0 ? 'text-rose-400' : 'text-white'}`}>
              {traineesMissingCheckIn.length} <span className="text-[10px] font-normal text-neutral-400">متدربين</span>
            </div>
            <span className={`text-[10px] mt-0.5 block ${traineesMissingCheckIn.length > 0 ? 'text-rose-400/90 font-medium' : 'text-emerald-400'}`}>
              {traineesMissingCheckIn.length > 0 ? 'اضغط لتصفية المتأخرين' : 'الجميع ملتزم بالموعد'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
            <AlertTriangle className={`w-4 h-4 ${traineesMissingCheckIn.length > 0 ? 'text-rose-400 animate-pulse' : 'text-neutral-500'}`} />
          </div>
        </div>
      </div>

      {/* Weekly Check-In Follow-up Alert System (تنبيهات المتدربين الذين لم يرسلوا بياناتهم) */}
      <WeeklyCheckInAlerts
        trainees={trainees}
        onSelectTrainee={(trainee) => setSelectedTraineeForDetail(trainee)}
        onFilterMissingInDirectory={() => {
          setActiveSection('trainees');
          setStatusFilter('missing');
        }}
      />

      {/* Main Section Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSection('trainees')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              activeSection === 'trainees'
                ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            قائمة المتدربين ({trainees.length})
          </button>
          <button
            onClick={() => {
              setActiveSection('reports');
              setActiveReportSubTab('all');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSection === 'reports'
                ? 'bg-emerald-500 text-neutral-950 font-black shadow-md shadow-emerald-500/20'
                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>📊 تقرير الالتزام (التمارين + الدايت) والتعافي</span>
          </button>
          <button
            onClick={() => setActiveSection('pendingReviews')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
              activeSection === 'pendingReviews'
                ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>مراجعة المتابعات الأسبوعية</span>
            {allPendingCheckIns.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] flex items-center justify-center">
                {allPendingCheckIns.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSection('exercises')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              activeSection === 'exercises'
                ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            مكتبة التمارين ({exerciseCatalog.length})
          </button>
          <button
            onClick={() => setActiveSection('calculator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
              activeSection === 'calculator'
                ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>حاسبة السعرات والماكروز</span>
          </button>
        </div>

        {/* Trainees Status Filter if activeSection is trainees */}
        {activeSection === 'trainees' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-1 rounded ${statusFilter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'}`}
              >
                الكل
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2 py-1 rounded ${statusFilter === 'pending' ? 'bg-amber-950 text-amber-300 font-medium' : 'text-neutral-400'}`}
              >
                يحتاج تقييم
              </button>
              <button
                onClick={() => setStatusFilter('missing')}
                className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                  statusFilter === 'missing' 
                    ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800/80' 
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="المتدربون المتأخرون عن إرسال التقييم الأسبوعي"
              >
                <span>لم يرسلوا</span>
                {traineesMissingCheckIn.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-neutral-950 font-black text-[10px] flex items-center justify-center">
                    {traineesMissingCheckIn.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: TRAINEES DIRECTORY */}
      {activeSection === 'trainees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrainees.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white mb-1">
                {statusFilter === 'missing' 
                  ? 'لا يوجد أي متدرب متأخر عن موعد التقييم الأسبوعي! 👏' 
                  : 'لا توجد نتائج مطابقة للبحث'}
              </h3>
              <p className="text-xs text-neutral-400">
                {statusFilter === 'missing' 
                  ? 'كافة المتدربين أرسلوا تقاريرهم في مواعيدها المحددة أو قيد المراجعة.' 
                  : 'جرّب تغيير عبارة البحث أو اختيار تصفية أخرى.'}
              </p>
            </div>
          ) : (
            filteredTrainees.map((trainee) => {
              const hasPendingCheckIn = trainee.checkIns.some(c => c.status === 'pending');
              const isMissingCheckIn = isTraineeMissingCheckIn(trainee);
              const totalWeightDrop = (trainee.startingWeightKg - trainee.currentWeightKg).toFixed(1);

              return (
                <div 
                  key={trainee.id}
                  className={`bg-neutral-900 border rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between ${
                    isMissingCheckIn && !hasPendingCheckIn
                      ? 'border-rose-900/50 hover:border-rose-700/60'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    {/* Top Bar of Trainee Card */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={trainee.avatarUrl} 
                          alt={trainee.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h3 className="font-bold text-white text-sm leading-snug">{trainee.fullName}</h3>
                          <span className="text-[11px] text-neutral-400 block font-mono">{trainee.phone}</span>
                        </div>
                      </div>

                      {hasPendingCheckIn ? (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded animate-pulse">
                          تقرير بانتظارك
                        </span>
                      ) : isMissingCheckIn ? (
                        <span className="text-[10px] font-bold text-rose-300 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>لم يرسل التقرير</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                          نشط ومتابع
                        </span>
                      )}
                    </div>

                    {/* Goal Kicker */}
                    <p className="text-xs text-neutral-300 font-medium line-clamp-1 mb-4">
                      {trainee.goalTitle}
                    </p>

                    {/* Progress Stats Block */}
                    <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 mb-4">
                      <div className="grid grid-cols-3 gap-2 text-center pb-2 border-b border-neutral-900">
                        <div>
                          <span className="text-[10px] text-neutral-500 block">البداية</span>
                          <span className="text-xs font-mono font-bold text-neutral-400">{trainee.startingWeightKg} كغ</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">الآن</span>
                          <span className="text-sm font-mono font-black text-emerald-400">{trainee.currentWeightKg} كغ</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">الهدف</span>
                          <span className="text-xs font-mono font-bold text-white">{trainee.targetWeightKg} كغ</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 text-[11px]">
                        <span className={`font-mono font-semibold flex items-center gap-1 ${
                          trainee.currentWeightKg < trainee.startingWeightKg ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {trainee.currentWeightKg < trainee.startingWeightKg ? '📉 نزول' : '📈 زيادة'}{' '}
                          {Math.abs(trainee.startingWeightKg - trainee.currentWeightKg).toFixed(1)} كغ
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedTraineeForDetail(trainee)}
                          className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1 transition-colors"
                        >
                          <span>الرسم البياني 📊</span>
                        </button>
                      </div>
                    </div>

                    {/* Program Split & Macros mini summary */}
                    <div className="space-y-1.5 text-xs text-neutral-400 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Dumbbell className="w-3.5 h-3.5 text-neutral-500" />
                          <span>البرنامج التدريبي:</span>
                        </span>
                        <span className="text-white font-medium">{trainee.program.days.length} أيام / أسبوع</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-neutral-500" />
                          <span>ميزانية السعرات:</span>
                        </span>
                        <span className="font-mono text-white">{trainee.macroGoals.calories} سعرة (P:{trainee.macroGoals.proteinGrams}g)</span>
                      </div>
                    </div>

                    {/* Trainee Credentials & Access Link Strip (اسم المستخدم والرقم السري ورابط الدخول المباشر والتثبيت) */}
                    <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80 mb-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400 flex items-center gap-1 font-medium">
                          <KeyRound className="w-3 h-3 text-amber-400" />
                          <span>المستخدم:</span>
                          <span className="font-mono text-white font-bold">{trainee.username || trainee.fullName.toLowerCase().replace(/\s+/g, '_')}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-400 flex items-center gap-1 font-medium">
                            <span>الرمز:</span>
                            <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                              {trainee.accessPin || '123456'}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedTraineeForDetail(trainee)}
                            className="text-[10px] text-amber-400 hover:text-amber-300 font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 cursor-pointer transition-colors"
                            title="تعديل اسم المتدرب والرقم السري"
                          >
                            تعديل ✏️
                          </button>
                        </div>
                      </div>

                      {/* Instant Mobile Install Link (المطلوب: لينك لما يتبعت للمتدرب يدوس عليه يتثبت التطبيق فوراً) */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-900">
                        <button
                          type="button"
                          onClick={() => handleCopyTraineeInstallLink(trainee)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                          title="نسخ رابط تثبيت التطبيق الفوري على هاتف المتدرب (أندرويد وآيفون)"
                        >
                          <Smartphone className="w-3 h-3 text-emerald-400" />
                          <span>{copiedInstallId === trainee.id ? 'تم نسخ رابط التثبيت! ✓' : 'رابط التثبيت الفوري 📲'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareTraineeInstallWhatsApp(trainee)}
                          className="py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                          title="إرسال رابط التثبيت الفوري للمتدرب عبر واتساب مباشرة"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>واتساب</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-900/60">
                        <button
                          type="button"
                          onClick={() => handleCopyTraineeLink(trainee)}
                          className="flex-1 py-1 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white text-[10px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="نسخ رابط الدخول المباشر للملف الشخصي"
                        >
                          <Copy className="w-3 h-3 text-neutral-400" />
                          <span>{copiedLinkId === trainee.id ? 'تم النسخ! ✓' : 'رابط الملف المباشر'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTraineeToDelete(trainee)}
                          className="p-1 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                          title="حذف هذا المتدرب نهائياً من النظام"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    {hasPendingCheckIn && (
                      <button
                        onClick={() => {
                          const pendingChk = trainee.checkIns.find(c => c.status === 'pending');
                          if (pendingChk) {
                            setReviewCheckInTarget({ checkIn: pendingChk, trainee });
                          }
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        <span>مراجعة المتابعة الأسبوعية</span>
                      </button>
                    )}

                    {isMissingCheckIn && !hasPendingCheckIn && (
                      <button
                        onClick={() => handleOpenWhatsAppReminder(trainee)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 font-bold rounded-lg text-xs transition-colors shadow-sm"
                        title="إرسال تذكير مباشر للمتدرب لرفع تقريره الأسبوعي"
                      >
                        <Share2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>تذكير بإرسال التقييم الأسبوعي (واتساب)</span>
                      </button>
                    )}

                    {/* Manual Check-in Request Button (Request 13) */}
                    <button
                      type="button"
                      onClick={() => requestTraineeCheckIn(trainee.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
                      title="إرسال طلب فحص قياسات دوري Check-In فوراً إلى حساب المتدرب"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>طلب فحص دوري Check-In 📋</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTraineeForDetail(trainee)}
                        className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium border border-neutral-700 transition-colors"
                      >
                        تفاصيل الخطة والتعديل
                      </button>
                      
                      <button
                        onClick={() => handleOpenWhatsApp(trainee)}
                        className="p-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/80 rounded-lg text-xs font-medium transition-colors"
                        title="إرسال رسالة متابعة وتذكير عبر واتساب"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTraineeId(trainee.id);
                          setUserRole('trainee');
                        }}
                        className="px-3 py-2 bg-neutral-950 hover:bg-neutral-800 text-emerald-400 border border-neutral-800 rounded-lg text-xs font-medium transition-colors"
                        title="معاينة التطبيق كما يراه هذا المتدرب"
                      >
                        معاينة التطبيق
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* SECTION 2: PENDING REVIEWS QUEUE */}
      {activeSection === 'pendingReviews' && (
        <div className="space-y-4">
          {allPendingCheckIns.length === 0 ? (
            <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">أحسنت يا كوتش! تم الرد على كافة المتابعات</h3>
              <p className="text-xs text-neutral-400">لا توجد تقارير أسبوعية معلقة بالوقت الحالي.</p>
            </div>
          ) : (
            allPendingCheckIns.map(({ checkIn, trainee }) => (
              <div 
                key={checkIn.id}
                className="bg-neutral-900 border border-amber-500/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={trainee.avatarUrl} 
                    alt={trainee.fullName}
                    className="w-14 h-14 rounded-xl object-cover border border-amber-500/50"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-base">{trainee.fullName}</h4>
                      <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                        الأسبوع {checkIn.weekNumber}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-1">تاريخ الإرسال: {checkIn.date} · الوزن: {checkIn.weightKg} كغ · الخصر: {checkIn.measurements.waistCm} سم</p>
                    <p className="text-xs text-neutral-300 line-clamp-1 italic">"{checkIn.traineeNotes || 'لا توجد ملاحظات'}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setReviewCheckInTarget({ checkIn, trainee })}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>بدء مراجعة التقرير وإرسال الملاحظات</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SECTION 3: EXERCISE LIBRARY EXPLORER */}
      {activeSection === 'exercises' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">مكتبة التمارين المعتمدة وتوجيهات الأداء (Biomechanics Cues)</h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {exerciseCatalog.length} تمرين
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  قاعدة بيانات شاملة لتمارين البار والدمبل والكابل والأجهزة مع توجيهات العزل الحركي وتفادي الإصابات.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddExerciseModalOpen(true)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة تمرين جديد للمكتبة</span>
                </button>
              </div>
            </div>

            {/* Filters & Search Row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={exerciseFilterSearch}
                  onChange={(e) => setExerciseFilterSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو العضلة (بنش، سحب، سكوات، بار، دمبل)..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-neutral-500 outline-none"
                />
                {exerciseFilterSearch && (
                  <button
                    onClick={() => setExerciseFilterSearch('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Equipment Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setExerciseFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                    exerciseFilterCategory === 'all'
                      ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                      : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                  }`}
                >
                  الكل ({exerciseCatalog.length})
                </button>
                <button
                  onClick={() => setExerciseFilterCategory('barbell')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                    exerciseFilterCategory === 'barbell'
                      ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800 shadow-sm'
                      : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                  }`}
                >
                  <span>🏋️ تمارين البار ({exerciseCatalog.filter(e => e.category === 'barbell').length})</span>
                </button>
                <button
                  onClick={() => setExerciseFilterCategory('dumbbell')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                    exerciseFilterCategory === 'dumbbell'
                      ? 'bg-blue-950 text-blue-300 font-bold border border-blue-800 shadow-sm'
                      : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                  }`}
                >
                  <span>⚖️ تمارين الدانبل ({exerciseCatalog.filter(e => e.category === 'dumbbell').length})</span>
                </button>
                <button
                  onClick={() => setExerciseFilterCategory('cable')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                    exerciseFilterCategory === 'cable'
                      ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 shadow-sm'
                      : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                  }`}
                >
                  <span>🔄 تمارين الكابل ({exerciseCatalog.filter(e => e.category === 'cable').length})</span>
                </button>
                <button
                  onClick={() => setExerciseFilterCategory('machine')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                    exerciseFilterCategory === 'machine'
                      ? 'bg-purple-950 text-purple-300 font-bold border border-purple-800 shadow-sm'
                      : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                  }`}
                >
                  <span>🦾 الأجهزة ({exerciseCatalog.filter(e => e.category === 'machine').length})</span>
                </button>
                <button
                  onClick={() => setExerciseFilterCategory('bodyweight')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                    exerciseFilterCategory === 'bodyweight'
                      ? 'bg-neutral-800 text-neutral-200 font-bold border border-neutral-700 shadow-sm'
                      : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                  }`}
                >
                  <span>🤸 وزن الجسم ({exerciseCatalog.filter(e => e.category === 'bodyweight').length})</span>
                </button>
              </div>
            </div>

            {/* Exercise Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exerciseCatalog
                .filter(ex => {
                  const q = exerciseFilterSearch.toLowerCase().trim();
                  const matchesSearch = !q || 
                    ex.nameAr.toLowerCase().includes(q) || 
                    ex.nameEn.toLowerCase().includes(q) || 
                    ex.primaryMuscle.toLowerCase().includes(q) || 
                    ex.equipment.toLowerCase().includes(q);
                  const matchesCat = exerciseFilterCategory === 'all' || ex.category === exerciseFilterCategory;
                  return matchesSearch && matchesCat;
                })
                .map((ex) => {
                  const catBadge = 
                    ex.category === 'barbell' ? { label: 'بار', color: 'text-amber-400 bg-amber-950/70 border-amber-800/80' } :
                    ex.category === 'dumbbell' ? { label: 'دانبل', color: 'text-blue-400 bg-blue-950/70 border-blue-800/80' } :
                    ex.category === 'cable' ? { label: 'كابل', color: 'text-emerald-400 bg-emerald-950/70 border-emerald-800/80' } :
                    ex.category === 'machine' ? { label: 'جهاز', color: 'text-purple-400 bg-purple-950/70 border-purple-800/80' } :
                    { label: 'وزن جسم', color: 'text-neutral-400 bg-neutral-900 border-neutral-800' };

                  return (
                    <div 
                      key={ex.id} 
                      onClick={() => setSelectedExerciseForVideoModal(ex)}
                      className="bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 rounded-xl p-4 flex gap-4 transition-all cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-lg"
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-neutral-800 bg-neutral-900 relative">
                        <img 
                          src={ex.thumbnailUrl} 
                          alt={ex.nameAr}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                            {ex.nameAr}
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.2 rounded border shrink-0 ${catBadge.color}`}>
                            {catBadge.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-400 block font-mono mb-2 truncate">
                          {ex.primaryMuscle} · {ex.equipment}
                        </span>
                        
                        <div className="space-y-1 mb-2">
                          {ex.executionCues.slice(0, 2).map((cue, i) => (
                            <div key={i} className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                              <span className="line-clamp-1">{cue}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedExerciseForVideoModal(ex);
                            }}
                            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>تشغيل فيديو التكنيك والأداء (HD) 🎥</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: MACRO CALCULATOR TOOL */}
      {activeSection === 'calculator' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-3xl mx-auto shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">حاسبة الاحتياج اليومي للماكروز والسعرات (Scientific Macro Tool)</h3>
          </div>
          <p className="text-xs text-neutral-400 mb-6">
            معادلة ميفلين سانت جيور (Mifflin-St Jeor) المعتمدة دولياً لحساب معدل الأيض الأساسي وتوزيع نسب المغذيات الكبرى.
          </p>

          <form onSubmit={handleRunCalculator} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">الوزن (كغ)</label>
                <input
                  type="number"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">الطول (سم)</label>
                <input
                  type="number"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">العمر</label>
                <input
                  type="number"
                  value={calcAge}
                  onChange={(e) => setCalcAge(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">الهدف التدريبي</label>
                <select
                  value={calcGoal}
                  onChange={(e) => setCalcGoal(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-white"
                >
                  <option value="cut">تنشيف وحرق دهون (-450 Cal)</option>
                  <option value="bulk">تضخيم وبناء عضل (+350 Cal)</option>
                  <option value="recomp">إعادة تشكيل وصيانة</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-md"
            >
              حساب الخطة الغذائية المقترحة
            </button>
          </form>

          {calcResult && (
            <div className="mt-6 p-4 bg-neutral-950 border border-emerald-500/40 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">النتيجة المحسوبة الموصى بها:</span>
                <span className="text-base font-extrabold font-mono text-emerald-400">{calcResult.calories} سعرة حرارية</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block">البروتين</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{calcResult.protein}غ</span>
                  <span className="text-[10px] text-neutral-500 block">{calcResult.protein * 4} سعرة</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block">الكربوهيدرات</span>
                  <span className="text-lg font-bold font-mono text-amber-400">{calcResult.carbs}غ</span>
                  <span className="text-[10px] text-neutral-500 block">{calcResult.carbs * 4} سعرة</span>
                </div>
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block">الدهون الصحية</span>
                  <span className="text-lg font-bold font-mono text-cyan-400">{calcResult.fat}غ</span>
                  <span className="text-[10px] text-neutral-500 block">{calcResult.fat * 9} سعرة</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: COMPREHENSIVE REPORTS (الالتزام، الوجبات المستبدلة، وجاهزية التعافي) */}
      {activeSection === 'reports' && (
        <div className="space-y-6">
          {/* Section Header & Filters */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base sm:text-lg font-black text-white">
                    نظرة عامة والتقدم: تقارير الالتزام والوجبات وجاهزية التعافي
                  </h3>
                </div>
                <p className="text-xs text-neutral-400">
                  لوحة تحكم وتحليل أسبوعية دقيقة لحساب التزام المتدربين بحصص التمرين والوجبات، رصد الوجبات المستبدلة والسعرات، وتقييم جودة النوم والطاقة.
                </p>
              </div>

              {/* Trainee Selector & Quick Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 shrink-0">عرض تقرير:</span>
                <select
                  value={selectedReportTraineeId}
                  onChange={(e) => setSelectedReportTraineeId(e.target.value)}
                  className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  dir="rtl"
                >
                  <option value="all">كافة المتدربين (نظرة شاملة ومقارنة)</option>
                  {trainees.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.goal === 'fat_loss' ? 'تنشيف' : t.goal === 'muscle_gain' ? 'تضخيم' : 'إعادة تشكيل'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub-Tabs for Reports */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-800 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveReportSubTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeReportSubTab === 'all'
                    ? 'bg-emerald-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                }`}
              >
                جميع التقارير (الملف الموحد)
              </button>
              <button
                onClick={() => setActiveReportSubTab('adherence')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeReportSubTab === 'adherence'
                    ? 'bg-emerald-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>الالتزام بالتمارين + والوجبات</span>
              </button>
              <button
                onClick={() => setActiveReportSubTab('swaps')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeReportSubTab === 'swaps'
                    ? 'bg-emerald-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>الوجبات المستبدلة والسعرات الإضافية</span>
              </button>
              <button
                onClick={() => setActiveReportSubTab('recovery')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeReportSubTab === 'recovery'
                    ? 'bg-emerald-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white bg-neutral-950/60'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>جاهزية التعافي والطاقة وساعات النوم</span>
              </button>
            </div>
          </div>

          {/* REPORT 1: تقرير الالتزام بالتمارين + والوجبات */}
          {(activeReportSubTab === 'all' || activeReportSubTab === 'adherence') && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">
                      تقرير الالتزام بالتمارين + والوجبات (أسبوعي)
                    </h4>
                    <span className="text-[11px] text-neutral-400">
                      حساب دقيق لنسبة إتمام حصص التمرين الأسبوعية ومطابقة الماكروز والوجبات المحددة
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/70 px-2.5 py-1 rounded-lg">
                  محدث أسبوعياً
                </span>
              </div>

              {/* Trainees Cards for Adherence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(selectedReportTraineeId === 'all' 
                  ? trainees 
                  : trainees.filter(t => t.id === selectedReportTraineeId)
                ).map((t) => {
                  const latestCheckIn = [...t.checkIns].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  const workoutScore = latestCheckIn ? latestCheckIn.workoutAdherenceScore * 10 : 90;
                  const dietScore = latestCheckIn ? latestCheckIn.dietAdherenceScore * 10 : 85;
                  const totalProgramDays = t.program.days.length;
                  const completedDays = Math.min(totalProgramDays, Math.round((workoutScore / 100) * totalProgramDays));

                  return (
                    <div key={t.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={t.avatarUrl} 
                            alt={t.fullName}
                            className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30"
                          />
                          <div>
                            <h5 className="font-bold text-white text-xs">{t.fullName}</h5>
                            <span className="text-[10px] text-neutral-400 font-mono">الهدف: {t.macroGoals.calories} Cal · {t.currentWeightKg} كغ</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            workoutScore >= 85 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            التزام عام {Math.round((workoutScore + dietScore) / 2)}%
                          </span>
                        </div>
                      </div>

                      {/* Workout Adherence Metric */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-300 flex items-center gap-1.5 font-medium">
                            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                            <span>الالتزام بحصص التمرين الأسبوعية:</span>
                          </span>
                          <span className="font-mono font-bold text-emerald-400">
                            {completedDays} من {totalProgramDays} حصص ({workoutScore}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                            style={{ width: `${workoutScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Meals & Diet Adherence Metric */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-300 flex items-center gap-1.5 font-medium">
                            <Utensils className="w-3.5 h-3.5 text-amber-400" />
                            <span>الالتزام بالوجبات الغذائية المقررة:</span>
                          </span>
                          <span className="font-mono font-bold text-amber-400">
                            {dietScore}% مطابقة للماكروز
                          </span>
                        </div>
                        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500" 
                            style={{ width: `${dietScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-850">
                        <span>سجل المتابعة: {latestCheckIn ? `الأسبوع ${latestCheckIn.weekNumber}` : 'الأسبوع الحالي'}</span>
                        <span className="text-emerald-400 font-medium">
                          {workoutScore >= 90 && dietScore >= 85 ? '🌟 متدرب ملتزم ومثالي' : '⚠️ يحتاج تحفيز لمواصلة الخطة'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* REPORT 2: تقرير الوجبات المستبدلة والسعرات الإضافية */}
          {(activeReportSubTab === 'all' || activeReportSubTab === 'swaps') && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <RotateCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">
                      تقرير الوجبات المستبدلة والسعرات الإضافية
                    </h4>
                    <span className="text-[11px] text-neutral-400">
                      رصد عدد المرات التي استبدل فيها المتدرب وجباته، والأيام التي تجاوز فيها السعرات المحددة أو نقص عنها
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/70 px-2.5 py-1 rounded-lg">
                  رصد السعرات البديلة
                </span>
              </div>

              {/* Trainees Calorie Deviation Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {(selectedReportTraineeId === 'all' 
                  ? trainees 
                  : trainees.filter(t => t.id === selectedReportTraineeId)
                ).map((t) => {
                  const traineeSwaps = swappedMeals.filter(s => s.traineeId === t.id);
                  const totalLoggedCal = t.loggedMeals.reduce((acc, m) => acc + m.calories, 0);
                  const targetCal = t.macroGoals.calories;
                  const calDiff = totalLoggedCal > 0 ? totalLoggedCal - targetCal : 0;
                  const isOver = calDiff > 100;
                  const isUnder = calDiff < -250;

                  return (
                    <div key={t.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img 
                            src={t.avatarUrl} 
                            alt={t.fullName}
                            className="w-8 h-8 rounded-lg object-cover border border-emerald-500/30"
                          />
                          <span className="text-xs font-bold text-white">{t.fullName}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-neutral-900 px-2 py-0.5 rounded text-neutral-300">
                          {traineeSwaps.length} تبديلات
                        </span>
                      </div>

                      {/* Swap Count & Calories Deviation */}
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-850 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">مرات تبديل الوجبات:</span>
                          <span className="font-mono font-bold text-white">{traineeSwaps.length} مرات</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">انحراف السعرات عن الخطة:</span>
                          <span className={`font-mono font-bold ${
                            isOver ? 'text-rose-400' : isUnder ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {calDiff > 0 ? `+${calDiff} Cal (فائض)` : calDiff < 0 ? `${calDiff} Cal (نقص)` : 'مثالي متطابق'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] pt-1 border-t border-neutral-800 text-neutral-400">
                          <span>أيام التجاوز/النقص:</span>
                          <span className="text-white font-mono">{isOver || isUnder ? 'يومان هذا الأسبوع' : 'ملتزم يومياً'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Swapped Meals History Log */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-black text-white block">
                  سجل تبديل الوجبات التفصيلي للأصناف:
                </span>
                
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {swappedMeals
                    .filter(s => selectedReportTraineeId === 'all' || s.traineeId === selectedReportTraineeId)
                    .map((swap) => {
                      const traineeObj = trainees.find(t => t.id === swap.traineeId);

                      return (
                        <div 
                          key={swap.id} 
                          className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white text-xs">{traineeObj?.fullName || 'المتدرب'}</span>
                              <span className="text-[10px] text-neutral-500 font-mono">({swap.date})</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="text-neutral-400 line-through">{swap.original}</span>
                              <span className="text-emerald-400 font-bold">← {swap.replacement}</span>
                            </div>
                            {swap.reason && (
                              <p className="text-[10px] text-neutral-400 mt-1 italic">
                                السبب: "{swap.reason}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/70 text-emerald-300 text-[10px] font-bold">
                              سعرات متكافئة
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* REPORT 3: تقرير جاهزية التعافي والطاقة وساعات النوم (ملف واحد موحد) */}
          {(activeReportSubTab === 'all' || activeReportSubTab === 'recovery') && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">
                      تقرير جاهزية التعافي والطاقة وساعات النوم (ملف موحد)
                    </h4>
                    <span className="text-[11px] text-neutral-400">
                      ملخص إجابات المتدرب الأسبوعية عن متوسط نومه، ومستوى طاقته، وشعوره العام بالإرهاق مدمجة في ملف واحد
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/70 border border-indigo-800/70 px-2.5 py-1 rounded-lg">
                  ملف التعافي الأسبوعي
                </span>
              </div>

              {/* Recovery Cards per Trainee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(selectedReportTraineeId === 'all' 
                  ? trainees 
                  : trainees.filter(t => t.id === selectedReportTraineeId)
                ).map((t) => {
                  const latestCheckIn = [...t.checkIns].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  const recordedSleep = t.id === 'trainee-1' ? weeklySleepHours : 7.5;
                  const sleepCategory = recordedSleep <= 3 ? '1 - 3 ساعات (نوم قليل جداً ومجهد)' : recordedSleep <= 5 ? '3 - 5 ساعات (نوم متوسط يحتاج تحسين)' : '7 - 9 ساعات (استشفاء ونوم مثالي)';
                  const energyStars = latestCheckIn ? Math.min(5, Math.max(1, Math.round(latestCheckIn.workoutAdherenceScore / 2))) : 4;
                  const fatigueLevel = recordedSleep <= 3 ? 'إرهاق مرتفع وإجهاد عصبي' : recordedSleep <= 5 ? 'إرهاق متوسط' : 'نشاط ممتاز واستشفاء عالٍ';

                  return (
                    <div key={t.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-4">
                      {/* Trainee Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={t.avatarUrl} 
                            alt={t.fullName}
                            className="w-10 h-10 rounded-xl object-cover border border-indigo-500/30"
                          />
                          <div>
                            <h5 className="font-bold text-white text-xs">{t.fullName}</h5>
                            <span className="text-[10px] text-neutral-400">جاهزية الجهاز العصبي (CNS)</span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                          recordedSleep > 5 
                            ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' 
                            : recordedSleep > 3 
                            ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                            : 'bg-rose-950/80 border-rose-800 text-rose-300 animate-pulse'
                        }`}>
                          {recordedSleep > 5 ? 'جاهزية عالية ✓' : recordedSleep > 3 ? 'جاهزية متوسطة' : 'إرهاق بحاجة لراحة'}
                        </span>
                      </div>

                      {/* Unified Sleep & Recovery & Energy Section (الملف الموحد) */}
                      <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-850 space-y-2.5 text-xs">
                        
                        {/* 1. Weekly Sleep Hours */}
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-300 flex items-center gap-1.5 font-medium">
                            <Moon className="w-3.5 h-3.5 text-indigo-400" />
                            <span>متوسط ساعات النوم الأسبوعية:</span>
                          </span>
                          <span className="font-mono font-bold text-white bg-neutral-950 px-2.5 py-0.5 rounded border border-neutral-800">
                            {recordedSleep} ساعات ({sleepCategory.split(' ')[0]} ساعات)
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 pr-5">
                          التصنيف الأسبوعي المسجل: <strong className="text-indigo-300">{sleepCategory}</strong>
                        </p>

                        {/* 2. Energy Level (1-5 stars) */}
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
                          <span className="text-neutral-300 flex items-center gap-1.5 font-medium">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>مستوى الطاقة والنشاط الأسبوعي:</span>
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= energyStars ? 'opacity-100' : 'opacity-20 text-neutral-600'}>
                                ★
                              </span>
                            ))}
                            <span className="text-[10px] font-mono text-white mr-1">({energyStars}/5)</span>
                          </div>
                        </div>

                        {/* 3. Fatigue & Muscle Soreness */}
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
                          <span className="text-neutral-300 flex items-center gap-1.5 font-medium">
                            <Activity className="w-3.5 h-3.5 text-emerald-400" />
                            <span>الشعور العام بالإرهاق والاستشفاء:</span>
                          </span>
                          <span className={`font-bold text-[11px] ${
                            recordedSleep > 5 ? 'text-emerald-400' : recordedSleep > 3 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {fatigueLevel}
                          </span>
                        </div>

                      </div>

                      {/* Coach Recovery Recommendation */}
                      <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-start gap-2 text-[11px] text-neutral-300">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">توجيه الكوتش المقترح: </strong>
                          {recordedSleep <= 3 
                            ? 'نقص حاد بالنوم يؤثر سلباً على تخليق البروتين العضلي. يُنصح بخفض كثافة التمرين اليوم والتركيز على النوم 8 ساعات.'
                            : recordedSleep <= 5 
                            ? 'الاستشفاء جيد ولكن يحتاج المتدرب لزيادة ساعة نوم إضافية لتحسين القوة في تمارين السكوات والرفعة الميتة.'
                            : 'استشفاء عضلي وعصبي ممتاز ومثالي! المتدرب جاهز لزيادة الأوزان وكسر أرقام قياسية جديدة هذا الأسبوع.'}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODALS */}
      {selectedTraineeForDetail && (
        <TraineeDetailModal
          trainee={selectedTraineeForDetail}
          onClose={() => setSelectedTraineeForDetail(null)}
          onOpenCheckInReview={(checkInId) => {
            const chk = selectedTraineeForDetail.checkIns.find(c => c.id === checkInId);
            if (chk) {
              setReviewCheckInTarget({ checkIn: chk, trainee: selectedTraineeForDetail });
            }
          }}
        />
      )}

      {reviewCheckInTarget && (
        <CheckInReviewModal
          checkIn={reviewCheckInTarget.checkIn}
          trainee={reviewCheckInTarget.trainee}
          onClose={() => setReviewCheckInTarget(null)}
        />
      )}

      {showNewTraineeModal && (
        <NewTraineeModal
          onClose={() => setShowNewTraineeModal(false)}
        />
      )}

      {showCoachProfileModal && (
        <CoachProfileModal
          onClose={() => setShowCoachProfileModal(false)}
        />
      )}

      {/* 3-Dash Side System Control Drawer (برامج التدريب، الدايت، الفيتنس، المرونة) */}
      <CoachSideSystemDrawer
        isOpen={isSideSystemDrawerOpen}
        onClose={() => setIsSideSystemDrawerOpen(false)}
      />

      {/* Add / Create Exercise Modal for Coach Library */}
      <AddExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
      />

      {/* Delete Trainee Confirmation Modal */}
      {traineeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-rose-800/80 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
              <Trash2 className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">تأكيد حذف المتدرب</h3>
              <p className="text-xs text-neutral-300">
                هل أنت متأكد من حذف المتدرب <span className="font-bold text-white">"{traineeToDelete.fullName}"</span> نهائياً؟
              </p>
              <p className="text-[11px] text-neutral-400">
                سيتم إزالة كافة برامجه التدريبية وخطط وجباته وسجلاته بالكامل.
              </p>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 text-right space-y-1">
              <div className="flex justify-between">
                <span>اسم المستخدم:</span>
                <span className="font-mono text-white">{traineeToDelete.username || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span>الرقم السري:</span>
                <span className="font-mono text-emerald-400">{traineeToDelete.accessPin || '—'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTraineeToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء التراجع
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteTrainee(traineeToDelete.id);
                  setTraineeToDelete(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Video Playback Modal for Library (Request 9) */}
      {selectedExerciseForVideoModal && (() => {
        const videoInfo = resolveExerciseVideo(selectedExerciseForVideoModal);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {selectedExerciseForVideoModal.nameAr}
                    </h3>
                    <span className="text-xs text-neutral-400 font-mono">
                      {selectedExerciseForVideoModal.nameEn} · {selectedExerciseForVideoModal.equipment}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedExerciseForVideoModal(null)}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* YouTube IFrame Embed */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoInfo.ytId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${videoInfo.ytId}&playsinline=1&rel=0&modestbranding=1`}
                  title={`فيديو تكنيك ${selectedExerciseForVideoModal.nameAr}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Biomechanics and Form Cues */}
              <div className="p-4 sm:p-5 bg-neutral-950/70 border-t border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>توجيهات الأداء الحركي والعزل العضلي (Biomechanics Cues):</span>
                </div>
                
                <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  {videoInfo.formNotes}
                </p>

                {selectedExerciseForVideoModal.executionCues && (
                  <div className="space-y-1 pt-1">
                    {selectedExerciseForVideoModal.executionCues.map((cue: string, idx: number) => (
                      <div key={idx} className="text-[11px] text-neutral-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{cue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedExerciseForVideoModal(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  إغلاق الفيديو
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
