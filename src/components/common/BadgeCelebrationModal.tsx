import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Sparkles,
  Zap,
  Code,
  Atom,
  Calculator,
  Flame,
  Compass,
  CheckCircle2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BadgeCelebrationModal: React.FC = () => {
  const { unlockedBadgeModal, closeBadgeModal } = useApp();

  useEffect(() => {
    if (unlockedBadgeModal) {
      try {
        // Multi-burst celebration confetti
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#6366f1', '#10b981', '#ec4899'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#f59e0b', '#fbbf24', '#6366f1'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#f59e0b', '#fbbf24', '#6366f1'],
          });
        }, 200);
      } catch {
        // Safe fallback
      }
    }
  }, [unlockedBadgeModal]);

  if (!unlockedBadgeModal) return null;

  const renderBadgeIcon = (iconName: string) => {
    const props = { className: 'w-12 h-12 text-amber-500 stroke-[2]' };
    switch (iconName?.toLowerCase()) {
      case 'compass':
        return <Compass {...props} />;
      case 'code':
        return <Code {...props} />;
      case 'atom':
        return <Atom {...props} />;
      case 'calculator':
        return <Calculator {...props} />;
      case 'zap':
        return <Zap {...props} />;
      case 'flame':
        return <Flame {...props} />;
      case 'award':
        return <Award {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-celebration-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
      onClick={closeBadgeModal}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200/80 text-center overflow-hidden transform transition-all duration-300 scale-100"
        style={{
          boxShadow: '0 25px 60px -15px rgba(245, 158, 11, 0.25), 0 0 40px rgba(99, 102, 241, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative golden sunburst gradient behind badge */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-amber-200/50 via-amber-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={closeBadgeModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Trophy Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Honor Badge Received!</span>
        </div>

        {/* Badge Icon Showcase with ring pulses */}
        <div className="relative mx-auto my-3 w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-40" />
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-100 to-amber-200 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-inner">
              {renderBadgeIcon(unlockedBadgeModal.icon)}
            </div>
          </div>
        </div>

        {/* Badge Title & Category */}
        <h2
          id="badge-celebration-title"
          className="text-2xl font-black text-slate-900 tracking-tight mt-2"
        >
          {unlockedBadgeModal.title || unlockedBadgeModal.name}
        </h2>

        <div className="flex items-center justify-center gap-2 mt-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            {unlockedBadgeModal.category} milestone
          </span>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-amber-500 text-amber-500" /> +{unlockedBadgeModal.xpThreshold || 50} XP Awarded
          </span>
        </div>

        {/* Badge Description */}
        <p className="text-sm text-slate-600 leading-relaxed mt-4 px-2">
          {unlockedBadgeModal.description}
        </p>

        {/* Confirmation & Claim Button */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={closeBadgeModal}
            className="w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Claim & Continue Exploring</span>
          </button>
        </div>
      </div>
    </div>
  );
};
