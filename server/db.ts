import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface DbUser {
  srn: string;
  prn?: string;
  passwordHash: string;
  salt: string;
  name: string;
  department: string;
  branch?: string;
  semester: number;
  hackathon_count: number;
  github_url: string;
  photo_url: string;
  interests: string[];
  bio?: string;
  skills?: string[];
  campus?: 'RR Campus' | 'EC Campus';
  email?: string;
  phone?: string;
  looking_for_team?: boolean;
  preferred_roles?: string[];
  created_at: string;
  updated_at?: string;
}

export interface DbPostComment {
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
  created_at: string;
  likes_count: number;
  liked_by: string[];
  looking_for_team: boolean;
  comments_count: number;
  comments: DbPostComment[];
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

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      users: [],
      posts: [],
      invites: [],
      sessions: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading db.json, creating fallback backup', error);
    const fallbackDb: DatabaseSchema = {
      users: [],
      posts: [],
      invites: [],
      sessions: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallbackDb, null, 2), 'utf-8');
    return fallbackDb;
  }
}

export class Database {
  private static read(): DatabaseSchema {
    return ensureDbFile();
  }

  private static write(data: DatabaseSchema): void {
    ensureDbFile();
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
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

    // Remove expired sessions
    db.sessions = db.sessions.filter((s) => new Date(s.expiresAt).getTime() > now.getTime());
    db.sessions.push(session);
    this.write(db);
    return session;
  }

  static getSession(token: string): DbSession | undefined {
    const db = this.read();
    const session = db.sessions.find((s) => s.token === token);
    if (!session) return undefined;

    if (new Date(session.expiresAt).getTime() < Date.now()) {
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

  // Posts
  static getPosts(): DbPost[] {
    return this.read().posts.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static getPostById(id: string): DbPost | undefined {
    return this.read().posts.find((p) => p.id === id);
  }

  static createPost(post: Omit<DbPost, 'id' | 'created_at' | 'likes_count' | 'liked_by' | 'comments_count' | 'comments'>): DbPost {
    const db = this.read();
    const newPost: DbPost = {
      ...post,
      id: 'post-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
      created_at: new Date().toISOString(),
      likes_count: 0,
      liked_by: [],
      comments_count: 0,
      comments: [],
    };
    db.posts.unshift(newPost);
    this.write(db);
    return newPost;
  }

  static toggleLike(postId: string, userSrn: string): DbPost {
    const db = this.read();
    const post = db.posts.find((p) => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    const upperSrn = userSrn.toUpperCase();
    const likedIndex = post.liked_by.indexOf(upperSrn);
    if (likedIndex >= 0) {
      post.liked_by.splice(likedIndex, 1);
      post.likes_count = Math.max(0, post.likes_count - 1);
    } else {
      post.liked_by.push(upperSrn);
      post.likes_count += 1;
    }

    this.write(db);
    return post;
  }

  static addComment(postId: string, comment: Omit<DbPostComment, 'id' | 'created_at'>): DbPostComment {
    const db = this.read();
    const post = db.posts.find((p) => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    const newComment: DbPostComment = {
      ...comment,
      id: 'comm-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
      created_at: new Date().toISOString(),
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    post.comments_count = post.comments.length;

    this.write(db);
    return newComment;
  }

  // Invites
  static getInvitesForUser(srn: string): DbInvite[] {
    const upperSrn = srn.toUpperCase();
    return this.read().invites.filter(
      (inv) => inv.from_srn.toUpperCase() === upperSrn || inv.to_srn.toUpperCase() === upperSrn
    );
  }

  static createInvite(invite: Omit<DbInvite, 'id' | 'status' | 'created_at'>): DbInvite {
    const db = this.read();
    const fromUpper = invite.from_srn.toUpperCase();
    const toUpper = invite.to_srn.toUpperCase();

    if (fromUpper === toUpper) {
      throw new Error('Cannot send a squad invite to yourself');
    }

    const existing = db.invites.find(
      (inv) =>
        inv.status === 'pending' &&
        ((inv.from_srn.toUpperCase() === fromUpper && inv.to_srn.toUpperCase() === toUpper) ||
          (inv.from_srn.toUpperCase() === toUpper && inv.to_srn.toUpperCase() === fromUpper))
    );

    if (existing) {
      throw new Error('A pending squad invitation already exists between you and this hacker');
    }

    const newInvite: DbInvite = {
      ...invite,
      from_srn: fromUpper,
      to_srn: toUpper,
      id: 'inv-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    db.invites.push(newInvite);
    this.write(db);
    return newInvite;
  }

  static updateInviteStatus(inviteId: string, status: 'accepted' | 'declined', recipientSrn: string): DbInvite {
    const db = this.read();
    const invite = db.invites.find((inv) => inv.id === inviteId);
    if (!invite) {
      throw new Error(`Invitation ${inviteId} not found`);
    }

    if (invite.to_srn.toUpperCase() !== recipientSrn.toUpperCase()) {
      throw new Error('You are not authorized to respond to this invitation');
    }

    invite.status = status;
    this.write(db);
    return invite;
  }

  static getStatsForUser(srn: string): { connectionsCount: number; invitesSent: number; invitesReceived: number } {
    const upperSrn = srn.toUpperCase();
    const invites = this.read().invites;

    const accepted = invites.filter(
      (inv) =>
        inv.status === 'accepted' &&
        (inv.from_srn.toUpperCase() === upperSrn || inv.to_srn.toUpperCase() === upperSrn)
    );

    const sent = invites.filter((inv) => inv.from_srn.toUpperCase() === upperSrn);
    const received = invites.filter((inv) => inv.to_srn.toUpperCase() === upperSrn);

    return {
      connectionsCount: accepted.length,
      invitesSent: sent.length,
      invitesReceived: received.length,
    };
  }

  // Dynamic trending hashtags
  static getTrendingHashtags(): { tag: string; count: number }[] {
    const posts = this.getPosts();
    const tagMap = new Map<string, number>();

    for (const post of posts) {
      if (post.hashtags && Array.isArray(post.hashtags)) {
        for (const tag of post.hashtags) {
          const normalized = tag.toLowerCase();
          tagMap.set(normalized, (tagMap.get(normalized) || 0) + 1);
        }
      }
    }

    const result: { tag: string; count: number }[] = [];
    for (const [tag, count] of tagMap.entries()) {
      result.push({ tag, count });
    }

    return result.sort((a, b) => b.count - a.count);
  }
}
