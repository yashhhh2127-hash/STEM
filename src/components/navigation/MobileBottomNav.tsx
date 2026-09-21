import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  Sparkles,
  Cpu,
  Code,
  CheckSquare,
  Menu
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenDrawer: () => void;
  isDrawerOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenDrawer,
  isDrawerOpen,
}) => {
  const { currentView, setCurrentView } = useApp();

  const primaryTabs: Array<{ id: AppView; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'simulations', label: 'Sims', icon: <Cpu className="w-5 h-5" /> },
    { id: 'coding', label: 'Lab', icon: <Code className="w-5 h-5" /> },
    { id: 'quizzes', label: 'Quizzes', icon: <CheckSquare className="w-5 h-5" /> },
  ];

  const isMoreActive =
    isDrawerOpen ||
    !primaryTabs.some((tab) => tab.id === currentView);

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 h-14 items-center px-1">
        {primaryTabs.map((tab) => {
          const isActive = currentView === tab.id && !isDrawerOpen;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative group ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 active:scale-95'
              }`}
            >
              {/* Active subtle pill highlight */}
              <div
                className={`flex items-center justify-center p-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-indigo-50 scale-105' : 'group-hover:bg-slate-100'
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}

        {/* More tab button */}
        <button
          onClick={onOpenDrawer}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative group ${
            isMoreActive
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 active:scale-95'
          }`}
          aria-label="Open More Menu"
        >
          <div
            className={`flex items-center justify-center p-1 rounded-full transition-all duration-200 ${
              isMoreActive ? 'bg-indigo-50 scale-105' : 'group-hover:bg-slate-100'
            }`}
          >
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">
            More
          </span>
          {isMoreActive && (
            <span className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full" />
          )}
        </button>
      </div>
    </nav>
  );
};
