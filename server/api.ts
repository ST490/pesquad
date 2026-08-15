import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Database, DbUser } from './db.js';
import { getAppSession } from './session.js';
import { PesuAuthService } from './pesuAuthService.js';

export const apiRouter = Router();

// Extend Express Request
export interface AuthenticatedRequest extends Request {
  user?: DbUser;
  sessionToken?: string;
}

// Authentication Middleware: Validates iron-session Cookie and/or Bearer Token
export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  let srn: string | undefined;
  let token: string | undefined;

  // 1. Check Bearer Header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    const session = Database.getSession(token);
    if (session) {
      srn = session.srn;
    }
  }

  // 2. Check Iron-Session Cookie
  if (!srn) {
    try {
      const ironSession = await getAppSession(req, res);
      if (ironSession.isLoggedIn && ironSession.srn) {
        srn = ironSession.srn;
        token = ironSession.token;
      }
    } catch {
      // Ignore session read errors
    }
  }

  if (!srn) {
    res.status(401).json({ error: 'Authentication required. Please sign in with your PESU credentials.' });
    return;
  }

  let user = Database.getUserBySrn(srn);

  // Handle serverless cold-start: session is valid but user record is missing
  // in this container's in-memory DB (created in a different instance during login).
  // Auto-create a stub record so the user isn't locked out; they'll fill in
  // their full profile on the onboarding page.
  if (!user) {
    try {
      const ironSession = await getAppSession(req, res);
      const stubUser: DbUser = {
        srn: srn.toUpperCase(),
        passwordHash: '',
        salt: '',
        name: ironSession.name || srn,
        department: 'Computer Science and Engineering',
        branch: 'CSE',
        semester: 4,
        campus: 'RR Campus',
        email: ironSession.email || '',
        photo_url: '',
        hackathon_count: 0,
        github_url: '',
        interests: [],
        skills: [],
        bio: '',
        looking_for_team: true,
        preferred_roles: ['Full Stack Developer'],
        created_at: new Date().toISOString(),
      };
      user = Database.createUser(stubUser);
    } catch {
      res.status(401).json({ error: 'User account not found. Please sign in again.' });
      return;
    }
  }

  req.user = user;
  req.sessionToken = token;
  next();
}

// Optional Auth Middleware
export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  let srn: string | undefined;
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    const session = Database.getSession(token);
    if (session) {
      srn = session.srn;
    }
  }

  if (!srn) {
    try {
      const ironSession = await getAppSession(req, res);
      if (ironSession.isLoggedIn && ironSession.srn) {
        srn = ironSession.srn;
        token = ironSession.token;
      }
    } catch {
      // Ignore
    }
  }

  if (srn) {
    let user = Database.getUserBySrn(srn);
    if (!user) {
      // Same cold-start recovery as authMiddleware
      try {
        const ironSession = await getAppSession(req, res);
        const stubUser: DbUser = {
          srn: srn.toUpperCase(),
          passwordHash: '',
          salt: '',
          name: ironSession.name || srn,
          department: 'Computer Science and Engineering',
          branch: 'CSE',
          semester: 4,
          campus: 'RR Campus',
          email: ironSession.email || '',
          photo_url: '',
          hackathon_count: 0,
          github_url: '',
          interests: [],
          skills: [],
          bio: '',
          looking_for_team: true,
          preferred_roles: ['Full Stack Developer'],
          created_at: new Date().toISOString(),
        };
        user = Database.createUser(stubUser);
      } catch {
        // Ignore — optional auth, proceed unauthenticated
      }
    }
    if (user) {
      req.user = user;
      req.sessionToken = token;
    }
  }

  next();
}

// Strip sensitive password hash/salt from user response
function sanitizeUser(user: DbUser): Omit<DbUser, 'passwordHash' | 'salt'> {
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

// -------------------------------------------------------------
// 1. PESU ACADEMY AUTHENTICATION (pesu-dev/auth)
// -------------------------------------------------------------

// POST /api/auth/login
// Authenticates student credentials against pesu-dev/auth API (POST /authenticate)
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { identifier, srn, username, password } = req.body;
    const lookupUsername = identifier || srn || username;

    if (!lookupUsername || typeof lookupUsername !== 'string' || !lookupUsername.trim()) {
      res.status(400).json({ error: 'PESU ID (SRN / PRN) is required.' });
      return;
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      res.status(400).json({ error: 'Password is required.' });
      return;
    }

    // Authenticate via pesu-dev/auth API
    const authResult = await PesuAuthService.authenticate(lookupUsername, password);
    const authenticatedUser = authResult.user;

    // Create session & save iron-session cookie
    const session = Database.createSession(authenticatedUser.srn);
    const ironSession = await getAppSession(req, res);
    ironSession.srn = authenticatedUser.srn;
    ironSession.token = session.token;
    ironSession.name = authenticatedUser.name;
    ironSession.email = authenticatedUser.email;
    ironSession.isLoggedIn = true;
    await ironSession.save();

    res.json({
      message: 'Signed in successfully via PESU Academy.',
      token: session.token,
      user: sanitizeUser(authenticatedUser),
      isFirstLogin: authResult.isFirstLogin,
      redirect: authResult.isFirstLogin ? '/onboarding' : '/discover',
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Authentication failed. Please check your PESU credentials.' });
  }
});

// POST /api/auth/register
// Registers a student account with verified PESU details
apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const {
      srn,
      prn,
      name,
      password,
      department,
      semester,
      gender,
      campus,
      email,
      phone,
      hackathon_count,
      interests,
      skills,
      bio,
    } = req.body;

    if (!srn || typeof srn !== 'string' || !srn.trim()) {
      res.status(400).json({ error: 'Valid PESU SRN is required (e.g. PES1UG23CS101).' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Full Student Name is required.' });
      return;
    }

    const cleanSrn = srn.trim().toUpperCase();
    const existing = Database.getUserBySrn(cleanSrn);
    if (existing) {
      res.status(409).json({
        error: `An account with SRN ${cleanSrn} already exists. Please sign in with your password.`,
      });
      return;
    }

    const { hash, salt } = Database.hashPassword(password);
    const newUser: DbUser = {
      srn: cleanSrn,
      prn: prn ? prn.trim().toUpperCase() : undefined,
      passwordHash: hash,
      salt: salt,
      name: name.trim(),
      department: department || 'Computer Science & Engineering',
      branch: department ? department.split(' ')[0] : 'CSE',
      semester: semester ? Number(semester) : 4,
      gender: gender === 'Female' ? 'Female' : gender === 'Other' ? 'Other' : 'Male',
      campus: campus === 'EC Campus' ? 'EC Campus' : 'RR Campus',
      email: email ? email.trim().toLowerCase() : `${name.toLowerCase().replace(/\s+/g, '')}.${cleanSrn.slice(-4).toLowerCase()}@pes.edu`,
      phone: phone ? phone.trim() : undefined,
      photo_url: '',
      hackathon_count: hackathon_count ? Math.max(0, Number(hackathon_count)) : 0,
      github_url: '',
      interests: interests && Array.isArray(interests) ? interests : [],
      skills: skills && Array.isArray(skills) ? skills : [],
      bio: bio ? String(bio).trim() : '',
      looking_for_team: true,
      preferred_roles: ['Full Stack Developer'],
      created_at: new Date().toISOString(),
    };

    const created = Database.createUser(newUser);
    const session = Database.createSession(cleanSrn);
    const ironSession = await getAppSession(req, res);
    ironSession.srn = cleanSrn;
    ironSession.token = session.token;
    ironSession.name = created.name;
    ironSession.email = created.email;
    ironSession.isLoggedIn = true;
    await ironSession.save();

    res.status(201).json({
      message: 'PESU Student Account registered successfully.',
      token: session.token,
      user: sanitizeUser(created),
      isFirstLogin: true,
      redirect: '/onboarding',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Registration failed.' });
  }
});

// GET /api/auth/me
apiRouter.get('/auth/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({ user: sanitizeUser(req.user) });
});

// POST /api/auth/logout
apiRouter.post('/auth/logout', async (req: Request, res: Response) => {
  // Clear iron-session cookie
  try {
    const ironSession = await getAppSession(req, res);
    ironSession.destroy();
  } catch {
    // Ignore
  }

  // Clear bearer token session in database
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    Database.deleteSession(token);
  }

  res.json({ message: 'Logged out successfully.' });
});

// -------------------------------------------------------------
// 2. PROFILES & DISCOVERY ENDPOINTS
// -------------------------------------------------------------

// GET /api/profiles
apiRouter.get('/profiles', optionalAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      search,
      department,
      semester,
      gender,
      minHackathons,
      interest,
      sortBy = 'experience',
    } = req.query;

    let users = await Database.getUsersAsync();

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      users = users.filter((u) => {
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesSrn = u.srn.toLowerCase().includes(q);
        const matchesDept = u.department.toLowerCase().includes(q);
        const matchesInterests = u.interests?.some((i) => i.toLowerCase().includes(q));
        const matchesSkills = u.skills?.some((s) => s.toLowerCase().includes(q));
        return matchesName || matchesSrn || matchesDept || matchesInterests || matchesSkills;
      });
    }

    if (department && department !== 'All' && typeof department === 'string') {
      users = users.filter((u) => u.department.toLowerCase() === department.toLowerCase());
    }

    if (semester && semester !== 'All') {
      users = users.filter((u) => u.semester.toString() === String(semester));
    }

    if (gender && gender !== 'All' && typeof gender === 'string') {
      users = users.filter((u) => u.gender?.toLowerCase() === gender.toLowerCase());
    }

    if (minHackathons) {
      const minH = Number(minHackathons);
      if (!isNaN(minH) && minH > 0) {
        users = users.filter((u) => u.hackathon_count >= minH);
      }
    }

    if (interest && interest !== 'All' && typeof interest === 'string') {
      users = users.filter((u) => u.interests?.includes(interest));
    }

    users.sort((a, b) => {
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

    const sanitized = users.map(sanitizeUser);
    res.json({ profiles: sanitized, total: sanitized.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch profiles.' });
  }
});

// GET /api/profiles/:srn
apiRouter.get('/profiles/:srn', async (req: Request, res: Response) => {
  try {
    const srn = req.params.srn.toUpperCase();
    const user = await Database.getUserBySrnAsync(srn);
    if (!user) {
      res.status(404).json({ error: `Hacker profile with SRN ${srn} not found.` });
      return;
    }
    res.json({ profile: sanitizeUser(user) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch profile.' });
  }
});

// PUT /api/profiles/:srn
apiRouter.put('/profiles/:srn', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const targetSrn = req.params.srn.toUpperCase();
    if (!req.user || req.user.srn.toUpperCase() !== targetSrn) {
      res.status(403).json({ error: 'You are only authorized to update your own profile.' });
      return;
    }

    const {
      name,
      department,
      semester,
      hackathon_count,
      github_url,
      photo_url,
      interests,
      skills,
      bio,
      gender,
      campus,
      email,
      phone,
      looking_for_team,
      preferred_roles,
    } = req.body;

    const updates: Partial<DbUser> = {};
    if (name && typeof name === 'string') updates.name = name.trim();
    if (department && typeof department === 'string') {
      updates.department = department.trim();
      updates.branch = department.split(' ')[0] || 'CSE';
    }
    if (semester !== undefined) updates.semester = Number(semester);
    if (gender && (gender === 'Male' || gender === 'Female' || gender === 'Other')) {
      updates.gender = gender;
    }
    if (hackathon_count !== undefined) updates.hackathon_count = Math.max(0, Number(hackathon_count));
    if (github_url !== undefined) updates.github_url = String(github_url).trim();
    if (photo_url !== undefined) updates.photo_url = String(photo_url).trim();
    if (interests && Array.isArray(interests)) updates.interests = interests;
    if (skills && Array.isArray(skills)) updates.skills = skills;
    if (bio !== undefined) updates.bio = String(bio).trim();
    if (campus) updates.campus = campus === 'EC Campus' ? 'EC Campus' : 'RR Campus';
    if (email) updates.email = String(email).trim().toLowerCase();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (looking_for_team !== undefined) updates.looking_for_team = Boolean(looking_for_team);
    if (preferred_roles && Array.isArray(preferred_roles)) updates.preferred_roles = preferred_roles;

    const updated = Database.updateUser(targetSrn, updates);
    res.json({
      message: 'Profile updated successfully.',
      profile: sanitizeUser(updated),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update profile.' });
  }
});

// -------------------------------------------------------------
// 3. COMMUNITY FEED & POSTS ENDPOINTS
// -------------------------------------------------------------

// GET /api/posts
apiRouter.get('/posts', (req: Request, res: Response) => {
  try {
    const { hashtag, author_srn } = req.query;
    let posts = Database.getPosts();

    if (hashtag && typeof hashtag === 'string') {
      const tagLower = hashtag.toLowerCase();
      posts = posts.filter((p) => p.hashtags?.some((h) => h.toLowerCase() === tagLower));
    }

    if (author_srn && typeof author_srn === 'string') {
      const srnUpper = author_srn.toUpperCase();
      posts = posts.filter((p) => p.author_srn.toUpperCase() === srnUpper);
    }

    res.json({ posts, total: posts.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch community posts.' });
  }
});

// POST /api/posts
apiRouter.post('/posts', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { body, looking_for_team } = req.body;

    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      res.status(400).json({ error: 'Post content cannot be empty.' });
      return;
    }

    const hashtagRegex = /#[\w-]+/g;
    const matches = body.match(hashtagRegex);
    const hashtags = matches ? Array.from(new Set(matches.map((m) => m.toLowerCase()))) : [];

    const newPost = Database.createPost({
      author_srn: req.user.srn,
      author_name: req.user.name,
      author_photo: req.user.photo_url || '',
      author_dept: req.user.department,
      author_semester: req.user.semester,
      body: body.trim(),
      hashtags,
      looking_for_team: looking_for_team ?? req.user.looking_for_team ?? true,
    });

    res.status(201).json({
      message: 'Post created successfully.',
      post: newPost,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create post.' });
  }
});

// POST /api/posts/:id/like
apiRouter.post('/posts/:id/like', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const postId = req.params.id;
    const updatedPost = Database.toggleLike(postId, req.user.srn);
    res.json({ post: updatedPost });
  } catch (error: any) {
    res.status(404).json({ error: error.message || 'Post not found.' });
  }
});

// POST /api/posts/:id/comments
apiRouter.post('/posts/:id/comments', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const postId = req.params.id;
    const { body } = req.body;

    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      res.status(400).json({ error: 'Comment body cannot be empty.' });
      return;
    }

    const newComment = Database.addComment(postId, {
      author_srn: req.user.srn,
      author_name: req.user.name,
      author_photo: req.user.photo_url || '',
      body: body.trim(),
    });

    const updatedPost = Database.getPostById(postId);
    res.status(201).json({
      message: 'Comment added successfully.',
      comment: newComment,
      post: updatedPost,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add comment.' });
  }
});

// -------------------------------------------------------------
// 4. TEAM INVITES & CONNECTIONS
// -------------------------------------------------------------

// GET /api/invites
apiRouter.get('/invites', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const invites = Database.getInvitesForUser(req.user.srn);
    res.json({ invites });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch invites.' });
  }
});

// POST /api/invites
apiRouter.post('/invites', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { to_srn, message } = req.body;

    if (!to_srn || typeof to_srn !== 'string') {
      res.status(400).json({ error: 'Recipient SRN is required.' });
      return;
    }

    const recipient = Database.getUserBySrn(to_srn.toUpperCase());
    if (!recipient) {
      res.status(404).json({ error: `Recipient with SRN ${to_srn} not found.` });
      return;
    }

    const newInvite = Database.createInvite({
      from_srn: req.user.srn,
      from_name: req.user.name,
      from_photo: req.user.photo_url || '',
      from_dept: req.user.department,
      to_srn: recipient.srn,
      message: message ? String(message).trim() : `Hey ${recipient.name}! Let's team up for SIH 2026!`,
      contact_info: {
        email: req.user.email,
        github: req.user.github_url,
        phone: req.user.phone,
      },
    });

    res.status(201).json({
      message: 'Invitation sent successfully.',
      invite: newInvite,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to send invitation.' });
  }
});

// PUT /api/invites/:id/respond
apiRouter.put('/invites/:id/respond', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const inviteId = req.params.id;
    const { status } = req.body;

    if (status !== 'accepted' && status !== 'declined') {
      res.status(400).json({ error: 'Status must be either "accepted" or "declined".' });
      return;
    }

    const updated = Database.updateInviteStatus(inviteId, status, req.user.srn);
    res.json({
      message: `Invitation ${status} successfully.`,
      invite: updated,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update invitation status.' });
  }
});

// -------------------------------------------------------------
// 5. STATS, HASHTAGS & CONFIG
// -------------------------------------------------------------

// GET /api/hashtags/trending
apiRouter.get('/hashtags/trending', (_req: Request, res: Response) => {
  try {
    const trending = Database.getTrendingHashtags();
    res.json({ hashtags: trending });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch trending hashtags.' });
  }
});

// GET /api/stats/user/:srn
apiRouter.get('/stats/user/:srn', (req: Request, res: Response) => {
  try {
    const srn = req.params.srn.toUpperCase();
    const user = Database.getUserBySrn(srn);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const stats = Database.getStatsForUser(srn);
    res.json({
      srn,
      connections: stats.connectionsCount,
      hackathons: user.hackathon_count,
      invitesSent: stats.invitesSent,
      invitesReceived: stats.invitesReceived,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to calculate user stats.' });
  }
});

// GET /api/config
apiRouter.get('/config', (_req: Request, res: Response) => {
  res.json({
    sihDeadline: process.env.SIH_REGISTRATION_DEADLINE || '2026-09-30T23:59:59.000Z',
    appName: 'PESquad',
    institution: 'PES University',
    authProvider: 'pesu-dev/auth',
    version: '1.0.0',
  });
});
