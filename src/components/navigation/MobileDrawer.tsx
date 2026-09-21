import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  X,
  PlayCircle,
  Flame,
  Zap,
  Globe,
  Compass,
  BookOpen,
  ShieldCheck,
  User,
  Shield,
  ExternalLink,
  ChevronRight,
  LogOut,
  Download
} from 'lucide-react';
import { usePWA } from '../../context/PWAContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminLogin: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAdminLogin,
}) => {
  const {
    currentView,
    setCurrentView,
    currentStudent,
    isAdminAuthenticated,
    logoutAdmin,
  } = useApp();

  const { isInstallable, isInstalled, promptInstall } = usePWA();

  if (!isOpen) return null;

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    onClose();
  };

  const moreSections: Array<{
    id: AppView;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Progress Dashboard',
      description: 'Streaks, badges, and learning analytics',
      icon: <Compass className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-100',
    },
    {
      id: 'videos',
      label: 'Video Lessons',
      description: 'Curated concept lectures & notes',
      icon: <PlayCircle className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-100',
    },
    {
      id: 'activities',
      label: 'STEM Activities',
      description: 'Hands-on practical experiments',
      icon: <Flame className="w-5 h-5 text-rose-600" />,
      color: 'bg-rose-50 border-rose-100',
    },
    {
      id: 'challenges',
      label: 'Weekly Challenges',
      description: 'Competitive STEM problem solving',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-100',
    },
    {
      id: 'paths',
      label: 'Learning Paths',
      description: 'Curriculum-aligned milestone tracks',
      icon: <BookOpen className="w-5 h-5 text-teal-600" />,
      color: 'bg-teal-50 border-teal-100',
    },
    {
      id: 'resources',
      label: 'Free Tools Hub',
      description: 'GeoGebra, PhET, Scratch, Tinkercad',
      icon: <Globe className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Card */}
      <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[88vh] overflow-y-auto z-10 border-t border-slate-200 p-5 space-y-5 animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle & Close Bar */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mr-6" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Mini Profile Summary */}
        <div
          onClick={() => handleNavigate('profile')}
          className="p-3.5 bg-gradient-to-r from-indigo-50 to-teal-50/50 rounded-2xl border border-indigo-100/80 flex items-center justify-between cursor-pointer hover:border-indigo-300 transition"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {currentStudent.name}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-600 text-white">
                  Lvl {currentStudent.level}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {currentStudent.streakDays}d streak
                </span>
                <span>•</span>
                <span className="font-semibold text-indigo-700">
                  {currentStudent.xp} XP
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Explore Hub Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Learning Sections
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {moreSections.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition group ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                      : `${item.color} hover:shadow-xs active:scale-[0.98]`
                  }`}
                >
                  <div className="mb-2">
                    <div
                      className={`p-2 rounded-xl w-fit ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white shadow-xs'
                      }`}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold leading-tight ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.label}
                    </h4>
                    <p
                      className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${
                        isActive ? 'text-indigo-100' : 'text-slate-500'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PWA Install Button if available */}
        {!isInstalled && isInstallable && (
          <div className="pt-1">
            <button
              onClick={() => {
                promptInstall();
                onClose();
              }}
              className="w-full p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-2xl flex items-center justify-between shadow-md shadow-indigo-600/20 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Download className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">Install STEM Learn App</p>
                  <p className="text-[10px] text-indigo-100">Offline access & fullscreen mode</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        )}

        {/* Platform Links */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Platform & Privacy
          </h3>
          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => handleNavigate('about')}
              className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-700 transition"
            >
              <span className="flex items-center gap-2 font-medium">
                <BookOpen className="w-4 h-4 text-slate-500" /> About Platform & Pedagogy
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavigate('privacy')}
              className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-700 transition"
            >
              <span className="flex items-center gap-2 font-medium">
                <Shield className="w-4 h-4 text-teal-600" /> Student Confidentiality & Privacy
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {isAdminAuthenticated ? (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleNavigate('admin')}
                  className="flex-1 py-2 px-3 bg-amber-50 border border-amber-200 text-amber-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" /> Admin Portal
                </button>
                <button
                  onClick={() => {
                    logoutAdmin();
                    onClose();
                  }}
                  className="py-2 px-3 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Exit
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminLogin();
                }}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <ShieldCheck className="w-4 h-4 text-slate-600" /> Faculty & Admin Login
              </button>
            )}
          </div>
        </div>

        {/* Clean Footer Tag */}
        <div className="text-[11px] text-center text-slate-400 pt-2 border-t border-slate-100">
          STEMLearn • Open-access Digital Learning Platform
        </div>
      </div>
    </div>
  );
};
