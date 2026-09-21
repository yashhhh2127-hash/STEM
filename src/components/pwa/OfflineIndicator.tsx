import React, { useEffect, useState } from 'react';
import { usePWA } from '../../context/PWAContext';
import { WifiOff, Wifi, X } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOffline } = usePWA();
  const [wasOffline, setWasOffline] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [dismissedOffline, setDismissedOffline] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setWasOffline(true);
      setDismissedOffline(false);
    } else if (wasOffline) {
      // Just came back online
      setShowOnlineToast(true);
      const timer = setTimeout(() => {
        setShowOnlineToast(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, wasOffline]);

  return (
    <>
      {/* Offline Alert Bar */}
      {isOffline && !dismissedOffline && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs font-medium sticky top-16 z-30 shadow-md transition-all">
          <div className="container mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-200 animate-pulse flex-shrink-0" />
              <span>
                <strong>Offline Mode Active</strong> — You can still access cached simulations, quizzes, coding lab & lessons!
              </span>
            </div>
            <button
              onClick={() => setDismissedOffline(true)}
              className="p-1 text-amber-200 hover:text-white rounded transition"
              aria-label="Dismiss offline banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Back Online Toast */}
      {showOnlineToast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-500/40">
            <Wifi className="w-4 h-4 text-emerald-200" />
            <span>Connection restored! You are back online.</span>
          </div>
        </div>
      )}
    </>
  );
};
