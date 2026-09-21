import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PWAProvider } from './context/PWAContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { MobileDrawer } from './components/navigation/MobileDrawer';
import { AdminAuthModal } from './components/common/AdminAuthModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ToastContainer } from './components/common/ToastContainer';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { PWAUpdateToast } from './components/pwa/PWAUpdateToast';

// Views
import { HomeView } from './components/home/HomeView';
import { DashboardView } from './components/dashboard/DashboardView';
import { SimulationContainer } from './components/simulations/SimulationContainer';
import { VideoLearningView } from './components/videos/VideoLearningView';
import { QuizView } from './components/quizzes/QuizView';
import { CodingLabView } from './components/coding/CodingLabView';
import { ActivitiesView } from './components/activities/ActivitiesView';
import { ChallengesView } from './components/challenges/ChallengesView';
import { ResourcesView } from './components/resources/ResourcesView';
import { LearningPathsView } from './components/paths/LearningPathsView';
import { StudentProfileView } from './components/profile/StudentProfileView';
import { AboutView } from './components/about/AboutView';
import { PrivacyView } from './components/privacy/PrivacyView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';

const MainContent: React.FC = () => {
  const { currentView, authUser } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // If user is not authenticated, require login for BOTH Students and Faculty/Admin
  if (!authUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Minimal header */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-slate-800/80 max-w-7xl w-full mx-auto relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/30">
              S
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                STEM<span className="text-indigo-400">Learn</span>
              </span>
              <p className="text-[11px] text-slate-400">Palghar • SDES IT Department</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Interactive Digital STEM Education Platform
          </div>
        </header>

        {/* Main Auth Gate Screen with Google popup and registration */}
        <main className="flex-1 flex items-center justify-center p-4 relative z-10 my-4">
          <AdminAuthModal
            isOpen={true}
            onClose={() => {}}
            isGate={true}
          />
        </main>

        {/* Minimal footer */}
        <footer className="px-6 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500 relative z-10">
          © {new Date().getFullYear()} STEM Learn • SDES Department of Information Technology, Palghar.
        </footer>

        <ToastContainer />
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <DashboardView />;
      case 'simulations':
        return <SimulationContainer />;
      case 'videos':
        return <VideoLearningView />;
      case 'quizzes':
        return <QuizView />;
      case 'coding':
        return <CodingLabView />;
      case 'activities':
        return <ActivitiesView />;
      case 'challenges':
        return <ChallengesView />;
      case 'resources':
        return <ResourcesView />;
      case 'paths':
        return <LearningPathsView />;
      case 'profile':
        return <StudentProfileView />;
      case 'about':
        return <AboutView />;
      case 'privacy':
        return <PrivacyView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      <Navbar
        onOpenMobileDrawer={() => setIsDrawerOpen((prev) => !prev)}
        isMobileDrawerOpen={isDrawerOpen}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
      />

      <OfflineIndicator />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-12">
        {renderCurrentView()}
      </main>

      <Footer />

      {/* Modern Minimal Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenDrawer={() => setIsDrawerOpen((prev) => !prev)}
        isDrawerOpen={isDrawerOpen}
      />

      {/* Slide-over Mobile Drawer for Secondary Views */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
      />

      {/* Standalone Admin Auth Modal */}
      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <GlobalSearchModal />
      <ToastContainer />

      {/* PWA Enhancements: Install Banner & Service Worker Update Toast */}
      <PWAInstallBanner />
      <PWAUpdateToast />
    </div>
  );
};

export default function App() {
  return (
    <PWAProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </PWAProvider>
  );
}
