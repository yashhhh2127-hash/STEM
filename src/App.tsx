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
  const { currentView } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

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
