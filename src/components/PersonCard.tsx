import React from 'react';
import { UserProfile } from '../types';
import { Flame, ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { getProfileAvatar } from '../utils/avatar';

interface PersonCardProps {
  profile: UserProfile;
  onClick: () => void;
  isCurrentUser?: boolean;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  profile,
  onClick,
  isCurrentUser = false,
}) => {
  const avatarSrc = getProfileAvatar(profile.photo_url, profile.name, profile.srn);

  return (
    <GlassCard
      interactive
      onClick={onClick}
      id={`person-card-${profile.srn}`}
      className="group flex flex-col justify-between p-5 h-full transition-all duration-300"
    >
      {/* Top Header: Avatar + Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <img
              src={avatarSrc}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20 group-hover:border-[#f78900] transition-colors duration-300 shadow-md"
            />
            {profile.looking_for_team ? (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black shadow"
                title="Actively looking for squad"
              />
            ) : (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-500 rounded-full border-2 border-black shadow"
                title="Not actively looking for squad"
              />
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* Hackathon flame badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#9b0103]/40 to-[#f78900]/30 text-[#ffb200] border border-[#f78900]/30 shadow-sm"
              title={`${profile.hackathon_count} Hackathons attended`}
            >
              <Flame className="w-3.5 h-3.5 text-[#f78900] fill-[#f78900]" />
              <span>
                {profile.hackathon_count} {profile.hackathon_count === 1 ? 'hack' : 'hacks'}
              </span>
            </div>

            {/* Gender & Semester badges */}
            <div className="flex items-center gap-1.5">
              {profile.gender && (
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    profile.gender === 'Female'
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                      : profile.gender === 'Male'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  }`}
                  title={profile.gender === 'Female' ? 'Female Hacker (SIH Diversity Requirement)' : `Gender: ${profile.gender}`}
                >
                  {profile.gender === 'Female' ? '👩 Female' : profile.gender === 'Male' ? '👨 Male' : profile.gender}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium badge-cream">
                Sem {profile.semester}
              </span>
            </div>
          </div>
        </div>

        {/* Name & SRN */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-bold text-white group-hover:text-[#ffb200] transition-colors line-clamp-1">
              {profile.name}
            </h3>
            {isCurrentUser && (
              <span className="text-[10px] px-1.5 py-0.5 bg-[#f78900]/20 text-[#ffeabb] rounded font-medium">
                You
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-slate-400 tracking-wider">
            {profile.srn}
          </p>
        </div>

        {/* Department & Campus */}
        <p className="text-xs text-slate-300 font-medium line-clamp-1 mb-3">
          {profile.department}
        </p>

        {/* Bio excerpt */}
        {profile.bio && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3.5 leading-relaxed italic">
            "{profile.bio}"
          </p>
        )}

        {/* Interests Chips (Limit to 3 visible + count) */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.interests && profile.interests.slice(0, 3).map((interest, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-200 group-hover:border-[#f78900]/30 transition-colors"
            >
              {interest}
            </span>
          ))}
          {profile.interests && profile.interests.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400 font-medium">
              +{profile.interests.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer Action */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {profile.campus && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-[#f78900]" />
              {profile.campus}
            </span>
          )}
          {profile.phone && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-slate-300 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
              <Phone className="w-2.5 h-2.5 text-[#ffb200]" />
              {profile.phone}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[#ffb200] font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
          <span>View Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </GlassCard>
  );
};
