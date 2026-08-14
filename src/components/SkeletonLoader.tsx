import React from 'react';
import { GlassCard } from './GlassCard';

export const PersonCardSkeleton: React.FC = () => {
  return (
    <GlassCard className="p-5 h-[340px] flex flex-col justify-between border border-white/10 relative overflow-hidden group">
      {/* Top row */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="relative">
            <div className="w-14 h-14 rounded-full skeleton-glass" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full skeleton-glass" />
          </div>
          <div className="w-20 h-6 rounded-full skeleton-glass" />
        </div>

        {/* Name & Academic info */}
        <div className="space-y-2 pt-1">
          <div className="w-3/4 h-5 rounded-md skeleton-glass" />
          <div className="w-1/2 h-3.5 rounded skeleton-glass opacity-70" />
          <div className="w-1/3 h-3 rounded skeleton-glass opacity-50" />
        </div>

        {/* Bio preview */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-3 rounded skeleton-glass opacity-60" />
          <div className="w-5/6 h-3 rounded skeleton-glass opacity-40" />
        </div>
      </div>

      {/* Skills / Interests tags */}
      <div className="space-y-3 pt-3 border-t border-white/5">
        <div className="flex gap-1.5 flex-wrap">
          <div className="w-14 h-5 rounded-full skeleton-glass opacity-75" />
          <div className="w-16 h-5 rounded-full skeleton-glass opacity-75" />
          <div className="w-12 h-5 rounded-full skeleton-glass opacity-75" />
        </div>
        
        {/* Action button */}
        <div className="w-full h-8 rounded-xl skeleton-glass" />
      </div>
    </GlassCard>
  );
};

export const PostSkeleton: React.FC = () => {
  return (
    <GlassCard className="p-5 border border-white/10 space-y-4">
      {/* Post author header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full skeleton-glass" />
          <div className="space-y-1.5">
            <div className="w-28 h-4 rounded skeleton-glass" />
            <div className="w-36 h-3 rounded skeleton-glass opacity-60" />
          </div>
        </div>
        <div className="w-16 h-4 rounded skeleton-glass opacity-50" />
      </div>

      {/* Post content body */}
      <div className="space-y-2 py-1">
        <div className="w-full h-3.5 rounded skeleton-glass" />
        <div className="w-11/12 h-3.5 rounded skeleton-glass" />
        <div className="w-4/5 h-3.5 rounded skeleton-glass opacity-75" />
      </div>

      {/* Hashtag pills */}
      <div className="flex gap-2">
        <div className="w-20 h-5 rounded-full skeleton-glass opacity-70" />
        <div className="w-24 h-5 rounded-full skeleton-glass opacity-70" />
        <div className="w-16 h-5 rounded-full skeleton-glass opacity-70" />
      </div>

      {/* Footer action buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-6 rounded-md skeleton-glass opacity-60" />
          <div className="w-14 h-6 rounded-md skeleton-glass opacity-60" />
        </div>
        <div className="w-20 h-6 rounded-md skeleton-glass opacity-60" />
      </div>
    </GlassCard>
  );
};

export const ProfileHeaderSkeleton: React.FC = () => {
  return (
    <GlassCard className="p-6 sm:p-8 border border-white/10 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full skeleton-glass" />
          <div className="space-y-2">
            <div className="w-44 h-6 rounded skeleton-glass" />
            <div className="w-32 h-4 rounded skeleton-glass opacity-70" />
            <div className="flex gap-2">
              <div className="w-20 h-5 rounded-full skeleton-glass opacity-75" />
              <div className="w-16 h-5 rounded-full skeleton-glass opacity-75" />
            </div>
          </div>
        </div>
        <div className="w-28 h-9 rounded-full skeleton-glass" />
      </div>
      <div className="space-y-3">
        <div className="w-full h-4 rounded skeleton-glass" />
        <div className="w-4/5 h-4 rounded skeleton-glass" />
      </div>
    </GlassCard>
  );
};
