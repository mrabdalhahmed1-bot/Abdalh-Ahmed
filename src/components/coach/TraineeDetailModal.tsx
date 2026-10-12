import React, { useState } from 'react';
import { TraineeProfile, MacroGoals, WorkoutProgram, WorkoutExercise } from '../../types/fitness';
import { useFitness } from '../../context/FitnessContext';
import { getPublicInstallUrl, getPublicTraineeProfileUrl, PUBLIC_SHARED_APP_URL } from '../../utils/appUrl';
import { WeightProgressChart } from '../common/WeightProgressChart';
import { AddExerciseModal } from './AddExerciseModal';
import { 
  X, 
  Dumbbell, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Scale, 
  Clock, 
  Sparkles,
  ChevronRight,
  TrendingDown,
  Copy,
  Minus,
  Key,
  Eye,
  EyeOff,
  Share2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Utensils,
  Smartphone,
  QrCode,
  Download
} from 'lucide-react';

interface TraineeDetailModalProps {
  trainee: TraineeProfile;
  onClose: () => void;
  onOpenCheckInReview: (checkInId: string) => void;
}

export const TraineeDetailModal: React.FC<TraineeDetailModalProps> = ({ 
  trainee, 
  onClose,
  onOpenCheckInReview 
}) => {
  const { 
    updateTraineeMacros, 
    updateTraineeProgram, 
    updateTraineeCredentials,
    updateTraineeProfile,
    deleteTrainee,
    setCurrentTraineeId,
    setUserRole,
    loginTraineeDirect,
    triggerCheer,
    exerciseCatalog 
  } = useFitness();

  const [activeTab, setActiveTab] = useState<'overview' | 'program' | 'macros' | 'checkins' | 'credentials'>('overview');

  // Credentials State
  const [fullNameInput, setFullNameInput] = useState(trainee.fullName);
  const [usernameInput, setUsernameInput] = useState(trainee.username || trainee.fullName.toLowerCase().replace(/\s+/g, '_'));
  const [pinInput, setPinInput] = useState(trainee.accessPin || '123456');
  const [showPin, setShowPin] = useState(false);
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Macros state for editing
  const [macros, setMacros] = useState<MacroGoals>(trainee.macroGoals);
  const [isSavingMacros, setIsSavingMacros] = useState(false);

  // Program state for editing
  const [program, setProgram] = useState<WorkoutProgram>(trainee.program);
  const [isSavingProgram, setIsSavingProgram] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  const directAccessLink = getPublicTraineeProfileUrl(trainee.id);
  const directInstallLink = getPublicInstallUrl(trainee.id);
  const [copiedInstallLink, setCopiedInstallLink] = useState(false);
  const [showInstallQR, setShowInstallQR] = useState(false);

  const handleCopyInstallLink = () => {
    navigator.clipboard.writeText(directInstallLink);
    setCopiedInstallLink(true);
    triggerCheer('تم نسخ رابط تثبيت التطبيق الفوري للهاتف 📲');
    setTimeout(() => setCopiedInstallLink(false), 2500);
  };

  const handleShareInstallWhatsApp = () => {
    const text = `مرحباً يا ${trainee.fullName}! 💪\nرابط تثبيت تطبيق التدريب والتغذية المباشر على هاتفك (أندرويد وآيفون):\n${directInstallLink}\n\nاضغط على الرابط وسيتثبت التطبيق فوراً على شاشتك الرئيسية ويعمل بشاشة كاملة كأي تطبيق هاتف أصلي! 🚀`;
    const cleanPhone = trainee.phone.replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSaveCredentials = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingCredentials(true);
    updateTraineeCredentials(trainee.id, usernameInput.trim(), pinInput.trim(), fullNameInput.trim());
    updateTraineeProfile(trainee.id, {
      fullName: fullNameInput.trim() || trainee.fullName,
      username: usernameInput.trim() || trainee.username,
      accessPin: pinInput.trim() || trainee.accessPin
    });
    setTimeout(() => setIsSavingCredentials(false), 500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directAccessLink);
    setCopiedLink(true);
    triggerCheer('تم نسخ رابط الدخول المباشر للمتدرب 📋');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `مرحباً بك يا ${trainee.fullName}! رابط دخولك المباشر لملفك الشخصي وخطة التدريب والتغذية في تطبيق كوتش عبدالله قاسم:\n${directAccessLink}\n\nاسم المستخدم: ${usernameInput}\nالرمز السري: ${pinInput}`;
    const cleanPhone = trainee.phone.replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleLoginAsTrainee = () => {
    loginTraineeDirect(trainee.id);
    onClose();
  };

  const handleDeleteTraineeConfirm = () => {
    deleteTrainee(trainee.id);
    onClose();
  };

  const handleSaveMacros = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMacros(true);
    updateTraineeMacros(trainee.id, macros);
    setTimeout(() => setIsSavingMacros(false), 500);
  };

  const handleSaveProgram = () => {
    setIsSavingProgram(true);
    updateTraineeProgram(trainee.id, program);
    setTimeout(() => setIsSavingProgram(false), 500);
  };

  const handleAddFullExercise = (newEx: WorkoutExercise) => {
    const updatedDays = [...program.days];
    if (!updatedDays[selectedDayIndex]) return;
    updatedDays[selectedDayIndex].exercises.push(newEx);
    setProgram({ ...program, days: updatedDays });
  };

  const handleAddExerciseToCurrentDay = (masterExerciseId: string) => {
    const found = exerciseCatalog.find(e => e.id === masterExerciseId);
    if (!found) return;

    const newEx: WorkoutExercise = {
      id: `ex-${Date.now()}`,
      nameAr: found.nameAr,
      nameEn: found.nameEn,
      primaryMuscle: found.primaryMuscle,
      equipment: found.equipment,
      thumbnailUrl: found.thumbnailUrl,
      executionCues: found.executionCues,
      sets: [
        { setNumber: 1, targetReps: found.defaultReps || '10', targetRpe: found.targetRpe || 8, restSeconds: found.restSeconds || 90 },
        { setNumber: 2, targetReps: found.defaultReps || '10', targetRpe: found.targetRpe || 8.5, restSeconds: found.restSeconds || 90 },
        { setNumber: 3, targetReps: found.defaultReps || '10', targetRpe: found.targetRpe || 9, restSeconds: found.restSeconds || 90 }
      ]
    };

    handleAddFullExercise(newEx);
  };

  const handleRemoveExercise = (dayIdx: number, exIdx: number) => {
    const updatedDays = [...program.days];
    updatedDays[dayIdx].exercises.splice(exIdx, 1);
    setProgram({ ...program, days: updatedDays });
  };

  const handleDuplicateExercise = (dayIdx: number, exIdx: number) => {
    const target = program.days[dayIdx].exercises[exIdx];
    if (!target) return;
    const clone: WorkoutExercise = {
      ...target,
      id: `ex-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      nameAr: `${target.nameAr} (مكرر)`,
      sets: target.sets.map(s => ({ ...s }))
    };
    const updatedDays = [...program.days];
    updatedDays[dayIdx].exercises.splice(exIdx + 1, 0, clone);
    setProgram({ ...program, days: updatedDays });
  };

  const handleAddSetToExercise = (dayIdx: number, exIdx: number) => {
    const updatedDays = [...program.days];
    const ex = updatedDays[dayIdx].exercises[exIdx];
    if (!ex) return;
    const nextSetNum = ex.sets.length + 1;
    const lastSet = ex.sets[ex.sets.length - 1];
    ex.sets.push({
      setNumber: nextSetNum,
      targetReps: lastSet ? lastSet.targetReps : '10',
      targetRpe: lastSet ? lastSet.targetRpe : 8.5,
      restSeconds: lastSet ? lastSet.restSeconds : 90
    });
    setProgram({ ...program, days: updatedDays });
  };

  const handleRemoveSetFromExercise = (dayIdx: number, exIdx: number) => {
    const updatedDays = [...program.days];
    const ex = updatedDays[dayIdx].exercises[exIdx];
    if (!ex || ex.sets.length <= 1) return;
    ex.sets.pop();
    setProgram({ ...program, days: updatedDays });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-100 my-8 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-4">
            <img 
              src={trainee.avatarUrl} 
              alt={trainee.fullName}
              className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{trainee.fullName}</h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  {trainee.currentWeightKg} كغ
                </span>
              </div>
              <p className="text-xs text-neutral-400">{trainee.goalTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-bold transition-colors cursor-pointer"
              title="حذف هذا المتدرب نهائياً من النظام"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>حذف المتدرب</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-800 bg-neutral-950/40 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-medium transition-colors border-b-2 shrink-0 ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            نظرة عامة والتقدم
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`pb-3 font-medium transition-colors border-b-2 shrink-0 flex items-center gap-1.5 ${
              activeTab === 'credentials'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>بيانات الدخول والرابط المباشر 🔑</span>
          </button>
          <button
            onClick={() => setActiveTab('program')}
            className={`pb-3 font-medium transition-colors border-b-2 shrink-0 ${
              activeTab === 'program'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            البرنامج التدريبي ({program.days.length} أيام)
          </button>
          <button
            onClick={() => setActiveTab('macros')}
            className={`pb-3 font-medium transition-colors border-b-2 shrink-0 ${
              activeTab === 'macros'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            الماكروز والتغذية ({macros.calories} سعرة)
          </button>
          <button
            onClick={() => setActiveTab('checkins')}
            className={`pb-3 font-medium transition-colors border-b-2 shrink-0 ${
              activeTab === 'checkins'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            سجل المتابعات الأسبوعية ({trainee.checkIns.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <span className="text-xs text-neutral-400 block mb-1">الوزن الحالي</span>
                  <div className="text-2xl font-bold font-mono tabular-nums text-white">
                    {trainee.currentWeightKg} <span className="text-xs font-normal text-neutral-400">كغ</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    الهدف: {trainee.targetWeightKg} كغ (باقي {(trainee.currentWeightKg - trainee.targetWeightKg).toFixed(1)} كغ)
                  </span>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <span className="text-xs text-neutral-400 block mb-1">معدل نزول الوزن</span>
                  <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 flex items-center">
                    <TrendingDown className="w-5 h-5 ml-1" />
                    {(trainee.startingWeightKg - trainee.currentWeightKg).toFixed(1)} كغ
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    منذ بداية الاشتراك في {trainee.startDate}
                  </span>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <span className="text-xs text-neutral-400 block mb-1">الالتزام بالتمارين</span>
                  <div className="text-2xl font-bold font-mono tabular-nums text-white">
                    95%
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    أكمل 15 من 16 جلسة مسندة
                  </span>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <span className="text-xs text-neutral-400 block mb-1">صلاحية الاشتراك</span>
                  <div className="text-sm font-bold font-mono text-white mt-1">
                    ينتهي في {trainee.subscriptionEnd}
                  </div>
                  <span className="text-[11px] text-emerald-400">
                    نشط ومنتظم
                  </span>
                </div>
              </div>

              {/* Graphical Weight Progression & Trend Chart */}
              <WeightProgressChart 
                trainee={trainee} 
                title="مؤشر الرسم البياني لصعود ونزول وزن المتدرب" 
              />

              {/* Trainee Profile Data Details */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
                  البيانات الحيوية والشخصية
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 block mb-1">العمر</span>
                    <span className="font-semibold text-white font-mono">{trainee.age} سنة</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">الطول</span>
                    <span className="font-semibold text-white font-mono">{trainee.heightCm} سم</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">الهاتف</span>
                    <span className="font-semibold text-white font-mono" dir="ltr">{trainee.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">البريد الإلكتروني</span>
                    <span className="font-semibold text-white">{trainee.email}</span>
                  </div>
                </div>
              </div>

              {/* Personal Records (أفضل الأرقام) */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  سجل الأرقام القياسية الشخصية (Personal Records - PR)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {trainee.personalRecords.map((pr, i) => (
                    <div key={i} className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-neutral-300 block">{pr.exerciseName}</span>
                        <span className="text-[11px] text-neutral-500 font-mono">{pr.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold font-mono text-emerald-400">{pr.weightKg} كغ</span>
                        <span className="text-[10px] text-neutral-400 block font-mono">× {pr.reps} عدات</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CREDENTIALS & ACCESS LINK (اسم المستخدم، الرقم السري والرابط المباشر للمتدرب) */}
          {activeTab === 'credentials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>بيانات دخول المتدرب والرابط المباشر للملف الشخصي</span>
                  </h4>
                  <p className="text-xs text-neutral-400">
                    يمكنك تغيير اسم المستخدم والرقم السري في أي وقت، وإرسال رابط فوري يفتح للمتدرب ملفه وبرنامجه مباشرة.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800/80 text-emerald-400 font-semibold">
                    حساب نشط ومفعّل 🔒
                  </span>
                </div>
              </div>

              {/* Form: Username and PIN */}
              <form onSubmit={handleSaveCredentials} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>بيانات المصادقة والتحكم (اسم المستخدم والرقم السري)</span>
                  </h5>
                  <span className="text-[11px] text-neutral-500">قابلة للتعديل والحفظ فوراً</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                      اسم المتدرب (Full Name) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullNameInput}
                        onChange={(e) => setFullNameInput(e.target.value)}
                        placeholder="مثال: يوسف جمال"
                        className="w-full bg-neutral-900 border border-neutral-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white placeholder-neutral-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1">اسم المتدرب الرسمي في الخطة</p>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                      اسم المستخدم (Username) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="e.g. youssef_gamal"
                        className="w-full bg-neutral-900 border border-neutral-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none transition-colors"
                        dir="ltr"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1">يُستخدم لتسجيل الدخول</p>
                  </div>

                  {/* Secret PIN */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                      الرقم السري أو رمز المرور (PIN / Password) *
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showPin ? 'text' : 'password'}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full bg-neutral-900 border border-neutral-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold tracking-wider text-emerald-400 placeholder-neutral-500 focus:outline-none transition-colors"
                        dir="ltr"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute left-2.5 p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title={showPin ? 'إخفاء الرمز' : 'إظهار الرمز'}
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-1">رمز الدخول السري للمتدرب</p>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingCredentials}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSavingCredentials ? 'تم الحفظ!' : 'حفظ اسم المتدرب والرقم السري'}</span>
                  </button>
                </div>
              </form>

              {/* Instant Mobile Install Link Box (المطلوب: لينك عند إرساله للمتدرب يتثبت التطبيق فوراً على هاتفه) */}
              <div className="bg-gradient-to-br from-emerald-950/60 via-neutral-950 to-neutral-900 border-2 border-emerald-500/60 rounded-2xl p-5 space-y-4 shadow-xl shadow-emerald-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                      <Smartphone className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-black text-white">رابط تثبيت التطبيق الفوري على الهاتف (Android & iOS)</h5>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-black">
                          تثبيت فوري 📲
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-300 mt-0.5">
                        عند إرسال هذا الرابط للمتدرب، بمجرد الضغط عليه يتثبت التطبيق فوراً على شاشته الرئيسية (أندرويد وآيفون) ويعمل بشاشة كاملة وبأيقونة التطبيق الرسمية!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Link Field with Copy */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={directInstallLink}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-300 focus:outline-none select-all"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={handleCopyInstallLink}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      copiedInstallLink
                        ? 'bg-emerald-400 text-neutral-950'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black shadow-md'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{copiedInstallLink ? 'تم نسخ رابط التثبيت! ✓' : 'نسخ رابط التثبيت'}</span>
                  </button>
                </div>

                {/* Actions: WhatsApp Share + QR Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleShareInstallWhatsApp}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl text-xs font-black transition-colors cursor-pointer shadow-md"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>إرسال رابط التثبيت عبر واتساب للمتدرب 📲</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowInstallQR(!showInstallQR)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>{showInstallQR ? 'إخفاء رمز QR' : 'عرض رمز QR لمسحه بكاميرا الهاتف 📷'}</span>
                  </button>
                </div>

                {showInstallQR && (
                  <div className="p-4 bg-neutral-900/90 rounded-2xl border border-neutral-800 text-center space-y-2 animate-in fade-in">
                    <p className="text-[11px] text-neutral-300">
                      وجّه كاميرا هاتف المتدرب إلى هذا الرمز ليفتح التطبيق فوراً ويبدأ التثبيت:
                    </p>
                    <div className="inline-block p-2 bg-neutral-950 rounded-xl border border-emerald-500/40">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(directInstallLink)}&color=10b981&bgcolor=09090b&margin=1`} 
                        alt="QR Code" 
                        className="w-40 h-40 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Access Link Box */}
              <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">رابط الدخول المباشر المخصص للمتدرب</h5>
                      <p className="text-[11px] text-neutral-400">عند الضغط على هذا الرابط يفتح فوراً الملف الشخصي والجدول الغذائي والتدريبي للمتدرب</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-emerald-400 border border-neutral-700">
                    Direct Link
                  </span>
                </div>

                {/* Link Field with Copy */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={directAccessLink}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-neutral-300 focus:outline-none select-all"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      copiedLink
                        ? 'bg-emerald-500 text-neutral-950'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                  </button>
                </div>

                {/* Quick Sharing Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>إرسال الرابط وبيانات الدخول عبر واتساب 📲</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoginAsTrainee}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>معاينة وتجربة فتح الملف كمتدرب الآن 🚀</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone: Delete Trainee */}
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-rose-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>حذف المتدرب نهائياً من المنظومة</span>
                  </h5>
                  <p className="text-[11px] text-neutral-400">
                    سيتم إزالة المتدرب وجميع برامجه التدريبية وخطط وجباته وسجل تقاريره من النظام بشكل كامل.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف المتدرب نهائياً</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WORKOUT PROGRAM BUILDER */}
          {activeTab === 'program' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h4 className="text-base font-bold text-white">{program.title}</h4>
                  <p className="text-xs text-neutral-400">{program.description}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProgram}
                  disabled={isSavingProgram}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSavingProgram ? 'تم الحفظ!' : 'حفظ تعديلات البرنامج'}</span>
                </button>
              </div>

              {/* Day Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {program.days.map((day, idx) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                      selectedDayIndex === idx
                        ? 'bg-neutral-800 border-emerald-500/50 text-white font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {day.dayName}
                  </button>
                ))}
              </div>

              {/* Current Day Exercises Table */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-neutral-900/60 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      تمارين {program.days[selectedDayIndex]?.dayName} ({program.days[selectedDayIndex]?.exercises.length} تمارين)
                    </span>
                  </div>
                  
                  {/* Actions for Adding Exercises */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsAddExerciseModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة تمرين (المكتبة الشاملة + مخصص)</span>
                    </button>

                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddExerciseToCurrentDay(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-emerald-400 focus:outline-none"
                    >
                      <option value="">+ اختيار سريع...</option>
                      {exerciseCatalog.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.nameAr} ({ex.primaryMuscle})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="divide-y divide-neutral-800/80">
                  {program.days[selectedDayIndex]?.exercises.length === 0 ? (
                    <div className="p-8 text-center text-neutral-400 text-xs">
                      لا توجد تمارين مضافة لهذا اليوم بعد. اضغط على زر "إضافة تمرين" بالأعلى لإضافة تمارين البار أو الدانبل أو الكابل أو تمارين مخصصة.
                    </div>
                  ) : (
                    program.days[selectedDayIndex]?.exercises.map((ex, exIdx) => (
                      <div key={ex.id} className="p-4 hover:bg-neutral-900/40 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-3">
                            {ex.thumbnailUrl && (
                              <img
                                src={ex.thumbnailUrl}
                                alt={ex.nameAr}
                                className="w-10 h-10 rounded-lg object-cover border border-neutral-800 bg-neutral-900 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white block">{ex.nameAr}</span>
                                {ex.category && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-emerald-400 border border-neutral-700">
                                    {ex.category === 'barbell' ? 'بار' : ex.category === 'dumbbell' ? 'دانبل' : ex.category === 'cable' ? 'كابل' : ex.category === 'machine' ? 'جهاز' : 'وزن جسم'}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-neutral-400">{ex.nameEn} · {ex.primaryMuscle} · {ex.equipment}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDuplicateExercise(selectedDayIndex, exIdx)}
                              className="p-1 text-neutral-400 hover:text-white transition-colors"
                              title="تكرار التمرين"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemoveExercise(selectedDayIndex, exIdx)}
                              className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              title="حذف التمرين"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Sets list with quick add/remove set */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 text-xs">
                            {ex.sets.map((s, sIdx) => (
                              <div key={sIdx} className="bg-neutral-900 border border-neutral-800 p-2 rounded-md">
                                <span className="text-neutral-500 block text-[10px]">الجولة {s.setNumber}</span>
                                <div className="font-mono text-white font-semibold">
                                  {s.targetReps} عدات {s.targetRpe ? `(RPE ${s.targetRpe})` : ''}
                                </div>
                                <span className="text-[10px] text-neutral-400 font-mono">راحة {s.restSeconds}ث</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-1 text-[11px]">
                            <button
                              type="button"
                              onClick={() => handleAddSetToExercise(selectedDayIndex, exIdx)}
                              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 flex items-center gap-1 font-medium transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              <span>إضافة جولة ({ex.sets.length + 1})</span>
                            </button>
                            {ex.sets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSetFromExercise(selectedDayIndex, exIdx)}
                                className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                                <span>حذف جولة</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {ex.coachNotes && (
                          <p className="text-[11px] text-amber-400/90 mt-2 bg-amber-950/20 px-2 py-1 rounded border border-amber-900/30">
                            ملاحظة الكوتش: {ex.coachNotes}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MACROS & NUTRITION EDITOR */}
          {activeTab === 'macros' && (
            <form onSubmit={handleSaveMacros} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h4 className="text-base font-bold text-white">تحديد أهداف التغذية والماكروز اليومية</h4>
                  <p className="text-xs text-neutral-400">تنعكس هذه القيم مباشرة في تطبيق المتدرب وحلقات السعرات</p>
                </div>
                <button
                  type="submit"
                  disabled={isSavingMacros}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSavingMacros ? 'تم الحفظ!' : 'حفظ الماكروز'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
                  <h5 className="text-xs font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-emerald-400" />
                    <span>ميزانية السعرات والمغذيات الكبرى</span>
                  </h5>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">إجمالي السعرات الحرارية اليومية (Calories)</label>
                    <input
                      type="number"
                      value={macros.calories}
                      onChange={(e) => setMacros({ ...macros, calories: parseInt(e.target.value) || 0 })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">البروتين (غرام)</label>
                      <input
                        type="number"
                        value={macros.proteinGrams}
                        onChange={(e) => setMacros({ ...macros, proteinGrams: parseInt(e.target.value) || 0 })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-sm font-mono text-emerald-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">الكارب (غرام)</label>
                      <input
                        type="number"
                        value={macros.carbsGrams}
                        onChange={(e) => setMacros({ ...macros, carbsGrams: parseInt(e.target.value) || 0 })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-sm font-mono text-amber-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">الدهون (غرام)</label>
                      <input
                        type="number"
                        value={macros.fatsGrams}
                        onChange={(e) => setMacros({ ...macros, fatsGrams: parseInt(e.target.value) || 0 })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-sm font-mono text-cyan-400 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
                  <h5 className="text-xs font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>الترطيب والكارديو والنشاط</span>
                  </h5>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">هدف شرب الماء اليومي (لتر)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={macros.waterLiters}
                      onChange={(e) => setMacros({ ...macros, waterLiters: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">هدف الخطوات اليومية</label>
                    <input
                      type="number"
                      step="500"
                      value={macros.stepGoal}
                      onChange={(e) => setMacros({ ...macros, stepGoal: parseInt(e.target.value) || 0 })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">الكارديو الأسبوعي (بالدقائق)</label>
                    <input
                      type="number"
                      value={macros.cardioMinutesPerWeek}
                      onChange={(e) => setMacros({ ...macros, cardioMinutesPerWeek: parseInt(e.target.value) || 0 })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 4: CHECKINS LIST */}
          {activeTab === 'checkins' && (
            <div className="space-y-5">
              <WeightProgressChart trainee={trainee} title="المسار التراكمي لنزول / صعود الوزن والخصر" />
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  سجل التقارير الأسبوعية المفصلة
                </h4>
                {trainee.checkIns.map((chk) => (
                <div 
                  key={chk.id} 
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-white font-mono text-sm">
                      W{chk.weekNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">الأسبوع {chk.weekNumber}</span>
                        <span className="text-xs font-mono text-emerald-400">({chk.weightKg} كغ)</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          chk.status === 'reviewed' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {chk.status === 'reviewed' ? 'تمت المراجعة' : 'بانتظار المراجعة'}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500 font-mono">{chk.date} · الخصر: {chk.measurements.waistCm} سم</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenCheckInReview(chk.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
                  >
                    <span>فتح التقرير</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Flexible Add / Create Exercise Modal */}
      <AddExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
        onAddExerciseToDay={handleAddFullExercise}
        targetDayName={program.days[selectedDayIndex]?.dayName}
      />

      {/* Delete Trainee Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-rose-800/80 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
              <Trash2 className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">هل أنت متأكد من حذف المتدرب؟</h3>
              <p className="text-xs text-neutral-300">
                سيتم حذف المتدرب <span className="font-bold text-white">"{trainee.fullName}"</span> وكافة بياناته والبرنامج التدريبي والنظام الغذائي الخاص به نهائياً.
              </p>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 text-right space-y-1">
              <div className="flex justify-between">
                <span>اسم المستخدم:</span>
                <span className="font-mono text-white">{usernameInput}</span>
              </div>
              <div className="flex justify-between">
                <span>كود المرور:</span>
                <span className="font-mono text-emerald-400">{pinInput}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء التراجع
              </button>

              <button
                type="button"
                onClick={handleDeleteTraineeConfirm}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                تأكيد الحذف النهائي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
