import React, { useState, useMemo, useEffect } from 'react';
import { Post, UserProfile } from '../types';
import { postApi, statsApi, configApi, profileApi, ApiError } from '../services/api';
import { PostSkeleton } from '../components/SkeletonLoader';
import { getProfileAvatar } from '../utils/avatar';
import {
  Flame,
  MessageSquare,
  Heart,
  Send,
  Sparkles,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface ChatPageProps {
  currentUser: UserProfile | null;
  onSelectProfile: (profile: UserProfile) => void;
  initialSelectedTag?: string;
  initialMentionText?: string;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  currentUser,
  onSelectProfile,
  initialSelectedTag,
  initialMentionText,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedProfiles, setSuggestedProfiles] = useState<UserProfile[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<{ tag: string; count: number }[]>([]);
  const [userStats, setUserStats] = useState<{ connections: number; hackathons: number }>({
    connections: 0,
    hackathons: currentUser?.hackathon_count || 0,
  });

  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(initialSelectedTag || null);
  const [postBody, setPostBody] = useState(initialMentionText || '');
  const [isLookingForTeam, setIsLookingForTeam] = useState(true);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  // Configurable SIH registration deadline
  const [sihDeadline, setSihDeadline] = useState<string>('2026-09-30T23:59:59.000Z');
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Load server config and deadline
  useEffect(() => {
    async function loadConfig() {
      try {
        const config = await configApi.getConfig();
        if (config.sihDeadline) {
          setSihDeadline(config.sihDeadline);
        }
      } catch {
        // Fallback to default deadline
      }
    }
    loadConfig();
  }, []);

  // Countdown timer based on real deadline
  useEffect(() => {
    const targetDate = new Date(sihDeadline);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [sihDeadline]);

  // Fetch posts, stats, and trending hashtags
  const loadFeedData = async () => {
    setIsFeedLoading(true);
    setFeedError(null);

    try {
      const [postsRes, tagsRes, profilesRes] = await Promise.all([
        postApi.getPosts({ hashtag: selectedHashtag || undefined }),
        statsApi.getTrendingHashtags(),
        profileApi.getProfiles(),
      ]);

      setPosts(postsRes.posts);
      setTrendingHashtags(tagsRes.hashtags);

      if (currentUser) {
        setSuggestedProfiles(
          profilesRes.profiles
            .filter((p) => p.srn.toLowerCase() !== currentUser.srn.toLowerCase())
            .slice(0, 4)
        );

        // Fetch real stats
        try {
          const stats = await statsApi.getUserStats(currentUser.srn);
          setUserStats({
            connections: stats.connections,
            hackathons: stats.hackathons,
          });
        } catch {
          // Fallback stats
          setUserStats({
            connections: 0,
            hackathons: currentUser.hackathon_count || 0,
          });
        }
      } else {
        setSuggestedProfiles(profilesRes.profiles.slice(0, 4));
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        setFeedError(err.message);
      } else {
        setFeedError(err.message || 'Failed to load community feed.');
      }
    } finally {
      setIsFeedLoading(false);
    }
  };

  useEffect(() => {
    loadFeedData();
  }, [selectedHashtag]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postBody.trim() || !currentUser) return;

    setIsPosting(true);
    try {
      const { post: newPost } = await postApi.createPost({
        body: postBody.trim(),
        looking_for_team: isLookingForTeam,
      });

      setPosts([newPost, ...posts]);
      setPostBody('');

      // Refresh trending hashtags
      const tagsRes = await statsApi.getTrendingHashtags();
      setTrendingHashtags(tagsRes.hashtags);
    } catch (err: any) {
      alert(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!currentUser) return;
    try {
      const { post: updated } = await postApi.toggleLike(postId);
      setPosts(posts.map((p) => (p.id === postId ? updated : p)));
    } catch (err: any) {
      console.error('Failed to toggle like', err);
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText || !currentUser) return;

    try {
      const { post: updatedPost } = await postApi.addComment(postId, commentText);
      setPosts(posts.map((p) => (p.id === postId ? updatedPost : p)));
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (err: any) {
      alert(err.message || 'Failed to add comment.');
    }
  };

  const insertHashtag = (tag: string) => {
    setPostBody((prev) => (prev ? `${prev} ${tag} ` : `${tag} `));
  };

  const renderFormattedBody = (body: string) => {
    const words = body.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.startsWith('#')) {
        return (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedHashtag(word);
            }}
            className="text-[#f78900] font-semibold cursor-pointer hover:underline"
          >
            {word}
          </span>
        );
      }
      return word;
    });
  };

  const currentUserAvatar = currentUser
    ? getProfileAvatar(currentUser.photo_url, currentUser.name, currentUser.srn)
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-20">
      {/* Mobile Hashtag Horizontal Scroller */}
      <div className="lg:hidden mb-4 overflow-x-auto pb-2 flex items-center gap-1.5 scrollbar-hide">
        <button
          onClick={() => setSelectedHashtag(null)}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedHashtag === null
              ? 'btn-primary'
              : 'bg-white/5 text-slate-300 border border-white/10'
          }`}
        >
          All Topics
        </button>
        {trendingHashtags.map(({ tag }) => (
          <button
            key={tag}
            onClick={() => setSelectedHashtag(tag === selectedHashtag ? null : tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedHashtag === tag
                ? 'bg-[#f78900] text-black font-bold'
                : 'bg-white/5 text-slate-300 border border-white/10'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 3-Column Frosted Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Trending Hashtags & Real Stats */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 sticky top-[80px]">
          <div className="glass p-5">
            <h3 className="text-xs uppercase tracking-widest text-[#ffeabb] opacity-60 font-bold mb-4 flex items-center justify-between">
              <span>Live Trending Tags</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#f78900]" />
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSelectedHashtag(null)}
                className={`text-sm flex justify-between items-center transition-colors text-left ${
                  selectedHashtag === null
                    ? 'text-[#f78900] font-bold'
                    : 'text-slate-300 hover:text-[#f78900]'
                }`}
              >
                <span>#AllPosts</span>
                <span className="opacity-40 text-xs font-mono">{posts.length}</span>
              </button>

              {trendingHashtags.length > 0 ? (
                trendingHashtags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedHashtag(selectedHashtag === tag ? null : tag)}
                    className={`text-sm flex justify-between items-center transition-colors text-left ${
                      selectedHashtag === tag
                        ? 'text-[#f78900] font-bold'
                        : 'text-slate-300 hover:text-[#f78900]'
                    }`}
                  >
                    <span className="font-mono">{tag}</span>
                    <span className="opacity-40 text-xs font-mono">{count}</span>
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No hashtags used yet</p>
              )}
            </div>
          </div>

          {currentUser && (
            <div className="glass p-5">
              <h3 className="text-xs uppercase tracking-widest text-[#ffeabb] opacity-60 font-bold mb-4">
                Your Squad Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80 text-slate-300">Connected Peers</span>
                  <span className="text-lg font-bold text-[#ffb200]">
                    {userStats.connections}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80 text-slate-300">Hackathons Logged</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-[#f78900]">
                      {userStats.hackathons}
                    </span>
                    <span className="text-orange-500">🔥</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center Column: Post Composer + Feed */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Post Composer Card */}
          {currentUser && (
            <div className="glass p-4">
              <form onSubmit={handleCreatePost}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border border-[#f78900] overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={currentUserAvatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      id="post-composer-textarea"
                      rows={2}
                      value={postBody}
                      onChange={(e) => setPostBody(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-gray-400 resize-none outline-none text-white leading-relaxed"
                      placeholder="Looking for teammates? Share your problem statement or pitch your tech stack..."
                      disabled={isPosting}
                    />
                    <div className="flex flex-wrap justify-between items-center mt-2 pt-2 border-t border-white/10 gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['#SIH2026', '#LookingForTeam', '#WebDev', '#ML', '#IoT'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => insertHashtag(tag)}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] text-[#ffb200] font-mono transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <button
                        id="submit-post-btn"
                        type="submit"
                        disabled={!postBody.trim() || isPosting}
                        className="btn-primary px-5 py-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPosting ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Active Filter Pill */}
          {selectedHashtag && (
            <div className="glass px-4 py-2.5 flex items-center justify-between text-xs border border-[#f78900]/30">
              <span className="text-slate-200">
                Filtered by: <strong className="text-[#ffb200] font-mono">{selectedHashtag}</strong>
              </span>
              <button
                onClick={() => setSelectedHashtag(null)}
                className="text-[#ffeabb] hover:text-white font-semibold underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Feed Header and Refresh */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Live Squad Feed ({posts.length})</span>
            <button
              onClick={loadFeedData}
              className="flex items-center gap-1.5 text-xs text-[#ffeabb] hover:text-white transition-colors"
              title="Refresh from server"
            >
              <RefreshCw className={`w-3 h-3 text-[#f78900] ${isFeedLoading ? 'animate-spin' : ''}`} />
              <span>{isFeedLoading ? 'Updating...' : 'Refresh Feed'}</span>
            </button>
          </div>

          {feedError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{feedError}</span>
              </div>
              <button onClick={loadFeedData} className="btn-secondary px-3 py-1 text-xs text-white">
                Retry
              </button>
            </div>
          )}

          {/* Posts Feed */}
          <div className="space-y-4">
            {isFeedLoading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : posts.length > 0 ? (
              posts.map((post) => {
                const isLiked = currentUser
                  ? post.liked_by.includes(currentUser.srn.toUpperCase())
                  : false;
                const isAuthor =
                  currentUser?.srn.toLowerCase() === post.author_srn.toLowerCase();
                const authorAvatar = getProfileAvatar(
                  post.author_photo,
                  post.author_name,
                  post.author_srn
                );

                return (
                  <div
                    key={post.id}
                    id={`post-card-${post.id}`}
                    className="glass glass-interactive p-5 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div
                          onClick={async () => {
                            try {
                              const { profile } = await profileApi.getProfile(post.author_srn);
                              onSelectProfile(profile);
                            } catch {
                              // Ignore error
                            }
                          }}
                          className="w-10 h-10 rounded-full border border-[#f78900] overflow-hidden bg-slate-800 shrink-0 cursor-pointer"
                        >
                          <img
                            src={authorAvatar}
                            alt={post.author_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span
                              onClick={async () => {
                                try {
                                  const { profile } = await profileApi.getProfile(post.author_srn);
                                  onSelectProfile(profile);
                                } catch {
                                  // Ignore
                                }
                              }}
                              className="cursor-pointer hover:text-[#ffb200]"
                            >
                              {post.author_name}
                            </span>
                            <span className="font-normal opacity-50 text-xs font-mono">
                              @{post.author_srn}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#ffeabb] opacity-70">
                            {post.author_dept} • {post.author_semester}th Sem
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {post.looking_for_team && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#f78900]/20 text-[#ffeabb] border border-[#f78900]/30">
                            LOOKING FOR SQUAD
                          </span>
                        )}
                        <span className="text-[10px] opacity-40 font-mono">
                          {new Date(post.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-line">
                      {renderFormattedBody(post.body)}
                    </p>

                    <div className="flex gap-4 items-center border-t border-white/5 pt-3">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`text-xs flex items-center gap-1 transition-opacity ${
                          isLiked
                            ? 'text-rose-400 font-bold opacity-100'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                        <span>Like ({post.likes_count})</span>
                      </button>
                      <button
                        onClick={() =>
                          setActiveCommentPostId(
                            activeCommentPostId === post.id ? null : post.id
                          )
                        }
                        className="text-xs opacity-60 hover:opacity-100 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#ffb200]" />
                        <span>Comment ({post.comments_count || post.comments?.length || 0})</span>
                      </button>
                      {!isAuthor && (
                        <button
                          onClick={async () => {
                            try {
                              const { profile } = await profileApi.getProfile(post.author_srn);
                              onSelectProfile(profile);
                            } catch {
                              // Ignore
                            }
                          }}
                          className="text-xs text-[#f78900] font-bold hover:underline ml-auto"
                        >
                          Connect
                        </button>
                      )}
                    </div>

                    {/* Comment expansion drawer */}
                    {activeCommentPostId === post.id && (
                      <div className="pt-3 border-t border-white/10 space-y-2.5">
                        {post.comments && post.comments.length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {post.comments.map((comment) => {
                              const commentAvatar = getProfileAvatar(
                                comment.author_photo,
                                comment.author_name,
                                comment.author_srn
                              );
                              return (
                                <div
                                  key={comment.id}
                                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs flex gap-2.5"
                                >
                                  <img
                                    src={commentAvatar}
                                    alt={comment.author_name}
                                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-[#f78900]"
                                  />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-white">
                                        {comment.author_name}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {comment.author_srn}
                                      </span>
                                    </div>
                                    <p className="text-slate-300 mt-1">{comment.body}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {currentUser && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ''}
                              onChange={(e) =>
                                setCommentInputs({
                                  ...commentInputs,
                                  [post.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment(post.id);
                              }}
                              placeholder="Pitch your skill or reply..."
                              className="flex-1 glass-input px-3 py-1.5 text-xs"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="btn-primary px-3 py-1.5 text-xs font-bold"
                            >
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="glass p-8 text-center border border-white/10 space-y-3">
                <MessageSquare className="w-8 h-8 text-[#ffb200] mx-auto opacity-70" />
                <div className="text-sm font-semibold text-white">No community posts yet</div>
                <p className="text-xs text-slate-400">
                  Be the first hacker to pitch your SIH problem statement or call for teammates!
                </p>
                {selectedHashtag && (
                  <button
                    onClick={() => setSelectedHashtag(null)}
                    className="btn-secondary px-4 py-1 text-xs"
                  >
                    Clear Hashtag Filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Real Countdown + Suggested Squads */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 sticky top-[80px]">
          <div
            className="glass p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(155, 1, 3, 0.2), rgba(247, 137, 0, 0.1))',
            }}
          >
            <div className="text-[10px] uppercase tracking-widest font-bold text-[#ffb200] mb-2 flex items-center justify-between">
              <span>SIH 2026 Registration Deadline</span>
              <Clock className="w-3.5 h-3.5 text-[#f78900]" />
            </div>
            <div className="flex justify-between items-center text-center">
              <div>
                <div className="text-2xl font-bold font-mono text-white">{timeLeft.days}</div>
                <div className="text-[10px] opacity-60">Days</div>
              </div>
              <div className="text-xl opacity-30">:</div>
              <div>
                <div className="text-2xl font-bold font-mono text-white">{timeLeft.hours}</div>
                <div className="text-[10px] opacity-60">Hours</div>
              </div>
              <div className="text-xl opacity-30">:</div>
              <div>
                <div className="text-2xl font-bold font-mono text-white">{timeLeft.minutes}</div>
                <div className="text-[10px] opacity-60">Mins</div>
              </div>
            </div>
          </div>

          <div className="glass p-5 flex-1 flex flex-col">
            <h3 className="text-xs uppercase tracking-widest text-[#ffeabb] opacity-60 font-bold mb-4">
              Registered Squad Candidates
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
              {suggestedProfiles.length > 0 ? (
                suggestedProfiles.map((p) => {
                  const avatar = getProfileAvatar(p.photo_url, p.name, p.srn);
                  return (
                    <div
                      key={p.srn}
                      onClick={() => onSelectProfile(p)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <img
                        src={avatar}
                        alt={p.name}
                        className="w-10 h-10 rounded-full border border-[#f78900] object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-white truncate">{p.name}</div>
                        <div className="text-[10px] opacity-60 truncate">
                          {p.interests?.[0] || p.department.split(' ')[0]} • {p.semester}th Sem
                        </div>
                      </div>
                      <div className="ml-auto text-[#f78900] text-xs font-bold shrink-0">
                        🔥{p.hackathon_count}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 italic">No candidates registered yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
