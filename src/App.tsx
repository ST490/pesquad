import React, { useState, useEffect } from 'react';
import { PageRoute, UserProfile } from './types';
import { authApi, tokenStorage } from './services/api';
import { StorageService } from './services/storageService';
import { BackgroundBlobs } from './components/BackgroundBlobs';
import { Navbar } from './components/Navbar';
import { ProfileModal } from './components/ProfileModal';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PESquadLogo } from './components/PESquadLogo';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('discover');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedProfileModal, setSelectedProfileModal] = useState<UserProfile | null>(null);
  const [initialChatTag, setInitialChatTag] = useState<string | undefined>();
  const [initialChatMention, setInitialChatMention] = useState<string | undefined>();
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Initialize Authentication & Handle OAuth Redirects
  useEffect(() => {
    async function initAuth() {
      // 1. Check for OAuth callback parameters in URL query
      const urlParams = new URLSearchParams(window.location.search);
      const authStatus = urlParams.get('auth');
      const token = urlParams.get('token');
      const targetRoute = urlParams.get('route') as PageRoute | null;

      if (authStatus === 'success' && token) {
        tokenStorage.set(token);
        // Clear query parameters from URL cleanly
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 2. Fetch authenticated student profile from server (validates iron-session cookie / Bearer token)
      try {
        const { user } = await authApi.getMe();
        setCurrentUser(user);
        StorageService.setCurrentUser(user);

        if (targetRoute === 'onboarding' || (!user.interests || user.interests.length === 0)) {
          setCurrentPage('onboarding');
        } else {
          setCurrentPage('discover');
        }
      } catch {
        // Not authenticated
        StorageService.clearSession();
        setCurrentUser(null);
        setCurrentPage('login');
      } finally {
        setIsAppLoading(false);
      }
    }

    initAuth();
  }, []);

  const handleLoginSuccess = (user: UserProfile, isFirstLogin?: boolean) => {
    setCurrentUser(user);
    if (isFirstLogin || !user.interests || user.interests.length === 0) {
      setCurrentPage('onboarding');
    } else {
      setCurrentPage('discover');
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setCurrentUser(profile);
    setCurrentPage('discover');
  };

  const handleLogout = async () => {
    await authApi.logout();
    StorageService.clearSession();
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleNavigateToChatWithUser = (srn: string, name: string) => {
    setInitialChatMention(
      `Hey @${name.replace(/\s+/g, '')} (${srn})! Would love to explore teaming up for SIH 2026! #LookingForTeam #SIH2026`
    );
    setCurrentPage('chat');
  };

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <PESquadLogo size="xl" animate={true} />
        <div className="flex items-center gap-3 text-sm text-[#ffeabb]">
          <div className="w-4 h-4 border-2 border-[#f78900] border-t-transparent rounded-full animate-spin" />
          <span>Authenticating with PESU OAuth2...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#000000] text-slate-100 selection:bg-[#f78900] selection:text-black flex flex-col justify-between">
      {/* Frosted Glass Radial Ambient Background */}
      <BackgroundBlobs />

      {/* Main Navigation (Hidden on Login & Onboarding) */}
      {currentPage !== 'login' && currentPage !== 'onboarding' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        {currentPage === 'login' && (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}

        {currentPage === 'onboarding' && currentUser && (
          <OnboardingPage
            currentUser={currentUser}
            onComplete={handleOnboardingComplete}
          />
        )}

        {currentPage === 'discover' && (
          <DiscoverPage
            currentUser={currentUser}
            onSelectProfile={(profile) => setSelectedProfileModal(profile)}
          />
        )}

        {currentPage === 'chat' && (
          <ChatPage
            currentUser={currentUser}
            onSelectProfile={(profile) => setSelectedProfileModal(profile)}
            initialSelectedTag={initialChatTag}
            initialMentionText={initialChatMention}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onUpdateProfile={(updated) => {
              setCurrentUser(updated);
            }}
            onLogout={handleLogout}
            onSelectProfile={(profile) => setSelectedProfileModal(profile)}
          />
        )}

        {currentPage === '404' && (
          <NotFoundPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Frosted Glass Footer */}
      {currentPage !== 'login' && currentPage !== 'onboarding' && (
        <footer className="relative z-10 h-10 px-6 sm:px-12 flex items-center justify-between text-[11px] opacity-40 mb-2 border-t border-white/5 pt-2">
          <div>&copy; 2026 PESquad • PES University SIH Teammate Matchmaker</div>
          <div className="flex gap-4">
            <span
              onClick={() => setCurrentPage('404')}
              className="hover:text-[#f78900] text-slate-300 font-mono cursor-pointer"
              title="View custom 404 error page"
            >
              [404 Test Page]
            </span>
            <span className="hover:text-[#f78900] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#f78900] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#f78900] cursor-pointer">SIH Help Desk</span>
          </div>
        </footer>
      )}

      {/* Global Profile Modal */}
      <ProfileModal
        profile={selectedProfileModal}
        currentUser={currentUser}
        isOpen={!!selectedProfileModal}
        onClose={() => setSelectedProfileModal(null)}
        onNavigateToChatWithUser={handleNavigateToChatWithUser}
      />
    </div>
  );
}
