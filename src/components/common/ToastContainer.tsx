import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Zap, CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => {
        const isBadge = toast.type === 'badge';
        const isXp = toast.type === 'xp';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl shadow-xl border flex items-start gap-3 transition-all duration-300 transform translate-y-0 backdrop-blur-xl ${
              isBadge
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300/80 shadow-amber-500/10'
                : isXp
                ? 'bg-emerald-50/95 border-emerald-300/80 shadow-emerald-500/10'
                : isSuccess
                ? 'bg-blue-50/95 border-blue-300/80 shadow-blue-500/10'
                : 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/20'
            }`}
          >
            <div
              className={`p-2 rounded-xl flex-shrink-0 ${
                isBadge
                  ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm'
                  : isXp
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : isSuccess
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isBadge && <Award className="w-5 h-5 animate-pulse" />}
              {isXp && <Zap className="w-5 h-5 fill-white text-white" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div
                className={`font-bold text-xs sm:text-sm leading-tight ${
                  isBadge
                    ? 'text-amber-950'
                    : isXp
                    ? 'text-emerald-950'
                    : isSuccess
                    ? 'text-blue-950'
                    : 'text-white'
                }`}
              >
                {toast.title}
              </div>
              <p
                className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${
                  isBadge
                    ? 'text-amber-800'
                    : isXp
                    ? 'text-emerald-800'
                    : isSuccess
                    ? 'text-blue-800'
                    : 'text-slate-300'
                }`}
              >
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
