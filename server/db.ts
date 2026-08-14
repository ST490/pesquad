import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

export interface DbUser {
  srn: string;
  prn?: string;
  passwordHash: string;
  salt: string;
  name: string;
  department: string;
  branch: string;
  semester: number;
  gender?: 'Male' | 'Female' | 'Other';
  campus: 'RR Campus' | 'EC Campus';
  email?: string;
  phone?: string;
  photo_url?: string;
  hackathon_count: number;
  github_url?: string;
  interests?: string[];
  skills?: string[];
  bio?: string;
  looking_for_team: boolean;
  preferred_roles?: string[];
  created_at: string;
  updated_at?: string;
}

export interface DbComment {
  id: string;
  author_srn: string;
  author_name: string;
  author_photo: string;
  body: string;
  created_at: string;
}

export interface DbPost {
  id: string;
  author_srn: string;
  author_name: string;
  author_photo: string;
  author_dept: string;
  author_semester: number;
  body: string;
  hashtags: string[];
  looking_for_team: boolean;
  likes_count: number;
  liked_by: string[]; // List of SRNs
  comments_count: number;
  comments: DbComment[];
  created_at: string;
}

export interface DbInvite {
  id: string;
  from_srn: string;
  from_name: string;
  from_photo: string;
  from_dept: string;
  to_srn: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  created_at: string;
  contact_info?: {
    email?: string;
    github?: string;
    phone?: string;
  };
}

export interface DbSession {
  token: string;
  srn: string;
  createdAt: string;
  expiresAt: string;
}

export interface DatabaseSchema {
  users: DbUser[];
  posts: DbPost[];
  invites: DbInvite[];
  sessions: DbSession[];
}

const DEFAULT_INITIAL_DB: DatabaseSchema = {
  users: [
    {
      srn: 'PES1UG25CS698',
      prn: 'PES1202504729',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'SUFIYAN TATAGAR',
      department: 'Computer Science and Engineering',
      branch: 'CSE',
      semester: 3,
      gender: 'Male',
      campus: 'RR Campus',
      email: 'sufiyantatagar490@gmail.com',
      phone: '8050895979',
      photo_url: '',
      hackathon_count: 3,
      github_url: '',
      interests: ['Frontend', 'Backend'],
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      bio: 'Full Stack developer eager to build innovative solutions for SIH 2026.',
      looking_for_team: true,
      preferred_roles: ['Full Stack Developer'],
      created_at: '2026-08-14T20:35:30.654Z',
      updated_at: '2026-08-14T20:35:54.679Z',
    },
  ],
  posts: [],
  invites: [],
  sessions: [],
};

// In-memory caching for serverless environments
let memoryDb: DatabaseSchema = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DB));

function getDbFilePath(): string {
  try {
    const localDataDir = path.resolve(process.cwd(), 'data');
    const localDbFile = path.join(localDataDir, 'db.json');
    if (fs.existsSync(localDbFile)) {
      return localDbFile;
    }
  } catch {
    // Ignore cwd resolution errors in restricted environments
  }
  return path.join(os.tmpdir(), 'pesquad_db.json');
}

function ensureDbFile(): DatabaseSchema {
  const dbFile = getDbFilePath();
  const dbDir = path.dirname(dbFile);

  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(DEFAULT_INITIAL_DB, null, 2), 'utf-8');
      memoryDb = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DB));
      return memoryDb;
    }

    const content = fs.readFileSync(dbFile, 'utf-8');
    memoryDb = JSON.parse(content);
    return memoryDb;
  } catch (error) {
    // Fallback to memoryDb if file system is read-only
    return memoryDb;
  }
}

export class Database {
  private static read(): DatabaseSchema {
    return ensureDbFile();
  }

  private static write(data: DatabaseSchema): void {
    memoryDb = data;
    try {
      const dbFile = getDbFilePath();
      const dbDir = path.dirname(dbFile);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      const tempFile = dbFile + '.tmp';
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, dbFile);
    } catch {
      // Memory state persists within the serverless container instance
    }
  }

  // Password Security Helpers
  static hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  static verifyPassword(password: string, hash: string, salt: string): boolean {
    const calculatedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(calculatedHash));
  }

  // Users
  static getUsers(): DbUser[] {
    return this.read().users;
  }

  static getUserBySrn(srn: string): DbUser | undefined {
    return this.read().users.find((u) => u.srn.toUpperCase() === srn.toUpperCase());
  }

  static getUserByEmail(email: string): DbUser | undefined {
    return this.read().users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  }

  static getUserByIdentifier(identifier: string): DbUser | undefined {
    const clean = identifier.trim().toUpperCase();
    const cleanEmail = identifier.trim().toLowerCase();
    return this.read().users.find(
      (u) =>
        u.srn.toUpperCase() === clean ||
        (u.prn && u.prn.toUpperCase() === clean) ||
        (u.email && u.email.toLowerCase() === cleanEmail)
    );
  }

  static createUser(user: DbUser): DbUser {
    const db = this.read();
    const existingIndex = db.users.findIndex((u) => u.srn.toUpperCase() === user.srn.toUpperCase());
    if (existingIndex >= 0) {
      throw new Error(`User with SRN ${user.srn} already exists`);
    }
    db.users.push(user);
    this.write(db);
    return user;
  }

  static updateUser(srn: string, updates: Partial<DbUser>): DbUser {
    const db = this.read();
    const index = db.users.findIndex((u) => u.srn.toUpperCase() === srn.toUpperCase());
    if (index === -1) {
      throw new Error(`User with SRN ${srn} not found`);
    }

    const current = db.users[index];
    const updated: DbUser = {
      ...current,
      ...updates,
      srn: current.srn, // SRN cannot be modified
      updated_at: new Date().toISOString(),
    };

    db.users[index] = updated;
    this.write(db);
    return updated;
  }

  // Sessions
  static createSession(srn: string, durationMs: number = 7 * 24 * 60 * 60 * 1000): DbSession {
    const db = this.read();
    const token = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMs).toISOString();

    const session: DbSession = {
      token,
      srn: srn.toUpperCase(),
      createdAt: now.toISOString(),
      expiresAt,
    };

    // Clean expired sessions
    db.sessions = db.sessions.filter((s) => new Date(s.expiresAt) > now);
    db.sessions.push(session);
    this.write(db);
    return session;
  }

  static getSession(token: string): DbSession | undefined {
    const db = this.read();
    const session = db.sessions.find((s) => s.token === token);
    if (!session) return undefined;

    if (new Date(session.expiresAt) <= new Date()) {
      this.deleteSession(token);
      return undefined;
    }
    return session;
  }

  static deleteSession(token: string): void {
    const db = this.read();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    this.write(db);
  }

  // Posts & Community Feed
  static getPosts(): DbPost[] {
    return this.read().posts.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static getPostById(id: string): DbPost | undefined {
    return this.read().posts.find((p) => p.id === id);
  }

  static createPost(data: {
    author_srn: string;
    author_name: string;
    author_photo: string;
    author_dept: string;
    author_semester: number;
    body: string;
    hashtags: string[];
    looking_for_team: boolean;
  }): DbPost {
    const db = this.read();
    const newPost: DbPost = {
      id: 'post-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
      author_srn: data.author_srn.toUpperCase(),
      author_name: data.author_name,
      author_photo: data.author_photo,
      author_dept: data.author_dept,
      author_semester: data.author_semester,
      body: data.body,
      hashtags: data.hashtags.map((h) => h.toLowerCase()),
      looking_for_team: data.looking_for_team,
      likes_count: 0,
      liked_by: [],
      comments_count: 0,
      comments: [],
      created_at: new Date().toISOString(),
    };

    db.posts.unshift(newPost);
    this.write(db);
    return newPost;
  }

  static toggleLike(postId: string, userSrn: string): DbPost {
    const db = this.read();
    const post = db.posts.find((p) => p.id === postId);
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    const cleanSrn = userSrn.toUpperCase();
    const index = post.liked_by.indexOf(cleanSrn);

    if (index === -1) {
      post.liked_by.push(cleanSrn);
      post.likes_count = post.liked_by.length;
    } else {
      post.liked_by.splice(index, 1);
      post.likes_count = post.liked_by.length;
    }

    this.write(db);
    return post;
  }

  static addComment(
    postId: string,
    commentData: {
      author_srn: string;
      author_name: string;
      author_photo: string;
      body: string;
    }
  ): DbComment {
    const db = this.read();
    const post = db.posts.find((p) => p.id === postId);
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    const newComment: DbComment = {
      id: 'comm-' + Date.now() + '-' + Math.floor(Math.random() * 1000000),
      author_srn: commentData.author_srn.toUpperCase(),
      author_name: commentData.author_name,
      author_photo: commentData.author_photo,
      body: commentData.body,
      created_at: new Date().toISOString(),
    };

    post.comments.push(newComment);
    post.comments_count = post.comments.length;
    this.write(db);
    return newComment;
  }

  // Invites
  static getInvitesForUser(userSrn: string): DbInvite[] {
    const cleanSrn = userSrn.toUpperCase();
    return this.read().invites.filter(
      (inv) => inv.from_srn === cleanSrn || inv.to_srn === cleanSrn
    );
  }

  static createInvite(data: {
    from_srn: string;
    from_name: string;
    from_photo: string;
    from_dept: string;
    to_srn: string;
    message: string;
    contact_info?: { email?: string; github?: string; phone?: string };
  }): DbInvite {
    const db = this.read();
    const fromUpper = data.from_srn.toUpperCase();
    const toUpper = data.to_srn.toUpperCase();

    if (fromUpper === toUpper) {
      throw new Error('You cannot send a squad invitation to yourself.');
    }

    // Check if an active invitation already exists
    const existing = db.invites.find(
      (inv) =>
        inv.from_srn === fromUpper &&
        inv.to_srn === toUpper &&
        (inv.status === 'pending' || inv.status === 'accepted')
    );

    if (existing) {
      throw new Error('An active invitation with this hacker already exists.');
    }

    const newInvite: DbInvite = {
      id: 'inv-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
      from_srn: fromUpper,
      from_name: data.from_name,
      from_photo: data.from_photo,
      from_dept: data.from_dept,
      to_srn: toUpper,
      status: 'pending',
      message: data.message,
      contact_info: data.contact_info,
      created_at: new Date().toISOString(),
    };

    db.invites.push(newInvite);
    this.write(db);
    return newInvite;
  }

  static updateInviteStatus(
    inviteId: string,
    status: 'accepted' | 'declined',
    responderSrn: string
  ): DbInvite {
    const db = this.read();
    const invite = db.invites.find((i) => i.id === inviteId);
    if (!invite) {
      throw new Error(`Invitation ${inviteId} not found.`);
    }

    if (invite.to_srn.toUpperCase() !== responderSrn.toUpperCase()) {
      throw new Error('You are not authorized to respond to this invitation.');
    }

    invite.status = status;
    this.write(db);
    return invite;
  }

  // Statistics
  static getStatsForUser(userSrn: string): {
    connectionsCount: number;
    invitesSent: number;
    invitesReceived: number;
  } {
    const cleanSrn = userSrn.toUpperCase();
    const invites = this.getInvitesForUser(cleanSrn);

    const accepted = invites.filter((i) => i.status === 'accepted');
    const sent = invites.filter((i) => i.from_srn === cleanSrn);
    const received = invites.filter((i) => i.to_srn === cleanSrn);

    return {
      connectionsCount: accepted.length,
      invitesSent: sent.length,
      invitesReceived: received.length,
    };
  }

  static getTrendingHashtags(): { tag: string; count: number }[] {
    const posts = this.getPosts();
    const counts: Record<string, number> = {};

    posts.forEach((post) => {
      post.hashtags?.forEach((tag) => {
        const lower = tag.toLowerCase();
        counts[lower] = (counts[lower] || 0) + 1;
      });
    });

    const list = Object.entries(counts).map(([tag, count]) => ({ tag, count }));
    list.sort((a, b) => b.count - a.count);
    return list.slice(0, 10);
  }
}
