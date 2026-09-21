import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  Compass,
  PlayCircle,
  Cpu,
  CheckSquare,
  Code,
  Flame,
  Globe,
  Search,
  Zap,
  ShieldCheck,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
  Download
} from 'lucide-react';
import { AdminAuthModal } from './common/AdminAuthModal';
import { usePWA } from '../context/PWAContext';

interface NavbarProps {
  onOpenMobileDrawer?: () => void;
  isMobileDrawerOpen?: boolean;
  onOpenAdminLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileDrawer,
  isMobileDrawerOpen,
  onOpenAdminLogin,
}) => {
  const {
    currentView,
    setCurrentView,
    isAdminAuthenticated,
    logoutAdmin,
    currentStudent,
    setSearchModalOpen,
  } = useApp();

  const { isInstallable, isInstalled, promptInstall } = usePWA();

  const [localAdminModalOpen, setLocalAdminModalOpen] = useState(false);

  const openAdminModal = () => {
    if (onOpenAdminLogin) {
      onOpenAdminLogin();
    } else {
      setLocalAdminModalOpen(true);
    }
  };

  const navItems: Array<{ id: AppView; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Explore', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'simulations', label: 'Simulations', icon: <Cpu className="w-4 h-4" /> },
    { id: 'coding', label: 'Coding Lab', icon: <Code className="w-4 h-4" /> },
    { id: 'quizzes', label: 'Quizzes', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'videos', label: 'Lessons', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'activities', label: 'Projects', icon: <Flame className="w-4 h-4" /> },
    { id: 'challenges', label: 'Challenges', icon: <Zap className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <Compass className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all">
        {/* Clean Main Navbar */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Clean Brand Logo */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 group text-left flex-shrink-0"
            aria-label="STEMLearn Platform"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
                STEM<span className="text-indigo-600">Learn</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links - Clean & Spacious */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-[13px] ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Clean Quick Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="px-3 py-1.5 text-xs text-slate-500 bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200/60 rounded-xl flex items-center gap-2 transition"
              title="Search topics & simulations (Ctrl+K)"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline font-medium text-slate-600">Search</span>
              <kbd className="hidden md:inline text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Streak & XP Badges - Clean & Minimal */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <div
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-full font-bold text-amber-800"
                title={`${currentStudent.streakDays} Day Learning Streak`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{currentStudent.streakDays}d</span>
              </div>

              <div
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200/60 rounded-full font-bold text-indigo-700"
                title={`Level ${currentStudent.level} (${currentStudent.xp} Total XP)`}
              >
                <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                <span>{currentStudent.xp} XP</span>
              </div>
            </div>

            {/* Student Profile Quick Link */}
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex items-center gap-2 p-1 sm:p-1.5 sm:pr-3 rounded-full border transition ${
                currentView === 'profile'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/10'
                  : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="View Profile"
              aria-label="Student Profile"
            >
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[85px] truncate">
                {currentStudent.name.split(' ')[0]}
              </span>
            </button>

            {/* Faculty / Admin Login button */}
            {isAdminAuthenticated ? (
              <button
                onClick={() => setCurrentView('admin')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Admin</span>
              </button>
            ) : (
              <button
                onClick={openAdminModal}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <span>Faculty</span>
              </button>
            )}

            {/* Install PWA Button if available */}
            {isInstallable && !isInstalled && (
              <button
                onClick={promptInstall}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
                title="Install STEM Learn App"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
            )}

            {/* Mobile Drawer Menu Toggle */}
            <button
              onClick={onOpenMobileDrawer}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Standalone Admin Auth Modal */}
      <AdminAuthModal
        isOpen={localAdminModalOpen}
        onClose={() => setLocalAdminModalOpen(false)}
      />
    </>
  );
};
