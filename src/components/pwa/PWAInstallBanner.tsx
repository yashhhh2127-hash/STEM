import React, { useState } from 'react';
import { usePWA } from '../../context/PWAContext';
import { Download, X, Share, PlusSquare, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const {
    isInstallable,
    isInstalled,
    showInstallBanner,
    isIOS,
    promptInstall,
    dismissInstallBanner,
  } = usePWA();

  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // If already installed or banner dismissed and not installable, don't show
  if (isInstalled || !showInstallBanner) {
    return null;
  }

  // Only show if browser supports install prompt or device is iOS Safari
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      {/* Floating PWA Install Prompt Banner */}
      <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-indigo-500/30 flex items-start gap-3.5">
          {/* App Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
            <img src="/icons/icon-192x192.png" alt="STEM Learn" className="w-9 h-9 rounded-lg" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white tracking-tight">Install STEM Learn</h4>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-2.5 h-2.5" /> App
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Install for instant offline access, faster loading, and full-screen experience.
            </p>

            <div className="flex items-center gap-2 mt-3">
              {isIOS ? (
                <button
                  onClick={() => setShowIOSInstructions(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install Guide
                </button>
              ) : (
                <button
                  onClick={promptInstall}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install Now
                </button>
              )}

              <button
                onClick={dismissInstallBanner}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Maybe Later
              </button>
            </div>
          </div>

          <button
            onClick={dismissInstallBanner}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition -mr-1 -mt-1"
            aria-label="Close install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Download className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Install on iOS</h3>
              </div>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3">
              Follow these simple steps in Safari to add STEM Learn to your home screen:
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  1
                </span>
                <div className="text-slate-700">
                  Tap the <strong className="text-slate-900">Share</strong> button at the bottom of Safari:{' '}
                  <Share className="w-3.5 h-3.5 inline text-indigo-600 ml-0.5" />
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </span>
                <div className="text-slate-700">
                  Scroll down and tap <strong className="text-slate-900">Add to Home Screen</strong>:{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline text-indigo-600 ml-0.5" />
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </span>
                <div className="text-slate-700">
                  Tap <strong className="text-slate-900">Add</strong> in the top right corner. Done!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="mt-5 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
