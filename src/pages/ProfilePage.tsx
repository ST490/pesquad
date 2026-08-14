import React, { useState, useEffect } from 'react';
import { UserProfile, Post } from '../types';
import { GlassCard } from '../components/GlassCard';
import { AVAILABLE_INTERESTS, PESU_DEPARTMENTS, CAMPUS_OPTIONS } from '../constants/pesuData';
import { profileApi, postApi, ApiError } from '../services/api';
import { StorageService } from '../services/storageService';
import { getProfileAvatar } from '../utils/avatar';
import {
  Flame,
  Github,
  Mail,
  Edit3,
  Check,
  X,
  Camera,
  MapPin,
  ExternalLink,
  LogOut,
  Save,
  ShieldCheck,
  Heart,
  MessageSquare,
  Phone,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';

interface ProfilePageProps {
  currentUser: UserProfile | null;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  onSelectProfile: (profile: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onUpdateProfile,
  onLogout,
  onSelectProfile,
}) => {
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <GlassCard className="p-8 space-y-4">
          <p className="text-slate-300">Please sign in to view your profile.</p>
        </GlassCard>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [department, setDepartment] = useState(currentUser.department);
  const [semester, setSemester] = useState(currentUser.semester);
  const [hackathonCount, setHackathonCount] = useState(currentUser.hackathon_count);
  const [githubUrl, setGithubUrl] = useState(currentUser.github_url || '');
  const [photoUrl, setPhotoUrl] = useState(currentUser.photo_url || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [interests, setInterests] = useState<string[]>(currentUser.interests || []);
  const [lookingForTeam, setLookingForTeam] = useState(currentUser.looking_for_team ?? true);

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch real posts authored by this student
  useEffect(() => {
    async function loadUserPosts() {
      try {
        const { posts } = await postApi.getPosts({ author_srn: currentUser.srn });
        setUserPosts(posts);
      } catch {
        // Fallback gracefully
      }
    }
    loadUserPosts();
  }, [currentUser.srn]);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const response = await profileApi.updateProfile(currentUser.srn, {
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        department,
        semester: Number(semester),
        hackathon_count: Number(hackathonCount),
        github_url: githubUrl.trim(),
        photo_url: photoUrl,
        bio: bio.trim(),
        interests,
        looking_for_team: lookingForTeam,
      });

      StorageService.setCurrentUser(response.profile);
      onUpdateProfile(response.profile);
      setIsEditing(false);

      setToastMessage('Profile changes saved to server!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err.message || 'Failed to save changes.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(currentUser.name);
    setPhone(currentUser.phone || '');
    setEmail(currentUser.email || '');
    setDepartment(currentUser.department);
    setSemester(currentUser.semester);
    setHackathonCount(currentUser.hackathon_count);
    setGithubUrl(currentUser.github_url || '');
    setPhotoUrl(currentUser.photo_url || '');
    setBio(currentUser.bio || '');
    setInterests(currentUser.interests || []);
    setLookingForTeam(currentUser.looking_for_team ?? true);
    setIsEditing(false);
    setErrorMessage(null);
  };

  const avatarSrc = getProfileAvatar(photoUrl, name, currentUser.srn);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6 pb-24">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="p-1 rounded-full bg-emerald-500 text-black">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <GlassCard
        id="profile-header-card"
        className="p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6"
        style={{ background: 'rgba(12, 12, 16, 0.94)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with change overlay */}
            <div className="relative group">
              <img
                src={avatarSrc}
                alt={name}
                className="w-24 h-24 rounded-full object-cover border-2 border-[#f78900] shadow-lg"
              />
              {isEditing && (
                <label
                  htmlFor="profile-photo-change"
                  className="absolute inset-0 bg-black/70 rounded-full flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[10px] font-semibold"
                >
                  <Camera className="w-5 h-5 mb-1 text-[#ffb200]" />
                  Upload
                  <input
                    id="profile-photo-change"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input px-3 py-1 text-xl font-bold font-heading text-white"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                    {name}
                  </h1>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  PESU Verified
                </span>
              </div>

              <p className="text-xs font-mono text-[#ffb200]">
                SRN: {currentUser.srn} {currentUser.prn ? `• PRN: ${currentUser.prn}` : ''}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200">
                  {currentUser.department}
                </span>
                <span className="px-2.5 py-0.5 rounded-md badge-cream">
                  Semester {currentUser.semester}
                </span>
                {currentUser.campus && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-[#f78900]" />
                    {currentUser.campus}
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                {currentUser.phone ? (
                  <div className="flex items-center gap-1.5 text-slate-200 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    <Phone className="w-3.5 h-3.5 text-[#ffb200]" />
                    <span className="text-slate-400">Phone:</span>
                    <a
                      href={`tel:${currentUser.phone.replace(/\s+/g, '')}`}
                      className="font-mono text-[#ffeabb] hover:underline"
                    >
                      {currentUser.phone}
                    </a>
                    <a
                      href={`https://wa.me/${currentUser.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5 hover:bg-emerald-500/30 transition-colors"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-2.5 h-2.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs italic">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>No phone added</span>
                  </div>
                )}

                {currentUser.email && (
                  <div className="flex items-center gap-1.5 text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    <Mail className="w-3.5 h-3.5 text-[#f78900]" />
                    <span className="font-mono text-slate-300">{currentUser.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            {isEditing ? (
              <>
                <button
                  id="cancel-edit-btn"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
                <button
                  id="save-profile-btn"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-lg"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  id="start-edit-btn"
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#ffb200]" />
                  <span>Edit Profile</span>
                </button>
                <button
                  id="profile-logout-btn"
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/30 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Hackathons Count */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#f78900] fill-[#f78900]" />
                Hackathons Attended
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={hackathonCount}
                  onChange={(e) => setHackathonCount(parseInt(e.target.value) || 0)}
                  className="w-full glass-input px-3 py-1.5 text-sm"
                />
              ) : (
                <p className="text-xl font-bold text-white">
                  {currentUser.hackathon_count}{' '}
                  <span className="text-xs font-normal text-slate-400">hackathons</span>
                </p>
              )}
            </div>

            {/* Squad status toggle */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Squad Status
              </label>
              {isEditing ? (
                <label className="flex items-center gap-2 pt-1 text-xs cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={lookingForTeam}
                    onChange={(e) => setLookingForTeam(e.target.checked)}
                    className="accent-[#f78900]"
                  />
                  <span>Actively Looking for SIH Squad</span>
                </label>
              ) : (
                <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 pt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  {currentUser.looking_for_team
                    ? 'Open for Team Invitations'
                    : 'Team Finalized'}
                </p>
              )}
            </div>

            {/* GitHub URL */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-[#ffb200]" />
                GitHub Link
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full glass-input px-3 py-1.5 text-xs font-mono"
                />
              ) : (
                <a
                  href={
                    currentUser.github_url?.startsWith('http')
                      ? currentUser.github_url
                      : `https://${currentUser.github_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#ffb200] hover:underline flex items-center gap-1 pt-1 font-mono truncate"
                >
                  <span className="truncate">{currentUser.github_url || 'Add GitHub URL'}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              )}
            </div>
          </div>

          {/* Edit mode inputs */}
          {isEditing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1">
                  Mobile / Phone No.
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    id="profile-phone-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full glass-input pl-9 pr-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1">
                  PESU Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name.branch@pesu.pes.edu"
                  className="w-full glass-input px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs bg-[#0a0a0d]"
                >
                  {PESU_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ffeabb] mb-1">
                  Current Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full glass-input px-3 py-2 text-xs bg-[#0a0a0d]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Bio & Pitch */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              About & SIH Aspirations
            </h3>
            {isEditing ? (
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full glass-input p-3 text-xs sm:text-sm"
                placeholder="Describe your technical background, domain experience, and ideal problem statement..."
              />
            ) : (
              <p className="text-sm text-slate-200 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                {currentUser.bio || 'No bio added yet. Click "Edit Profile" to add your introduction!'}
              </p>
            )}
          </div>

          {/* Interests & Domains */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Interests & Technical Domains
              </h3>
              {isEditing && (
                <span className="text-[11px] text-[#ffb200]">Click tags to toggle</span>
              )}
            </div>

            {isEditing ? (
              <div className="flex flex-wrap gap-2 p-3.5 rounded-xl bg-white/5 border border-white/10 max-h-48 overflow-y-auto">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#f78900] to-[#ffb200] text-black font-bold shadow-[0_0_10px_rgba(247,137,0,0.3)]'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentUser.interests && currentUser.interests.length > 0 ? (
                  currentUser.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#f78900]/20 to-[#ffb200]/15 text-[#ffeabb] border border-[#f78900]/30 font-medium"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No interests selected.</span>
                )}
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* User's Own Community Posts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#f78900]" />
            Your Community Posts ({userPosts.length})
          </h2>
        </div>

        {userPosts.length > 0 ? (
          <div className="space-y-3">
            {userPosts.map((post) => (
              <GlassCard key={post.id} className="p-4 border border-white/10 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  {post.looking_for_team && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f78900]/20 text-[#ffeabb] border border-[#f78900]/30 font-semibold">
                      Looking for Squad
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{post.body}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    {post.likes_count} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#ffb200]" />
                    {post.comments_count || 0} replies
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="p-6 text-center text-xs text-slate-400 border border-white/10">
            You haven't published any community posts yet. Head over to Community Feed to post about your SIH problem statement!
          </GlassCard>
        )}
      </div>
    </div>
  );
};
