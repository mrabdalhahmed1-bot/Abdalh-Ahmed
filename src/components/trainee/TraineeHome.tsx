import React, { useState, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { TraineeBottomNav, TraineeTab } from './TraineeBottomNav';
import { TraineeHomeTab } from './TraineeHomeTab';
import { TraineeTrainingTab } from './TraineeTrainingTab';
import { TraineeCommunityTab } from './TraineeCommunityTab';
import { TraineeNutritionTab } from './TraineeNutritionTab';
import { TraineeMenuTab } from './TraineeMenuTab';
import { CheckInSubmissionModal } from './CheckInSubmissionModal';
import { Sparkles } from 'lucide-react';
import { RestTimer } from './RestTimer';

interface TraineeHomeProps {
  onOpenChat: () => void;
  onOpenCustomIconModal?: () => void;
  onOpenInstallGuide?: () => void;
}

export const TraineeHome: React.FC<TraineeHomeProps> = ({
  onOpenChat,
  onOpenCustomIconModal = () => {},
  onOpenInstallGuide = () => {}
}) => {
  const { messages, currentTraineeId, registerBackHandler } = useFitness();
  const [activeTab, setActiveTab] = useState<TraineeTab>('home');
  const [tabHistory, setTabHistory] = useState<TraineeTab[]>(['home']);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);

  const handleTabChange = (tab: TraineeTab) => {
    if (tab === activeTab) return;
    setTabHistory(prev => [...prev, tab]);
    setActiveTab(tab);
  };

  // Handle Mobile Hardware Back Button inside Trainee portal
  useEffect(() => {
    if (isCheckInOpen) {
      return registerBackHandler(() => {
        setIsCheckInOpen(false);
        return true;
      });
    }
  }, [isCheckInOpen, registerBackHandler]);

  useEffect(() => {
    if (isRestTimerOpen) {
      return registerBackHandler(() => {
        setIsRestTimerOpen(false);
        return true;
      });
    }
  }, [isRestTimerOpen, registerBackHandler]);

  // Navigate back to previous tab if user navigated between tabs
  useEffect(() => {
    if (tabHistory.length > 1 && !isCheckInOpen && !isRestTimerOpen) {
      return registerBackHandler(() => {
        setTabHistory(prev => {
          if (prev.length <= 1) return prev;
          const next = [...prev];
          next.pop(); // remove current tab
          const prevTab = next[next.length - 1];
          setActiveTab(prevTab);
          return next;
        });
        return true;
      });
    }
  }, [tabHistory, isCheckInOpen, isRestTimerOpen, registerBackHandler]);

  // Latest coach update message (Request 12)
  const latestCoachMessage = messages
    .filter(m => m.senderRole === 'coach' && m.traineeId === currentTraineeId)
    .slice(-1)[0];
  const [dismissedMsgId, setDismissedMsgId] = useState<string | null>(null);
  const showCoachBanner = latestCoachMessage && !latestCoachMessage.read && dismissedMsgId !== latestCoachMessage.id;

  const unreadMessagesCount = messages.filter(
    m => !m.read && m.senderRole === 'coach' && m.traineeId === currentTraineeId
  ).length;

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto min-h-screen bg-neutral-950 text-neutral-100 pb-28 pt-2 px-3 sm:px-4 overflow-x-hidden transition-colors">

      {/* Motivational Update Banner from Coach (Request 12) */}
      {showCoachBanner && (
        <div className="mb-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-neutral-900 to-emerald-950/80 border border-emerald-500/40 shadow-lg text-right flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-black">
                  تحديث جديد من الكوتش عبدالله
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">{latestCoachMessage.timestamp}</span>
              </div>
              <p className="text-xs text-neutral-200 mt-1 whitespace-pre-line leading-relaxed font-medium">
                {latestCoachMessage.text}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>فتح المحادثة ومتابعة التوجيهات</span>
                  <span>←</span>
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissedMsgId(latestCoachMessage.id)}
            className="w-6 h-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-xs cursor-pointer shrink-0"
            title="إخفاء الإشعار"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Tab View Switcher */}
      {activeTab === 'home' && (
        <TraineeHomeTab
          onNavigateTab={handleTabChange}
          onOpenCheckIn={() => setIsCheckInOpen(true)}
          onOpenChat={onOpenChat}
        />
      )}

      {activeTab === 'training' && (
        <TraineeTrainingTab
          onOpenRestTimer={() => setIsRestTimerOpen(true)}
        />
      )}

      {activeTab === 'community' && (
        <TraineeCommunityTab />
      )}

      {activeTab === 'nutrition' && (
        <TraineeNutritionTab />
      )}

      {activeTab === 'menu' && (
        <TraineeMenuTab
          onOpenCustomIcon={onOpenCustomIconModal}
          onOpenInstallGuide={onOpenInstallGuide}
        />
      )}

      {/* Trainee 5-Tab Bottom Navigation Bar (Permanent at bottom) */}
      <TraineeBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadCount={unreadMessagesCount}
      />

      {/* Weekly Check-in Submission Modal */}
      {isCheckInOpen && (
        <CheckInSubmissionModal
          onClose={() => setIsCheckInOpen(false)}
        />
      )}

      {/* Floating Rest Timer */}
      <RestTimer
        isOpen={isRestTimerOpen}
        onClose={() => setIsRestTimerOpen(false)}
      />

    </div>
  );
};
