import React from 'react';
import { Home, Dumbbell, MessageSquare, Utensils, Menu } from 'lucide-react';

export type TraineeTab = 'home' | 'training' | 'community' | 'nutrition' | 'menu';

interface TraineeBottomNavProps {
  activeTab: TraineeTab;
  onTabChange: (tab: TraineeTab) => void;
  unreadCount?: number;
}

export const TraineeBottomNav: React.FC<TraineeBottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0
}) => {
  const tabs = [
    {
      id: 'home' as TraineeTab,
      label: 'الرئيسية',
      icon: Home
    },
    {
      id: 'training' as TraineeTab,
      label: 'التدريب',
      icon: Dumbbell
    },
    {
      id: 'community' as TraineeTab,
      label: 'المجتمع',
      icon: MessageSquare
    },
    {
      id: 'nutrition' as TraineeTab,
      label: 'النظام الغذائي',
      icon: Utensils
    },
    {
      id: 'menu' as TraineeTab,
      label: 'الحساب',
      icon: Menu
    }
  ];

  return (
    <nav 
      aria-label="القائمة السفلية للتطبيق"
      className="fixed bottom-0 inset-x-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/80 shadow-[0_-4px_25px_rgba(0,0,0,0.6)] pb-safe transition-all"
    >
      <div className="w-full max-w-lg mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full py-1 transition-all select-none group cursor-pointer ${
                isActive ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-neutral-200 font-medium'
              }`}
            >
              {/* Active Top Bar Indicator */}
              {isActive && (
                <span className="absolute top-0 inset-x-3 h-0.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
              )}

              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4] text-emerald-400' : 'scale-100 group-hover:scale-105 stroke-[1.8]'
                  }`} 
                />
                {tab.id === 'community' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
                )}
              </div>

              <span className={`text-[10px] mt-1 tracking-tight truncate max-w-full ${
                isActive ? 'text-emerald-400 font-bold' : 'text-neutral-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
