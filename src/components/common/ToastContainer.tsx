import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Zap, CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isBadge = toast.type === 'badge';
        const isXp = toast.type === 'xp';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl border flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${
              isBadge
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-100 bg-white backdrop-blur-md'
                : isXp
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-100 bg-white backdrop-blur-md'
                : isSuccess
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-100 bg-white backdrop-blur-md'
                : 'bg-slate-900/90 text-white border-slate-700 backdrop-blur-md'
            }`}
          >
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                isBadge
                  ? 'bg-amber-100 text-amber-700'
                  : isXp
                  ? 'bg-emerald-100 text-emerald-700'
                  : isSuccess
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isBadge && <Award className="w-5 h-5 animate-bounce" />}
              {isXp && <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-tight text-slate-900">
                {toast.title}
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
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
