import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

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
  isAutoUpdating: boolean;
  isIOS: boolean;
  showInstallBanner: boolean;
  promptInstall: () => Promise<void>;
  updateApp: () => void;
  checkForUpdates: () => Promise<void>;
  dismissInstallBanner: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const isRefreshingRef = useRef(false);

  // Trigger smooth automatic app reload when a new service worker takes over
  const triggerAutoReload = useCallback(() => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setIsAutoUpdating(true);

    // Prevent infinite reload loops within 5 seconds
    const lastReload = Number(sessionStorage.getItem('stem_last_sw_reload') || '0');
    const now = Date.now();
    if (now - lastReload < 5000) {
      setIsAutoUpdating(false);
      return;
    }

    sessionStorage.setItem('stem_last_sw_reload', String(now));
    setTimeout(() => {
      window.location.reload();
    }, 600);
  }, []);

  // Explicit update check helper
  const checkForUpdates = useCallback(async () => {
    if (registrationRef.current) {
      try {
        console.log('[PWA] Checking for updates...');
        await registrationRef.current.update();
      } catch (err) {
        console.warn('[PWA] Update check failed:', err);
      }
    }
  }, []);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed on mobile/desktop)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      setShowInstallBanner(false);
    } else {
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
    const handleOnline = () => {
      setIsOffline(false);
      checkForUpdates();
    };
    const handleOffline = () => setIsOffline(true);

    // 6. Mobile Foreground & Visibility Listeners (Auto-check updates when user reopens app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };

    const handleWindowFocus = () => {
      checkForUpdates();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    // 7. Register Service Worker with Auto-Update logic
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          registrationRef.current = registration;

          // Immediate check for updates upon registration
          registration.update().catch(() => {});

          // If a service worker is already waiting, auto-activate it immediately!
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setNeedRefresh(true);
            // AUTO-UPDATE: Skip waiting immediately without user prompt
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }

          // Listen for new service worker installation
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // There is an active older version running: auto-update to the new version!
                    console.log('[PWA] New version installed. Automatically activating...');
                    setWaitingWorker(installingWorker);
                    setNeedRefresh(true);
                    setIsAutoUpdating(true);
                    installingWorker.postMessage({ type: 'SKIP_WAITING' });
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn('Service Worker registration skipped or failed:', error);
        });

      // Listen for controller changes (when new SW activates and claims clients)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Controller changed: auto-reloading to apply latest updates.');
        triggerAutoReload();
      });

      // Listen for activation messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          console.log('[PWA] SW_ACTIVATED broadcast received:', event.data.version);
          triggerAutoReload();
        }
      });

      // 8. Periodic background update check every 60 seconds
      const updateInterval = setInterval(() => {
        if (navigator.onLine && registrationRef.current) {
          registrationRef.current.update().catch(() => {});
        }
      }, 60000);

      return () => {
        clearInterval(updateInterval);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleWindowFocus);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [checkForUpdates, triggerAutoReload]);

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
    } else {
      triggerAutoReload();
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
        isAutoUpdating,
        isIOS,
        showInstallBanner,
        promptInstall,
        updateApp,
        checkForUpdates,
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

