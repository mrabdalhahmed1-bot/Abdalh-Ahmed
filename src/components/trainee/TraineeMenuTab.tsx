import React, { useState, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { 
  User, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  Scale, 
  Camera, 
  ChevronLeft, 
  ShieldCheck, 
  Smartphone, 
  Palette,
  LogOut,
  Sparkles
} from 'lucide-react';
import { EditTraineeProfileModal } from './EditTraineeProfileModal';
import { TraineeFeedbackModal } from './TraineeFeedbackModal';
import { ProgramInstructionsModal } from './ProgramInstructionsModal';
import { WeightHistoryModal } from './WeightHistoryModal';
import { ProgressPhotosModal } from './ProgressPhotosModal';
import { PastLogsModal } from './PastLogsModal';

interface TraineeMenuTabProps {
  onOpenCustomIcon: () => void;
  onOpenInstallGuide: () => void;
}

export const TraineeMenuTab: React.FC<TraineeMenuTabProps> = ({
  onOpenCustomIcon,
  onOpenInstallGuide
}) => {
  const { activeTrainee, setUserRole, logoutTrainee, updateTraineeProfile, sendMessage, registerBackHandler } = useFitness();

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPastLogsOpen, setIsPastLogsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isWeightHistoryOpen, setIsWeightHistoryOpen] = useState(false);
  const [isProgressPhotosOpen, setIsProgressPhotosOpen] = useState(false);

  // Back button handling in Menu Tab
  useEffect(() => {
    if (isEditProfileOpen) {
      return registerBackHandler(() => {
        setIsEditProfileOpen(false);
        return true;
      });
    }
  }, [isEditProfileOpen, registerBackHandler]);

  useEffect(() => {
    if (isPastLogsOpen) {
      return registerBackHandler(() => {
        setIsPastLogsOpen(false);
        return true;
      });
    }
  }, [isPastLogsOpen, registerBackHandler]);

  useEffect(() => {
    if (isFeedbackOpen) {
      return registerBackHandler(() => {
        setIsFeedbackOpen(false);
        return true;
      });
    }
  }, [isFeedbackOpen, registerBackHandler]);

  useEffect(() => {
    if (isInstructionsOpen) {
      return registerBackHandler(() => {
        setIsInstructionsOpen(false);
        return true;
      });
    }
  }, [isInstructionsOpen, registerBackHandler]);

  useEffect(() => {
    if (isWeightHistoryOpen) {
      return registerBackHandler(() => {
        setIsWeightHistoryOpen(false);
        return true;
      });
    }
  }, [isWeightHistoryOpen, registerBackHandler]);

  useEffect(() => {
    if (isProgressPhotosOpen) {
      return registerBackHandler(() => {
        setIsProgressPhotosOpen(false);
        return true;
      });
    }
  }, [isProgressPhotosOpen, registerBackHandler]);

  // Menu items list matching the video at 00:11
  const menuOptions = [
    {
      id: 'profile',
      label: 'تعديل ملفك',
      icon: User,
      action: () => setIsEditProfileOpen(true)
    },
    {
      id: 'past_logs',
      label: 'التسجيلات السابقة',
      icon: FileText,
      action: () => setIsPastLogsOpen(true)
    },
    {
      id: 'feedback',
      label: 'رأيك',
      icon: MessageSquare,
      action: () => setIsFeedbackOpen(true)
    },
    {
      id: 'instructions',
      label: 'تعليمات برنامجك التدريبي',
      icon: BookOpen,
      action: () => setIsInstructionsOpen(true)
    },
    {
      id: 'weights',
      label: 'سجل الأوزان',
      icon: Scale,
      action: () => setIsWeightHistoryOpen(true)
    },
    {
      id: 'photos',
      label: 'صورة تقدمي',
      icon: Camera,
      action: () => setIsProgressPhotosOpen(true)
    }
  ];

  return (
    <div className="space-y-4 pb-24 text-neutral-100">
      
      {/* Top Header */}
      <div className="bg-neutral-900/90 rounded-2xl p-5 shadow-sm border border-neutral-800 text-right">
        <span className="text-xs font-bold text-neutral-400 block mb-0.5">أهلاً بك</span>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          {activeTrainee.fullName} 👋
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
            {activeTrainee.goalTitle}
          </span>
          <span className="text-[11px] text-neutral-400 font-mono">
            {activeTrainee.currentWeightKg} كغ · {activeTrainee.heightCm} سم
          </span>
        </div>
      </div>

      {/* Main Account Options List */}
      <div className="bg-neutral-900/90 rounded-2xl p-2 shadow-xs border border-neutral-800 divide-y divide-neutral-800/60">
        <div className="px-4 py-2">
          <span className="text-[11px] font-bold text-neutral-400">الحساب والإعدادات</span>
        </div>

        {menuOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={opt.action}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-neutral-800/60 transition-colors group cursor-pointer"
            >
              {/* Left Arrow Icon */}
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </div>

              {/* Right: Title & Icon */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-200 group-hover:text-white">
                  {opt.label}
                </span>
                <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Admin / Coach Portal Switcher Card */}
      <div className="bg-neutral-900/90 rounded-2xl p-4 shadow-xs border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">بوابة المدرب الرياضي</h4>
              <span className="text-[10px] text-neutral-400">التبديل إلى لوحة تحكم وتعديل البرامج</span>
            </div>
          </div>

          <button
            onClick={() => setUserRole('coach')}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            فتح بوابة المدرب
          </button>
        </div>
      </div>

      {/* App Installation Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-neutral-900 rounded-2xl p-4 shadow-xs border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">تثبيت التطبيق على هاتفك</h4>
            <span className="text-[10px] text-neutral-400">تشغيل شاشة كاملة بدون متصفح وبأيقونة التطبيق</span>
          </div>
        </div>
        <button
          onClick={onOpenInstallGuide}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-black rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          تثبيت الآن 📲
        </button>
      </div>

      {/* App Customization & PWA Install Card */}
      <div className="bg-neutral-900/90 rounded-2xl p-4 shadow-xs border border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
          <Palette className="w-4 h-4 text-emerald-400" />
          <span>تخصيص أيقونة وصورة التطبيق</span>
        </div>
        <button
          onClick={onOpenCustomIcon}
          className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          تغيير الأيقونة 🎨
        </button>
      </div>

      {/* Logout Card */}
      <div className="bg-red-950/20 rounded-2xl p-4 shadow-xs border border-red-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">تسجيل الخروج من الحساب</h4>
            <span className="text-[10px] text-neutral-400">العودة لشاشة تسجيل دخول المتدرب</span>
          </div>
        </div>
        <button
          onClick={logoutTrainee}
          className="px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          خروج 🚪
        </button>
      </div>

      {/* Modals */}
      <EditTraineeProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        trainee={activeTrainee}
        onSave={(updates) => updateTraineeProfile(activeTrainee.id, updates)}
      />

      <PastLogsModal
        isOpen={isPastLogsOpen}
        onClose={() => setIsPastLogsOpen(false)}
      />

      <TraineeFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSendFeedback={(text, rating) => {
          sendMessage(
            activeTrainee.id,
            `⭐ رأي وملاحظات المتدرب (تقييم: ${rating}/5):\n"${text}"`
          );
        }}
      />

      <ProgramInstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      <WeightHistoryModal
        isOpen={isWeightHistoryOpen}
        onClose={() => setIsWeightHistoryOpen(false)}
      />

      <ProgressPhotosModal
        isOpen={isProgressPhotosOpen}
        onClose={() => setIsProgressPhotosOpen(false)}
      />

    </div>
  );
};
