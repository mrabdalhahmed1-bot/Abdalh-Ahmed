import React, { useState, useEffect } from 'react';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Header } from './components/common/Header';
import { CoachDashboard } from './components/coach/CoachDashboard';
import { TraineeHome } from './components/trainee/TraineeHome';
import { ChatDrawer } from './components/chat/ChatDrawer';
import { NewTraineeModal } from './components/coach/NewTraineeModal';
import { AppInstallGuideModal } from './components/common/AppInstallGuideModal';
import { InstantAppInstallModal } from './components/common/InstantAppInstallModal';
import { CustomAppIconModal } from './components/common/CustomAppIconModal';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';
import { WelcomeSplash } from './components/common/WelcomeSplash';
import { CelebrationToast } from './components/common/CelebrationToast';
import { TraineeLoginPage } from './components/auth/TraineeLoginPage';
import { Dumbbell, ShieldCheck, HeartPulse } from 'lucide-react';

const MainContent: React.FC = () => {
  const { userRole, authenticatedTraineeId, registerBackHandler } = useFitness();
  const [showSplash, setShowSplash] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNewTraineeOpen, setIsNewTraineeOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  const [isCustomIconModalOpen, setIsCustomIconModalOpen] = useState(false);

  const handleFinishSplash = () => {
    setShowSplash(false);
  };

  // Mobile Back Button handlers for App-level modals
  useEffect(() => {
    if (isChatOpen) {
      return registerBackHandler(() => {
        setIsChatOpen(false);
        return true;
      });
    }
  }, [isChatOpen, registerBackHandler]);

  useEffect(() => {
    if (isNewTraineeOpen) {
      return registerBackHandler(() => {
        setIsNewTraineeOpen(false);
        return true;
      });
    }
  }, [isNewTraineeOpen, registerBackHandler]);

  useEffect(() => {
    if (isInstallGuideOpen) {
      return registerBackHandler(() => {
        setIsInstallGuideOpen(false);
        return true;
      });
    }
  }, [isInstallGuideOpen, registerBackHandler]);

  useEffect(() => {
    if (isCustomIconModalOpen) {
      return registerBackHandler(() => {
        setIsCustomIconModalOpen(false);
        return true;
      });
    }
  }, [isCustomIconModalOpen, registerBackHandler]);

  // Trainee Login Gate: If in trainee role and not yet authenticated with username + PIN, show login portal
  if (userRole === 'trainee' && !authenticatedTraineeId) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-['Cairo',sans-serif]">
        {showSplash && <WelcomeSplash onFinish={handleFinishSplash} />}
        <CelebrationToast />
        <TraineeLoginPage onOpenInstallGuide={() => setIsInstallGuideOpen(true)} />
        <AppInstallGuideModal
          isOpen={isInstallGuideOpen}
          onClose={() => setIsInstallGuideOpen(false)}
        />
        <InstantAppInstallModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Brand Opening Splash (Golden Dumbbell + Built for Performance) - Shows only on external cold launch */}
      {showSplash && (
        <WelcomeSplash onFinish={handleFinishSplash} />
      )}

      {/* Global Motivational & Completion Cheer Toast */}
      <CelebrationToast />

      {/* Top Header Contract */}
      <Header
        onOpenChat={() => setIsChatOpen(true)}
        onOpenNewTraineeModal={() => setIsNewTraineeOpen(true)}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        onOpenCustomIconModal={() => setIsCustomIconModalOpen(true)}
      />

      {/* Main Viewport Container - Single screen, vertical scroll only */}
      <main className={`flex-1 w-full overflow-x-hidden ${userRole === 'trainee' ? 'p-0 max-w-lg mx-auto' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6'}`}>
        {userRole === 'coach' ? (
          <CoachDashboard 
            onOpenChat={() => setIsChatOpen(true)} 
            onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
            onOpenCustomIconModal={() => setIsCustomIconModalOpen(true)}
          />
        ) : (
          <TraineeHome 
            onOpenChat={() => setIsChatOpen(true)} 
            onOpenCustomIconModal={() => setIsCustomIconModalOpen(true)}
            onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
          />
        )}
      </main>

      {/* Slide-out Direct Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* New Trainee Registration Modal */}
      {isNewTraineeOpen && (
        <NewTraineeModal onClose={() => setIsNewTraineeOpen(false)} />
      )}

      {/* PWA Mobile Installation & Control Guide Modal */}
      <AppInstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        onOpenCustomIconModal={() => {
          setIsInstallGuideOpen(false);
          setIsCustomIconModalOpen(true);
        }}
      />

      {/* Instant Mobile App Installer Modal (Auto-triggered when ?install=1 is in URL or opened directly) */}
      <InstantAppInstallModal />

      {/* Custom App Icon Changer Modal */}
      <CustomAppIconModal
        isOpen={isCustomIconModalOpen}
        onClose={() => setIsCustomIconModalOpen(false)}
      />

      {/* Minimal Footer (Shown only for coach mode to leave full space for mobile trainee bottom bar) */}
      {userRole === 'coach' && (
        <footer className="border-t border-neutral-900 bg-neutral-950/80 py-6 text-xs text-neutral-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-400">Abdullah Qasim © {new Date().getFullYear()}</span>
              <span>·</span>
              <span>نظام التدريب والمتابعة الرياضية المتقدم للأونلاين كوتشينغ</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>متوافق مع الهواتف والأجهزة اللوحية</span>
              <span>·</span>
              <span className="text-emerald-400">نظام الماكروز & RPE المعتمد</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <FitnessProvider>
      <MainContent />
    </FitnessProvider>
  );
}
