import React, { useState } from 'react';
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
  User,
  Building,
  Mail,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { UserProfile } from '../types';
import { authApi, ApiError } from '../services/api';
import { StorageService } from '../services/storageService';
import { PESquadLogo } from '../components/PESquadLogo';
import { PESU_DEPARTMENTS, CAMPUS_OPTIONS } from '../constants/pesuData';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile, isFirstLogin?: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login Form State (PESU ID & Password)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form State
  const [regSrn, setRegSrn] = useState('');
  const [regPrn, setRegPrn] = useState('');
  const [regName, setRegName] = useState('');
  const [regDepartment, setRegDepartment] = useState(PESU_DEPARTMENTS[0]);
  const [regSemester, setRegSemester] = useState(4);
  const [regCampus, setRegCampus] = useState<'RR Campus' | 'EC Campus'>('RR Campus');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Handle Login with PESU ID & Password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage('Please enter your PESU ID (SRN, PRN, or Email).');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your PESU password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.login(cleanId, password);
      StorageService.setCurrentUser(res.user);
      onLoginSuccess(res.user, res.isFirstLogin);
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

  // 2. Handle Student Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanSrn = regSrn.trim().toUpperCase();
    const cleanName = regName.trim();

    if (!cleanSrn) {
      setErrorMessage('Please enter your PESU SRN (e.g. PES1UG23CS101).');
      return;
    }

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.register({
        srn: cleanSrn,
        prn: regPrn.trim().toUpperCase() || undefined,
        name: cleanName,
        password: regPassword,
        department: regDepartment,
        semester: Number(regSemester),
        campus: regCampus,
        email: regEmail.trim().toLowerCase() || `${cleanName.toLowerCase().replace(/\s+/g, '')}.${cleanSrn.slice(-4).toLowerCase()}@pes.edu`,
      });

      StorageService.setCurrentUser(res.user);
      setSuccessMessage('Account registered successfully! Redirecting...');
      setTimeout(() => {
        onLoginSuccess(res.user, true);
      }, 500);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err.message || 'Registration failed. Please check your details.');
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

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMode === 'login'
                  ? 'bg-[#f78900] text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>PESU Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMode === 'register'
                  ? 'bg-[#f78900] text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Register Account</span>
            </button>
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

          {/* TAB 1: PESU CREDENTIALS LOGIN */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1.5">
                  PESU ID (SRN / PRN / Email) *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-pesu-id"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. PES1UG23CS101 or PES1202301101"
                    className="w-full glass-input pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono tracking-wide"
                    disabled={isLoading}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1.5">
                  PESU Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-pesu-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full glass-input pl-10 pr-11 py-2.5 text-xs sm:text-sm"
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-pesu-login"
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2.5 shadow-xl transition-all mt-5"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 text-black">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Signing in with PESU credentials...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In with PESU</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: STUDENT REGISTRATION */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#ffeabb] mb-1">
                    PESU SRN *
                  </label>
                  <input
                    type="text"
                    value={regSrn}
                    onChange={(e) => setRegSrn(e.target.value)}
                    placeholder="PES1UG23CS101"
                    className="w-full glass-input px-3 py-2 text-xs uppercase font-mono"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#ffeabb] mb-1">
                    PESU PRN (Optional)
                  </label>
                  <input
                    type="text"
                    value={regPrn}
                    onChange={(e) => setRegPrn(e.target.value)}
                    placeholder="PES1202301101"
                    className="w-full glass-input px-3 py-2 text-xs uppercase font-mono"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#ffeabb] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sufiyan Ahmed"
                    className="w-full glass-input pl-9 pr-3 py-2 text-xs"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#ffeabb] mb-1">
                    Department *
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full glass-input pl-9 pr-3 py-2 text-xs bg-[#121218]"
                      disabled={isLoading}
                    >
                      {PESU_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="bg-[#121218] text-white">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#ffeabb] mb-1">
                    Semester & Campus *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={regSemester}
                      onChange={(e) => setRegSemester(Number(e.target.value))}
                      className="w-full glass-input px-2 py-2 text-xs bg-[#121218]"
                      disabled={isLoading}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem} className="bg-[#121218] text-white">
                          Sem {sem}
                        </option>
                      ))}
                    </select>
                    <select
                      value={regCampus}
                      onChange={(e) => setRegCampus(e.target.value as any)}
                      className="w-full glass-input px-2 py-2 text-xs bg-[#121218]"
                      disabled={isLoading}
                    >
                      {CAMPUS_OPTIONS.map((c) => (
                        <option key={c} value={c} className="bg-[#121218] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#ffeabb] mb-1">
                  PESU Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="student.dept@pes.edu"
                    className="w-full glass-input pl-9 pr-3 py-2 text-xs"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#ffeabb] mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full glass-input px-3 py-2 text-xs"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#ffeabb] mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full glass-input px-3 py-2 text-xs"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <button
                id="btn-pesu-register"
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 text-black">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Registering PESU Account...</span>
                  </div>
                ) : (
                  <>
                    <span>Register & Join SIH Squads</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Session Cookie & PBKDF2 Hashed</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Only verified PES University students may participate in SIH squad matchmaking.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
