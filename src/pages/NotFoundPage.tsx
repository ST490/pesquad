import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { PageRoute } from '../types';
import {
  Flame,
  Search,
  Compass,
  ArrowLeft,
  Users,
  MessageSquare,
  Sparkles,
  Layers,
  Terminal,
} from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 sm:px-8 py-10">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Main 404 Card */}
        <GlassCard
          id="404-container-card"
          className="p-8 sm:p-12 text-center border border-white/15 shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-2xl"
          style={{ background: 'rgba(12, 12, 16, 0.94)' }}
        >
          {/* Subtle Ambient Radial Glow inside card */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-[#9b0103] via-[#f78900] to-transparent rounded-full blur-[90px] opacity-30 pointer-events-none" />

          {/* 404 Badge & Visual */}
          <div className="relative inline-block mx-auto">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#9b0103] via-[#f78900] to-[#ffb200] flex items-center justify-center shadow-[0_0_40px_rgba(247,137,0,0.5)] rotate-12 mx-auto transition-transform hover:rotate-0 duration-300">
              <div className="w-16 h-16 bg-black rounded-2xl -rotate-12 flex flex-col items-center justify-center border border-white/20">
                <Compass className="w-8 h-8 text-[#ffb200] animate-spin" style={{ animationDuration: '10s' }} />
              </div>
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#9b0103] text-white text-[11px] font-mono font-bold border border-white/20 shadow">
              ERR_404
            </span>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#ffeabb]">
              <Flame className="w-3.5 h-3.5 text-[#f78900] fill-[#f78900]" />
              <span>SIH Squad Radar Lost Signal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight">
              404 <span className="text-burning">Not Found</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
              The hacker profile, squad link, or page coordinates you are looking for have drifted into deep cyberspace or never existed.
            </p>
          </div>

          {/* Diagnostic Console Card */}
          <div className="bg-black/60 rounded-xl p-4 border border-white/10 text-left font-mono text-xs space-y-1.5 text-slate-400 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-slate-500 pb-1 border-b border-white/5">
              <Terminal className="w-3.5 h-3.5 text-[#f78900]" />
              <span>PESU_OAUTH2_TERMINAL &bull; SIH 2026</span>
            </div>
            <div className="text-emerald-400">&gt; TARGET_ROUTE: null_pointer_exception</div>
            <div className="text-[#ffeabb]">&gt; RESOLUTION: Re-route back to active squad hub</div>
            <div className="text-slate-500">&gt; STATUS: 404_PAGE_NOT_FOUND</div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-404-discover"
              onClick={() => onNavigate('discover')}
              className="w-full sm:w-auto btn-primary py-3 px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Users className="w-4 h-4 text-black" />
              <span>Return to Discover Hackers</span>
            </button>

            <button
              id="btn-404-community"
              onClick={() => onNavigate('chat')}
              className="w-full sm:w-auto btn-secondary py-3 px-6 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#f78900]" />
              <span>Community Chat</span>
            </button>
          </div>

          {/* Quick Hashtags */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mr-1">Trending Squads:</span>
            {['#SIH2026', '#LookingForTeam', '#AIML', '#FullStack'].map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigate('chat')}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-[#f78900]/50 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
