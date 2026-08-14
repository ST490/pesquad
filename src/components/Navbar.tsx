import React, { useState } from 'react';
import { PageRoute, UserProfile } from '../types';
import {
  Users,
  MessageSquare,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { PESquadLogo } from './PESquadLogo';
import { getProfileAvatar } from '../utils/avatar';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems: { page: PageRoute; label: string; icon: React.ReactNode }[] = [
    { page: 'discover', label: 'Discover', icon: <Users className="w-4 h-4" /> },
    { page: 'chat', label: 'Community', icon: <MessageSquare className="w-4 h-4" /> },
    { page: 'profile', label: 'My Squad', icon: <User className="w-4 h-4" /> },
  ];

  const userAvatar = currentUser
    ? getProfileAvatar(currentUser.photo_url, currentUser.name, currentUser.srn)
    : '';

  return (
    <nav className="sticky top-0 z-40 w-full px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto glass px-4 sm:px-6 py-3 flex items-center justify-between z-10 border border-white/12 shadow-2xl">
        {/* Brand Logo with 3D Cybernetic Glowing Cube */}
        <div
          id="brand-logo"
          onClick={() => onNavigate('discover')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <PESquadLogo size="sm" animate={true} />
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight font-heading text-white">
              PES<span className="text-burning">quad</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-white/5 text-[#ffeabb] border border-white/10 opacity-75">
              SIH 2026
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links (Frosted Glass Tab Style) */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                id={`nav-link-${item.page}`}
                onClick={() => onNavigate(item.page)}
                className={`
                  text-sm font-medium transition-all duration-200 flex items-center gap-1.5 relative py-1
                  ${
                    isActive
                      ? 'text-[#f78900] border-b-2 border-[#f78900] font-bold'
                      : 'text-slate-300 hover:text-[#f78900]'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: User Profile & Account Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                id="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-1.5 pr-2 sm:pr-3 rounded-full glass hover:border-[#f78900]/50 transition-colors"
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-[10px] text-[#ffeabb] opacity-70 font-mono leading-tight">
                    {currentUser.srn}
                  </span>
                  <span className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-[#f78900] overflow-hidden bg-slate-800 shrink-0">
                  <img
                    src={userAvatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 glass-dropdown p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                          ONLINE
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-[#ffeabb] opacity-80">{currentUser.srn}</p>
                      <p className="text-[11px] text-[#ffb200] mt-0.5 truncate">{currentUser.department}</p>
                    </div>

                    <button
                      id="dropdown-profile-btn"
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-[#f78900]" />
                      <span>My Hacker Profile</span>
                    </button>

                    <div className="pt-1 border-t border-white/10 mt-1">
                      <button
                        id="dropdown-logout-btn"
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              id="nav-login-btn"
              onClick={() => onNavigate('login')}
              className="btn-primary text-xs px-5 py-2 font-bold"
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden mt-2 p-3 glass border border-white/15 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  setMobileNavOpen(false);
                  onNavigate(item.page);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                  isActive
                    ? 'text-[#f78900] bg-white/10 font-bold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
