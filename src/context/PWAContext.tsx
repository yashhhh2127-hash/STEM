import React, { createContext, useContext, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  needRefresh: boolean;
  isIOS: boolean;
  showInstallBanner: boolean;
  promptInstall: () => Promise<void>;
  updateApp: () => void;
  dismissInstallBanner: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      setShowInstallBanner(false);
    } else {
      // Check if user previously dismissed banner in current session
      const dismissed = sessionStorage.getItem('stem_pwa_banner_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    }

    // 2. Check iOS Safari
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice && !isStandalone);

    // 3. Listen for BeforeInstallPromptEvent
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      const dismissed = sessionStorage.getItem('stem_pwa_banner_dismissed');
      if (!dismissed && !isStandalone) {
        setShowInstallBanner(true);
      }
    };

    // 4. Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    // 5. Online / Offline listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 6. Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Check for waiting service worker
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setNeedRefresh(true);
          }

          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (
                  installingWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  setWaitingWorker(installingWorker);
                  setNeedRefresh(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn('Service Worker registration skipped or failed:', error);
        });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const promptInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const updateApp = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('stem_pwa_banner_dismissed', 'true');
  };

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isOffline,
        needRefresh,
        isIOS,
        showInstallBanner,
        promptInstall,
        updateApp,
        dismissInstallBanner,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
