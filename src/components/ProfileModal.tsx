import React, { useState, useEffect } from 'react';
import { UserProfile, ConnectionInvite } from '../types';
import {
  X,
  Flame,
  Github,
  Mail,
  Send,
  Check,
  MapPin,
  ExternalLink,
  BookOpen,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { inviteApi, ApiError } from '../services/api';
import { getProfileAvatar } from '../utils/avatar';

interface ProfileModalProps {
  profile: UserProfile | null;
  currentUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToChatWithUser?: (srn: string, name: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  currentUser,
  isOpen,
  onClose,
  onNavigateToChatWithUser,
}) => {
  if (!isOpen || !profile) return null;

  const isSelf = currentUser?.srn.toLowerCase() === profile.srn.toLowerCase();

  const [connectState, setConnectState] = useState<'none' | 'pending' | 'accepted' | 'declined'>('none');
  const [inviteMessage, setInviteMessage] = useState(
    `Hey ${profile.name.split(' ')[0]}! Would love to team up for SIH 2026. Let's discuss our problem statement!`
  );
  const [showInviteBox, setShowInviteBox] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Check connection status from backend
  useEffect(() => {
    let isMounted = true;

    async function checkInvites() {
      if (!currentUser || isSelf) return;
      try {
        const { invites } = await inviteApi.getInvites();
        if (!isMounted) return;

        const fromUpper = currentUser.srn.toUpperCase();
        const toUpper = profile.srn.toUpperCase();

        const match = invites.find(
          (inv) =>
            (inv.from_srn.toUpperCase() === fromUpper && inv.to_srn.toUpperCase() === toUpper) ||
            (inv.from_srn.toUpperCase() === toUpper && inv.to_srn.toUpperCase() === fromUpper)
        );

        if (match) {
          setConnectState(match.status);
        } else {
          setConnectState('none');
        }
      } catch {
        // Fallback gracefully
      }
    }

    checkInvites();

    return () => {
      isMounted = false;
    };
  }, [currentUser, profile, isSelf]);

  const handleSendInvite = async () => {
    if (!currentUser) return;
    setIsSending(true);
    setErrorMessage(null);

    try {
      await inviteApi.sendInvite(profile.srn, inviteMessage.trim());
      setConnectState('pending');
      setShowInviteBox(false);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err.message || 'Failed to send invite.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const avatarSrc = getProfileAvatar(profile.photo_url, profile.name, profile.srn);

  return (
    <div
      id="profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="profile-modal-card"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel border border-white/20 p-6 sm:p-8 text-white shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(12, 12, 16, 0.94)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Close Button */}
        <button
          id="close-profile-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-white/10">
          <div className="relative">
            <img
              src={avatarSrc}
              alt={profile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#f78900] shadow-lg"
            />
            {profile.looking_for_team && (
              <span
                className="absolute bottom-0 right-0 px-2 py-0.5 bg-emerald-500 text-[10px] font-bold text-black rounded-full border border-black shadow"
                title="Looking for squad"
              >
                OPEN
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold font-heading text-white">{profile.name}</h2>
              {isSelf && (
                <span className="text-xs px-2 py-0.5 bg-[#f78900]/20 text-[#ffb200] border border-[#f78900]/30 rounded-full">
                  Your Profile
                </span>
              )}
            </div>

            <p className="text-xs font-mono text-[#ffb200] tracking-wider mb-2">
              SRN: {profile.srn} {profile.prn ? `• PRN: ${profile.prn}` : ''}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-slate-100 font-medium">
                {profile.department}
              </span>
              <span className="px-2.5 py-1 rounded-md badge-cream font-medium">
                Semester {profile.semester}
              </span>
              {profile.gender && (
                <span
                  className={`px-2.5 py-1 rounded-md font-semibold border ${
                    profile.gender === 'Female'
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                      : profile.gender === 'Male'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  }`}
                >
                  {profile.gender === 'Female' ? '👩 Female (SIH Diversity)' : `👨 ${profile.gender}`}
                </span>
              )}
              {profile.campus && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 text-slate-300">
                  <MapPin className="w-3 h-3 text-[#f78900]" />
                  {profile.campus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="py-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Hackathons & Experience Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#f78900]/20 text-[#ffb200]">
                <Flame className="w-5 h-5 fill-[#f78900]" />
              </div>
              <div>
                <p className="text-lg font-bold text-white leading-tight">
                  {profile.hackathon_count}
                </p>
                <p className="text-[11px] text-slate-400">Hackathons</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white leading-tight">
                  Sem {profile.semester}
                </p>
                <p className="text-[11px] text-slate-400">B.Tech PESU</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight truncate">
                  PESU Verified
                </p>
                <p className="text-[11px] text-slate-400">Verified Student</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                About & SIH Goals
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Preferred Roles */}
          {profile.preferred_roles && profile.preferred_roles.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Preferred Squad Roles
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.preferred_roles.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[#9b0103]/40 to-[#f78900]/30 text-[#ffeabb] border border-[#f78900]/40 font-medium"
                  >
                    ★ {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests & Domains */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Interests & Tech Domains
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-100 font-medium"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No domain interests specified.</span>
              )}
            </div>
          </div>

          {/* Skills tags */}
          {profile.skills && profile.skills.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Specific Tools & Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-black/60 border border-[#f78900]/30 text-[#ffeabb] font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details / Direct Links */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
              Verified Links & Contact
            </h4>
            <div className="flex flex-wrap gap-3">
              {profile.github_url && (
                <a
                  href={
                    profile.github_url.startsWith('http')
                      ? profile.github_url
                      : `https://${profile.github_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-all"
                >
                  <Github className="w-4 h-4 text-[#ffb200]" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              {profile.email && (
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-all"
                >
                  <Mail className="w-4 h-4 text-[#ffb200]" />
                  <span className="truncate max-w-[180px]">{profile.email}</span>
                  {copiedEmail ? (
                    <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Copy</span>
                  )}
                </button>
              )}

              {profile.phone && (
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#f78900]" />
                  <span className="font-mono">{profile.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Connect / Invite Box */}
          {!isSelf && currentUser && (
            <div className="pt-2">
              {connectState === 'pending' ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#ffeabb]">
                    <UserCheck className="w-5 h-5 text-[#ffb200]" />
                    <span>Team invitation sent! Waiting for response.</span>
                  </div>
                  {onNavigateToChatWithUser && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToChatWithUser(profile.srn, profile.name);
                      }}
                      className="btn-secondary px-3 py-1 text-xs"
                    >
                      Community Post
                    </button>
                  )}
                </div>
              ) : connectState === 'accepted' ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm">
                  <Check className="w-5 h-5" />
                  <span>You are connected with {profile.name}!</span>
                </div>
              ) : showInviteBox ? (
                <div className="p-4 rounded-xl bg-white/5 border border-[#f78900]/40 space-y-3">
                  <label className="block text-xs font-semibold text-[#ffeabb]">
                    Personalized Team Invitation Message
                  </label>
                  <textarea
                    rows={3}
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full glass-input p-3 text-xs"
                    placeholder="Mention your proposed problem statement or role requirements..."
                    disabled={isSending}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowInviteBox(false)}
                      className="btn-secondary px-4 py-1.5 text-xs"
                      disabled={isSending}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendInvite}
                      disabled={isSending}
                      className="btn-primary px-5 py-1.5 text-xs flex items-center gap-1.5"
                    >
                      {isSending ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Squad Invite</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowInviteBox(true)}
                    className="btn-primary flex-1 py-3 px-6 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Invite to SIH Squad</span>
                  </button>

                  {onNavigateToChatWithUser && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToChatWithUser(profile.srn, profile.name);
                      }}
                      className="btn-secondary py-3 px-5 text-sm flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-[#ffb200]" />
                      <span>Mention in Chat</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
