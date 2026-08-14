import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { UserProfile } from '../types';
import { PESU_DEPARTMENTS, AVAILABLE_INTERESTS, SQUAD_ROLES } from '../constants/pesuData';
import { profileApi, ApiError } from '../services/api';
import { StorageService } from '../services/storageService';
import { getProfileAvatar } from '../utils/avatar';
import {
  Sparkles,
  Upload,
  Github,
  Flame,
  Check,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Camera,
  Phone,
} from 'lucide-react';
import { PESquadLogo } from '../components/PESquadLogo';

interface OnboardingPageProps {
  currentUser: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  currentUser,
  onComplete,
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [department, setDepartment] = useState(currentUser.department || PESU_DEPARTMENTS[0]);
  const [semester, setSemester] = useState(currentUser.semester || 4);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(currentUser.gender || 'Male');
  const [hackathonCount, setHackathonCount] = useState(currentUser.hackathon_count || 0);
  const [githubUrl, setGithubUrl] = useState(currentUser.github_url || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [photoUrl, setPhotoUrl] = useState(currentUser.photo_url || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser.interests?.length ? currentUser.interests : ['Frontend', 'Backend']
  );
  const [bio, setBio] = useState(currentUser.bio || '');
  const [preferredRole, setPreferredRole] = useState(
    currentUser.preferred_roles?.[0] || 'Full Stack Developer'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'Image size should be less than 2MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full Name is required';
    if (githubUrl.trim() && !githubUrl.includes('github.com')) {
      errs.githubUrl = 'Please provide a valid GitHub profile URL (e.g., https://github.com/username)';
    }
    if (hackathonCount < 0) {
      errs.hackathonCount = 'Hackathons count cannot be negative';
    }
    if (selectedInterests.length === 0) {
      errs.interests = 'Please select at least 1 technical domain/interest';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await profileApi.updateProfile(currentUser.srn, {
        name: name.trim(),
        department,
        semester: Number(semester),
        gender,
        hackathon_count: Number(hackathonCount),
        github_url: githubUrl.trim(),
        phone: phone.trim() || undefined,
        photo_url: photoUrl,
        interests: selectedInterests,
        bio: bio.trim(),
        preferred_roles: [preferredRole],
        looking_for_team: true,
      });

      StorageService.setCurrentUser(response.profile);
      onComplete(response.profile);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayAvatar = getProfileAvatar(photoUrl, name, currentUser.srn);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 flex justify-center items-center">
      <div className="w-full max-w-2xl">
        <GlassCard
          id="onboarding-card"
          className="p-6 sm:p-10 border border-white/20 shadow-2xl backdrop-blur-2xl"
          style={{ background: 'rgba(12, 12, 16, 0.94)' }}
        >
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-3">
              <PESquadLogo size="lg" animate={true} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f78900]/15 border border-[#f78900]/30 text-[#ffb200] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete Hacker Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Set Up Your <span className="text-[#f78900]">PESquad</span> Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Help PESU peers discover your technical skills, hackathon record, and role preferences for SIH 2026.
            </p>
          </div>

          {/* Verified PESU Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white font-mono">
                  SRN: {currentUser.srn} {currentUser.prn ? `• PRN: ${currentUser.prn}` : ''}
                </p>
                <p className="text-[11px] text-slate-400">
                  {currentUser.campus || 'RR Campus'} • {currentUser.department}
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
              VERIFIED
            </span>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 mb-5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo & Basic Info Row */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="relative group">
                <img
                  src={displayAvatar}
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#f78900] shadow-md"
                />
                <label
                  htmlFor="photo-upload"
                  className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-[10px] font-semibold"
                >
                  <Camera className="w-5 h-5 mb-1 text-[#ffb200]" />
                  Upload Photo
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 w-full space-y-3 text-left">
                <div>
                  <label className="block text-xs font-semibold text-[#ffeabb] mb-1">
                    Full Name *
                  </label>
                  <input
                    id="onboarding-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 text-sm"
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#ffb200]" />
                  <span>Custom photo upload supported (or default initials avatar)</span>
                </div>
              </div>
            </div>

            {/* Department, Semester & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1.5">
                  Department / Branch *
                </label>
                <select
                  id="onboarding-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full glass-input px-3 py-2.5 text-xs sm:text-sm bg-[#0a0a0d]"
                  disabled={isSubmitting}
                >
                  {PESU_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1.5">
                  Current Semester *
                </label>
                <select
                  id="onboarding-semester"
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full glass-input px-3 py-2.5 text-xs sm:text-sm bg-[#0a0a0d]"
                  disabled={isSubmitting}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1.5">
                  Gender (SIH Diversity) *
                </label>
                <select
                  id="onboarding-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full glass-input px-3 py-2.5 text-xs sm:text-sm bg-[#0a0a0d] font-medium text-[#ffeabb]"
                  disabled={isSubmitting}
                >
                  <option value="Male">👨 Male</option>
                  <option value="Female">👩 Female (SIH Req)</option>
                  <option value="Other">🧑 Other</option>
                </select>
              </div>
            </div>

            {/* Hackathon count & GitHub URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#f78900] fill-[#f78900]" />
                    Hackathons Attended So Far
                  </span>
                </label>
                <input
                  id="onboarding-hackathons"
                  type="number"
                  min="0"
                  max="50"
                  value={hackathonCount}
                  onChange={(e) => setHackathonCount(parseInt(e.target.value) || 0)}
                  className="w-full glass-input px-3.5 py-2 text-sm"
                  placeholder="0"
                  disabled={isSubmitting}
                />
                {errors.hackathonCount && (
                  <p className="text-xs text-rose-400 mt-1">{errors.hackathonCount}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Github className="w-4 h-4 text-[#ffb200]" />
                    GitHub Profile URL
                  </span>
                </label>
                <input
                  id="onboarding-github"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 text-sm font-mono"
                  placeholder="https://github.com/username"
                  disabled={isSubmitting}
                />
                {errors.githubUrl && (
                  <p className="text-xs text-rose-400 mt-1">{errors.githubUrl}</p>
                )}
              </div>
            </div>

            {/* Phone & Squad Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#ffb200]" />
                    Contact / WhatsApp Number
                  </span>
                </label>
                <input
                  id="onboarding-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 text-sm"
                  placeholder="+91 98765 43210"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1.5">
                  Primary Squad Role
                </label>
                <select
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 text-xs sm:text-sm bg-[#0a0a0d]"
                  disabled={isSubmitting}
                >
                  {SQUAD_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interests & Domains (Chips) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#ffeabb]">
                  Interests & Technical Domains (Pick 1 or more) *
                </label>
                <span className="text-[11px] text-slate-400">
                  {selectedInterests.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2 p-3.5 rounded-xl bg-white/5 border border-white/10 max-h-48 overflow-y-auto">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#f78900] to-[#ffb200] text-black font-bold shadow-[0_0_10px_rgba(247,137,0,0.3)]'
                          : 'bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
              {errors.interests && (
                <p className="text-xs text-rose-400 mt-1">{errors.interests}</p>
              )}
            </div>

            {/* Bio / SIH Pitch */}
            <div>
              <label className="block text-xs font-semibold text-[#ffeabb] mb-1.5">
                Bio & SIH Pitch (What problems do you want to solve?)
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full glass-input p-3 text-xs sm:text-sm"
                placeholder="Mention past project experience, problem tracks of interest (e.g. Smart Cities, MedTech, Clean Tech)..."
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              id="submit-onboarding-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Saving Profile to Server...</span>
                </div>
              ) : (
                <>
                  <span>Save Profile & Explore Squads</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
