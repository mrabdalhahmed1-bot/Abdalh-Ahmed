import React, { useState, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { TraineeBottomNav, TraineeTab } from './TraineeBottomNav';
import { TraineeHomeTab } from './TraineeHomeTab';
import { TraineeTrainingTab } from './TraineeTrainingTab';
import { TraineeCommunityTab } from './TraineeCommunityTab';
import { TraineeNutritionTab } from './TraineeNutritionTab';
import { TraineeMenuTab } from './TraineeMenuTab';
import { CheckInSubmissionModal } from './CheckInSubmissionModal';
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

  const unreadMessagesCount = messages.filter(
    m => !m.read && m.senderRole === 'coach' && m.traineeId === currentTraineeId
  ).length;

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto min-h-screen bg-neutral-950 text-neutral-100 pb-28 pt-2 px-3 sm:px-4 overflow-x-hidden transition-colors">
      
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
