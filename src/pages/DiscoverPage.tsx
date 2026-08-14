import React, { useState, useMemo, useEffect, useRef } from 'react';
import { UserProfile, FilterOptions } from '../types';
import { PersonCard } from '../components/PersonCard';
import { GlassCard } from '../components/GlassCard';
import { PersonCardSkeleton } from '../components/SkeletonLoader';
import { PESU_DEPARTMENTS, AVAILABLE_INTERESTS } from '../constants/pesuData';
import { profileApi, ApiError } from '../services/api';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Users,
  RotateCcw,
  ChevronDown,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface DiscoverPageProps {
  currentUser: UserProfile | null;
  onSelectProfile: (profile: UserProfile) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  currentUser,
  onSelectProfile,
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [minHackathons, setMinHackathons] = useState(0);
  const [sortBy, setSortBy] = useState<'experience' | 'newest' | 'alphabetical'>('experience');
  const [selectedInterest, setSelectedInterest] = useState<string>('All');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Scroll detection state for sliding filter toolbar
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  const loadProfiles = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await profileApi.getProfiles();
      setProfiles(response.profiles);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setFetchError(err.message);
      } else {
        setFetchError(err.message || 'Unable to connect to server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY < 60) {
            setIsToolbarVisible(true);
          } else {
            if (currentScrollY > lastScrollY.current + 4 && currentScrollY > 100) {
              setIsToolbarVisible(false);
            } else if (currentScrollY < lastScrollY.current - 4) {
              setIsToolbarVisible(true);
            }
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter & Sort logic
  const filteredProfiles = useMemo(() => {
    return profiles
      .filter((profile) => {
        // Name / SRN / Skills / Bio search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = profile.name.toLowerCase().includes(q);
          const matchesSrn = profile.srn.toLowerCase().includes(q);
          const matchesDept = profile.department.toLowerCase().includes(q);
          const matchesInterests = profile.interests?.some((i) => i.toLowerCase().includes(q));
          const matchesSkills = profile.skills?.some((s) => s.toLowerCase().includes(q)) || false;
          if (!matchesName && !matchesSrn && !matchesDept && !matchesInterests && !matchesSkills) {
            return false;
          }
        }

        // Department filter
        if (selectedDept !== 'All' && profile.department !== selectedDept) {
          return false;
        }

        // Semester filter
        if (selectedSemester !== 'All' && profile.semester.toString() !== selectedSemester) {
          return false;
        }

        // Min hackathons filter
        if (profile.hackathon_count < minHackathons) {
          return false;
        }

        // Interest filter
        if (selectedInterest !== 'All' && !profile.interests?.includes(selectedInterest)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'experience') {
          return b.hackathon_count - a.hackathon_count;
        }
        if (sortBy === 'alphabetical') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
  }, [profiles, searchQuery, selectedDept, selectedSemester, minHackathons, sortBy, selectedInterest]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All');
    setSelectedSemester('All');
    setMinHackathons(0);
    setSortBy('experience');
    setSelectedInterest('All');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedDept !== 'All' ||
    selectedSemester !== 'All' ||
    minHackathons > 0 ||
    selectedInterest !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6 pb-20">
      {/* Floating reveal tab if toolbar is slid up */}
      {!isToolbarVisible && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-3 duration-200">
          <button
            onClick={() => setIsToolbarVisible(true)}
            className="px-4 py-1.5 rounded-full bg-black/90 border border-[#f78900]/50 text-xs font-semibold text-[#ffeabb] shadow-[0_4px_20px_rgba(247,137,0,0.35)] flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Search className="w-3 h-3 text-[#f78900]" />
            <span>Show Filter Toolbar</span>
            <ChevronDown className="w-3 h-3 text-[#ffb200]" />
          </button>
        </div>
      )}

      {/* Sticky Top Filter Bar (Glass) */}
      <div className="sticky top-[72px] z-30 space-y-3">
        <GlassCard
          id="filter-toolbar"
          className={`p-3.5 sm:p-4 border border-white/15 backdrop-blur-2xl shadow-xl space-y-3 transition-all duration-300 ease-out origin-top ${
            isToolbarVisible
              ? 'translate-y-0 opacity-100 pointer-events-auto scale-100'
              : '-translate-y-28 opacity-0 pointer-events-none scale-95 shadow-none'
          }`}
          style={{ background: 'rgba(12, 12, 16, 0.92)' }}
        >
          {/* Main search and quick dropdowns */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="search-teammates-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, SRN, department, tech stack (e.g. PyTorch, Flutter)..."
                className="w-full glass-input pl-10 pr-4 py-2.5 text-xs sm:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Department Dropdown */}
              <div className="flex-1 sm:flex-initial min-w-[150px]">
                <select
                  id="filter-department-select"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full glass-input px-3 py-2.5 text-xs bg-[#0a0a0d] cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  {PESU_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Dropdown */}
              <div className="flex-1 sm:flex-initial min-w-[110px]">
                <select
                  id="filter-semester-select"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full glass-input px-3 py-2.5 text-xs bg-[#0a0a0d] cursor-pointer"
                >
                  <option value="All">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem.toString()}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex-1 sm:flex-initial min-w-[150px]">
                <select
                  id="filter-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full glass-input px-3 py-2.5 text-xs bg-[#0a0a0d] cursor-pointer font-medium text-[#ffeabb]"
                >
                  <option value="experience">🔥 Most Experienced</option>
                  <option value="newest">✨ Newest Joined</option>
                  <option value="alphabetical">🔤 Alphabetical (A-Z)</option>
                </select>
              </div>

              {/* Toggle Filter drawer */}
              <button
                id="toggle-advanced-filters-btn"
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  showFilterDrawer || minHackathons > 0 || selectedInterest !== 'All'
                    ? 'bg-[#f78900]/20 border-[#f78900] text-[#ffb200]'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {(minHackathons > 0 || selectedInterest !== 'All') && (
                  <span className="w-2 h-2 rounded-full bg-[#f78900]" />
                )}
              </button>

              {/* Refresh Button */}
              <button
                onClick={loadProfiles}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Refresh from server"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Expandable Advanced Filters */}
          {showFilterDrawer && (
            <div className="pt-3 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Min Hackathons Slider */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#f78900] fill-[#f78900]" />
                      Minimum Hackathons Attended:
                    </span>
                    <span className="font-bold text-[#ffb200] font-mono px-2 py-0.5 bg-black/40 rounded">
                      {minHackathons}+ hacks
                    </span>
                  </div>
                  <input
                    id="min-hackathons-slider"
                    type="range"
                    min="0"
                    max="8"
                    step="1"
                    value={minHackathons}
                    onChange={(e) => setMinHackathons(Number(e.target.value))}
                    className="w-full accent-[#f78900] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0 (Any)</span>
                    <span>2+</span>
                    <span>4+</span>
                    <span>6+</span>
                    <span>8+ (Veterans)</span>
                  </div>
                </div>

                {/* Domain Selector */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <span className="text-xs text-slate-300 font-medium block">
                    Filter by Specific Domain / Tech Specialization
                  </span>
                  <select
                    value={selectedInterest}
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    className="w-full glass-input px-3 py-1.5 text-xs bg-[#0a0a0d]"
                  >
                    <option value="All">All Tech Domains</option>
                    {AVAILABLE_INTERESTS.map((interest) => (
                      <option key={interest} value={interest}>
                        {interest}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quick Domain Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap mr-1">
              Popular:
            </span>
            {['All', 'Machine Learning', 'Full Stack', 'IoT & Robotics', 'UI/UX Design', 'Blockchain & Web3', 'Cybersecurity'].map(
              (domain) => {
                const isSelected = selectedInterest === domain;
                return (
                  <button
                    key={domain}
                    onClick={() => setSelectedInterest(domain)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#f78900] to-[#ffb200] text-black font-bold shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    {domain}
                  </button>
                );
              }
            )}
          </div>
        </GlassCard>
      </div>

      {/* Error Alert State */}
      {fetchError && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <button
            onClick={loadProfiles}
            className="btn-secondary px-3 py-1 text-xs text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Results Count & active chips */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="text-white font-semibold">{filteredProfiles.length}</span> students matching criteria
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-[#ffb200] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear all filters</span>
          </button>
        )}
      </div>

      {/* Person Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <PersonCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProfiles.length > 0 ? (
        <div
          id="profiles-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filteredProfiles.map((profile) => (
            <PersonCard
              key={profile.srn}
              profile={profile}
              onClick={() => onSelectProfile(profile)}
              isCurrentUser={currentUser?.srn.toLowerCase() === profile.srn.toLowerCase()}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <GlassCard className="p-12 text-center border border-white/10 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-8 h-8 text-[#ffb200]" />
          </div>
          <h3 className="text-xl font-bold font-heading text-white">
            {profiles.length === 0 ? 'No Registered Hackers Yet' : 'No Hackers Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {profiles.length === 0
              ? 'Be the first PES University student to create a profile and start forming your Smart India Hackathon 2026 squad!'
              : 'No PESU students match your current filter combination. Try clearing your search query or lowering the minimum hackathons threshold.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="btn-primary px-6 py-2.5 text-xs font-semibold"
            >
              Reset Filters
            </button>
          )}
        </GlassCard>
      )}
    </div>
  );
};
