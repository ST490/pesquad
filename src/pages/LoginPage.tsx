import React, { useState, useEffect } from 'react';
import { DotField } from '../components/DotField';
import { GlassCard } from '../components/GlassCard';
import {
  Sparkles,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types';
import { authApi, ApiError } from '../services/api';
import { StorageService } from '../services/storageService';
import { PESquadLogo } from '../components/PESquadLogo';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile, isFirstLogin?: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // Direct Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDirectForm, setShowDirectForm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check URL parameters for OAuth errors
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      setErrorMessage(decodeURIComponent(errorParam));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // 1. Handle Primary OAuth 2.0 Flow
  const handleOAuthLogin = () => {
    setIsOAuthLoading(true);
    setErrorMessage(null);
    try {
      authApi.initiatePesuOAuth();
    } catch (err: any) {
      setIsOAuthLoading(false);
      setErrorMessage(err.message || 'Failed to redirect to PESU OAuth2 provider.');
    }
  };

  // 2. Handle Direct Credentials Sign In
  const handleDirectLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage('Please enter your PESU SRN or PRN.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your PESU Academy password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.login(cleanId, password);
      StorageService.setCurrentUser(res.user);
      setSuccessMessage('Verified! Signing you in...');
      setTimeout(() => {
        onLoginSuccess(res.user, res.isFirstLogin);
      }, 400);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please verify your PESU credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Interactive DotField canvas background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(247, 137, 0, 0.45)"
          gradientTo="rgba(255, 178, 0, 0.25)"
          glowColor="rgba(247, 137, 0, 0.25)"
        />
      </div>

      {/* Floating Warm radial ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[700px] h-[550px] rounded-full blur-[140px] opacity-25 pointer-events-none bg-gradient-to-tr from-[#9b0103] via-[#f78900] to-[#ffb200]" />

      {/* Center Glass Auth Card */}
      <div className="relative z-10 w-full max-w-lg my-8">
        <GlassCard
          id="auth-card"
          className="p-6 sm:p-10 border border-white/20 shadow-2xl backdrop-blur-2xl"
          style={{ background: 'rgba(12, 12, 16, 0.94)' }}
        >
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-2">
              <PESquadLogo size="2xl" animate={true} />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ffb200]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ffeabb]">
                PES University • SIH 2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              PES<span className="text-[#f78900]">quad</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 font-medium">
              Find your Smart India Hackathon squad at PESU
            </p>
          </div>

          {/* PESU OAuth2 Badge */}
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#f78900]/10 border border-[#f78900]/30 mb-6">
            <ShieldCheck className="w-4 h-4 text-[#f78900]" />
            <span className="text-[11px] font-semibold text-[#ffeabb]">
              Protected with PESU OAuth 2.0 (Vision2822/pesu-oauth2)
            </span>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 mb-5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-300">Authentication Failed</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 mb-5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-emerald-300">Success</p>
                <p className="mt-0.5">{successMessage}</p>
              </div>
            </div>
          )}

          {/* PRIMARY: PESU OAUTH 2.0 BUTTON */}
          <div className="space-y-4">
            <button
              id="btn-pesu-oauth"
              type="button"
              onClick={handleOAuthLogin}
              disabled={isOAuthLoading}
              className="w-full btn-primary py-4 px-6 text-sm font-bold flex items-center justify-center gap-3 shadow-xl transition-all"
            >
              {isOAuthLoading ? (
                <div className="flex items-center gap-2 text-black">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Redirecting to PESU Auth...</span>
                </div>
              ) : (
                <>
                  <KeyRound className="w-5 h-5" />
                  <span>Sign in with PESU Account</span>
                  <ExternalLink className="w-4 h-4 opacity-75" />
                </>
              )}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-[11px] uppercase tracking-wider font-mono">
                or sign in with credentials
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {!showDirectForm ? (
              <button
                type="button"
                onClick={() => setShowDirectForm(true)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Enter SRN & Password directly</span>
              </button>
            ) : (
              <form onSubmit={handleDirectLoginSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#ffeabb] mb-1">
                    PESU SRN or PRN *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-pesu-id"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. PES1UG23CS101"
                      className="w-full glass-input pl-10 pr-4 py-2 text-xs font-mono tracking-wide"
                      disabled={isLoading}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ffeabb] mb-1">
                    PESU Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-pesu-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full glass-input pl-10 pr-10 py-2 text-xs"
                      disabled={isLoading}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-pesu-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-xs font-bold text-black bg-[#f78900] hover:bg-[#ffb200] rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-black">
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>OAuth 2.0 PKCE • Encrypted Session</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Authenticates securely via PESU OAuth2. Your credentials are never stored by PESquad.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
