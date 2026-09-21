import React from 'react';
import { usePWA } from '../../context/PWAContext';
import { RefreshCw, Sparkles, X } from 'lucide-react';

export const PWAUpdateToast: React.FC = () => {
  const { needRefresh, updateApp } = usePWA();
  const [dismissed, setDismissed] = React.useState(false);

  if (!needRefresh || dismissed) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300 w-full max-w-sm px-4">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-indigo-500/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white">App Update Available</p>
            <p className="text-slate-300 text-[11px] truncate">Refresh to load the latest features</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={updateApp}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3" />
            Update
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Dismiss update notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
