import React, { useState, useRef, useEffect } from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  Cpu,
  PlayCircle,
  CheckSquare,
  Code,
  Flame,
  Globe,
  Search,
  Zap,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  LogIn,
  ChevronDown,
  LayoutDashboard,
  User,
  Download,
  Sparkles,
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
    authUser,
    isAdminAuthenticated,
    logoutAdmin,
    currentStudent,
    setSearchModalOpen,
  } = useApp();

  const { isInstallable, isInstalled, promptInstall } = usePWA();

  const [localAdminModalOpen, setLocalAdminModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openAdminModal = () => {
    setDropdownOpen(false);
    if (onOpenAdminLogin) {
      onOpenAdminLogin();
    } else {
      setLocalAdminModalOpen(true);
    }
  };

  // Primary nav — just 5 clear sections, no clutter
  const navItems: Array<{ id: AppView; label: string; icon: React.ReactNode }> = [
    { id: 'home',        label: 'Explore',     icon: <Sparkles   className="w-4 h-4" /> },
    { id: 'simulations', label: 'Simulations', icon: <Cpu        className="w-4 h-4" /> },
    { id: 'videos',      label: 'Lessons',     icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'quizzes',     label: 'Quizzes',     icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'coding',      label: 'Coding',      icon: <Code       className="w-4 h-4" /> },
  ];

  const avatarSrc =
    authUser?.avatar ||
    currentStudent?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.name || 'User')}&background=6366f1&color=fff&size=80`;

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">

          {/* ── Brand ────────────────────────────────────────── */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="STEMLearn Home"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0 transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
            >
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              STEM<span className="text-indigo-600">Learn</span>
            </span>
          </button>

          {/* ── Desktop Nav Links ─────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`
                    relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-indigo-500"
                      style={{ bottom: '2px' }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right Zone ───────────────────────────────────── */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Search pill */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 border border-slate-200 rounded-full hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/40 transition-all"
              title="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs text-slate-400">Search...</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-400 font-mono leading-none">
                ⌘K
              </kbd>
            </button>

            {/* Search icon-only on xs */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="sm:hidden p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* ── Authenticated user avatar + dropdown ── */}
            {authUser ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className={`
                    flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border transition-all
                    ${dropdownOpen
                      ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }
                  `}
                  aria-label="User menu"
                >
                  <img
                    src={avatarSrc}
                    alt={authUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-white shadow-sm"
                  />
                  <span className="hidden sm:block text-sm font-semibold text-slate-800 max-w-[80px] truncate">
                    {authUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/10 overflow-hidden z-50"
                    style={{ animation: 'fadeSlideDown 0.15s ease' }}
                  >
                    {/* User info header */}
                    <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/60">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatarSrc}
                          alt={authUser.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{authUser.name}</p>
                          <p className="text-xs text-slate-500 truncate">{authUser.email}</p>
                          <span
                            className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                            style={{
                              background: authUser.role === 'admin' || authUser.role === 'faculty'
                                ? '#fef3c7' : '#ede9fe',
                              color: authUser.role === 'admin' || authUser.role === 'faculty'
                                ? '#92400e' : '#5b21b6',
                            }}
                          >
                            {authUser.role || 'Student'}
                          </span>
                        </div>
                      </div>

                      {/* XP + Streak inline stats */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex-1 flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-amber-800">{currentStudent.streakDays}d Streak</p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5">
                          <Zap className="w-3.5 h-3.5 text-indigo-500 fill-indigo-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-indigo-800">{currentStudent.xp} XP · Lv {currentStudent.level}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                      <DropdownItem
                        icon={<User className="w-4 h-4" />}
                        label="My Profile"
                        onClick={() => { setCurrentView('profile'); setDropdownOpen(false); }}
                        active={currentView === 'profile'}
                      />
                      <DropdownItem
                        icon={<LayoutDashboard className="w-4 h-4" />}
                        label="Dashboard"
                        onClick={() => { setCurrentView('dashboard'); setDropdownOpen(false); }}
                        active={currentView === 'dashboard'}
                      />
                      {isAdminAuthenticated && (
                        <DropdownItem
                          icon={<ShieldCheck className="w-4 h-4" />}
                          label="Admin Panel"
                          onClick={() => { setCurrentView('admin'); setDropdownOpen(false); }}
                          active={currentView === 'admin'}
                          variant="amber"
                        />
                      )}
                      {isInstallable && !isInstalled && (
                        <DropdownItem
                          icon={<Download className="w-4 h-4" />}
                          label="Install App"
                          onClick={() => { promptInstall(); setDropdownOpen(false); }}
                          variant="indigo"
                        />
                      )}
                    </div>

                    <div className="border-t border-slate-100 py-1.5">
                      <DropdownItem
                        icon={<LogOut className="w-4 h-4" />}
                        label="Sign Out"
                        onClick={() => { logoutAdmin(); setDropdownOpen(false); }}
                        variant="danger"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest sign-in button */
              <button
                onClick={openAdminModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all shadow-sm hover:shadow-indigo-300/50 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={onOpenMobileDrawer}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              aria-label="Open menu"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Dropdown animation keyframes */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <AdminAuthModal
        isOpen={localAdminModalOpen}
        onClose={() => setLocalAdminModalOpen(false)}
      />
    </>
  );
};

/* ─── Reusable dropdown row ─────────────────────────────────────── */
interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  variant?: 'default' | 'danger' | 'amber' | 'indigo';
}

const DropdownItem: React.FC<DropdownItemProps> = ({ icon, label, onClick, active, variant = 'default' }) => {
  const colors: Record<string, string> = {
    default: active
      ? 'text-indigo-600 bg-indigo-50'
      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50',
    danger:  'text-rose-600 hover:bg-rose-50',
    amber:   'text-amber-700 hover:bg-amber-50',
    indigo:  'text-indigo-600 hover:bg-indigo-50',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${colors[variant]}`}
    >
      {icon}
      {label}
    </button>
  );
};
