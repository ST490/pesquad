// api/index.ts
import express from "express";
import cookieParser from "cookie-parser";

// server/api.ts
import { Router } from "express";

// server/db.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
import os from "os";
var DEFAULT_INITIAL_DB = {
  users: [
    {
      srn: "PES1UG25CS698",
      prn: "PES1202504729",
      passwordHash: "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
      salt: "6ba6e622de36c13856a706ed64d09842",
      name: "SUFIYAN TATAGAR",
      department: "Computer Science and Engineering",
      branch: "CSE",
      semester: 3,
      campus: "RR Campus",
      email: "sufiyantatagar490@gmail.com",
      phone: "8050895979",
      photo_url: "",
      hackathon_count: 3,
      github_url: "",
      interests: ["Frontend", "Backend"],
      skills: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
      bio: "Full Stack developer eager to build innovative solutions for SIH 2026.",
      looking_for_team: true,
      preferred_roles: ["Full Stack Developer"],
      created_at: "2026-08-14T20:35:30.654Z",
      updated_at: "2026-08-14T20:35:54.679Z"
    }
  ],
  posts: [],
  invites: [],
  sessions: []
};
var memoryDb = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DB));
function getDbFilePath() {
  try {
    const localDataDir = path.resolve(process.cwd(), "data");
    const localDbFile = path.join(localDataDir, "db.json");
    if (fs.existsSync(localDbFile)) {
      return localDbFile;
    }
  } catch {
  }
  return path.join(os.tmpdir(), "pesquad_db.json");
}
function ensureDbFile() {
  const dbFile = getDbFilePath();
  const dbDir = path.dirname(dbFile);
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(DEFAULT_INITIAL_DB, null, 2), "utf-8");
      memoryDb = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DB));
      return memoryDb;
    }
    const content = fs.readFileSync(dbFile, "utf-8");
    memoryDb = JSON.parse(content);
    return memoryDb;
  } catch (error) {
    return memoryDb;
  }
}
var Database = class {
  static read() {
    return ensureDbFile();
  }
  static write(data) {
    memoryDb = data;
    try {
      const dbFile = getDbFilePath();
      const dbDir = path.dirname(dbFile);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      const tempFile = dbFile + ".tmp";
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
      fs.renameSync(tempFile, dbFile);
    } catch {
    }
  }
  // Password Security Helpers
  static hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1e4, 64, "sha512").toString("hex");
    return { hash, salt };
  }
  static verifyPassword(password, hash, salt) {
    const calculatedHash = crypto.pbkdf2Sync(password, salt, 1e4, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(calculatedHash));
  }
  // Users
  static getUsers() {
    return this.read().users;
  }
  static getUserBySrn(srn) {
    return this.read().users.find((u) => u.srn.toUpperCase() === srn.toUpperCase());
  }
  static getUserByEmail(email) {
    return this.read().users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  }
  static getUserByIdentifier(identifier) {
    const clean = identifier.trim().toUpperCase();
    const cleanEmail = identifier.trim().toLowerCase();
    return this.read().users.find(
      (u) => u.srn.toUpperCase() === clean || u.prn && u.prn.toUpperCase() === clean || u.email && u.email.toLowerCase() === cleanEmail
    );
  }
  static createUser(user) {
    const db = this.read();
    const existingIndex = db.users.findIndex((u) => u.srn.toUpperCase() === user.srn.toUpperCase());
    if (existingIndex >= 0) {
      throw new Error(`User with SRN ${user.srn} already exists`);
    }
    db.users.push(user);
    this.write(db);
    return user;
  }
  static updateUser(srn, updates) {
    const db = this.read();
    const index = db.users.findIndex((u) => u.srn.toUpperCase() === srn.toUpperCase());
    if (index === -1) {
      throw new Error(`User with SRN ${srn} not found`);
    }
    const current = db.users[index];
    const updated = {
      ...current,
      ...updates,
      srn: current.srn,
      // SRN cannot be modified
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.users[index] = updated;
    this.write(db);
    return updated;
  }
  // Sessions
  static createSession(srn, durationMs = 7 * 24 * 60 * 60 * 1e3) {
    const db = this.read();
    const token = crypto.randomBytes(32).toString("hex");
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + durationMs).toISOString();
    const session = {
      token,
      srn: srn.toUpperCase(),
      createdAt: now.toISOString(),
      expiresAt
    };
    db.sessions = db.sessions.filter((s) => new Date(s.expiresAt) > now);
    db.sessions.push(session);
    this.write(db);
    return session;
  }
  static getSession(token) {
    const db = this.read();
    const session = db.sessions.find((s) => s.token === token);
    if (!session) return void 0;
    if (new Date(session.expiresAt) <= /* @__PURE__ */ new Date()) {
      this.deleteSession(token);
      return void 0;
    }
    return session;
  }
  static deleteSession(token) {
    const db = this.read();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    this.write(db);
  }
  // Posts & Community Feed
  static getPosts() {
    return this.read().posts.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  static getPostById(id) {
    return this.read().posts.find((p) => p.id === id);
  }
  static createPost(data) {
    const db = this.read();
    const newPost = {
      id: "post-" + Date.now() + "-" + crypto.randomBytes(4).toString("hex"),
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
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.posts.unshift(newPost);
    this.write(db);
    return newPost;
  }
  static toggleLike(postId, userSrn) {
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
  static addComment(postId, commentData) {
    const db = this.read();
    const post = db.posts.find((p) => p.id === postId);
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }
    const newComment = {
      id: "comm-" + Date.now() + "-" + Math.floor(Math.random() * 1e6),
      author_srn: commentData.author_srn.toUpperCase(),
      author_name: commentData.author_name,
      author_photo: commentData.author_photo,
      body: commentData.body,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    post.comments.push(newComment);
    post.comments_count = post.comments.length;
    this.write(db);
    return newComment;
  }
  // Invites
  static getInvitesForUser(userSrn) {
    const cleanSrn = userSrn.toUpperCase();
    return this.read().invites.filter(
      (inv) => inv.from_srn === cleanSrn || inv.to_srn === cleanSrn
    );
  }
  static createInvite(data) {
    const db = this.read();
    const fromUpper = data.from_srn.toUpperCase();
    const toUpper = data.to_srn.toUpperCase();
    if (fromUpper === toUpper) {
      throw new Error("You cannot send a squad invitation to yourself.");
    }
    const existing = db.invites.find(
      (inv) => inv.from_srn === fromUpper && inv.to_srn === toUpper && (inv.status === "pending" || inv.status === "accepted")
    );
    if (existing) {
      throw new Error("An active invitation with this hacker already exists.");
    }
    const newInvite = {
      id: "inv-" + Date.now() + "-" + crypto.randomBytes(4).toString("hex"),
      from_srn: fromUpper,
      from_name: data.from_name,
      from_photo: data.from_photo,
      from_dept: data.from_dept,
      to_srn: toUpper,
      status: "pending",
      message: data.message,
      contact_info: data.contact_info,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.invites.push(newInvite);
    this.write(db);
    return newInvite;
  }
  static updateInviteStatus(inviteId, status, responderSrn) {
    const db = this.read();
    const invite = db.invites.find((i) => i.id === inviteId);
    if (!invite) {
      throw new Error(`Invitation ${inviteId} not found.`);
    }
    if (invite.to_srn.toUpperCase() !== responderSrn.toUpperCase()) {
      throw new Error("You are not authorized to respond to this invitation.");
    }
    invite.status = status;
    this.write(db);
    return invite;
  }
  // Statistics
  static getStatsForUser(userSrn) {
    const cleanSrn = userSrn.toUpperCase();
    const invites = this.getInvitesForUser(cleanSrn);
    const accepted = invites.filter((i) => i.status === "accepted");
    const sent = invites.filter((i) => i.from_srn === cleanSrn);
    const received = invites.filter((i) => i.to_srn === cleanSrn);
    return {
      connectionsCount: accepted.length,
      invitesSent: sent.length,
      invitesReceived: received.length
    };
  }
  static getTrendingHashtags() {
    const posts = this.getPosts();
    const counts = {};
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
};

// server/session.ts
import { getIronSession } from "iron-session";
var sessionOptions = {
  password: process.env.SESSION_PASSWORD || "pesquad_super_secure_iron_session_password_32_characters_long_min_2026",
  cookieName: "pesquad_session_cookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60
    // 7 days
  }
};
async function getAppSession(req, res) {
  return getIronSession(req, res, sessionOptions);
}

// server/pesuAuthService.ts
var PesuAuthService = class {
  static getBaseUrl() {
    return process.env.PESU_AUTH_URL || "https://pesu-auth.onrender.com";
  }
  /**
   * Authenticates PESU Academy student credentials using pesu-dev/auth API
   * POST /authenticate { username, password, profile: true }
   */
  static async authenticate(username, password) {
    const cleanUsername = username.trim();
    const pesuAuthUrl = this.getBaseUrl().replace(/\/+$/, "");
    let remoteAuthSucceeded = false;
    let studentProfile;
    let remoteErrorMessage = "";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1e4);
      const response = await fetch(`${pesuAuthUrl}/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          username: cleanUsername,
          password,
          profile: true
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data.status && data.profile && data.profile.srn) {
          remoteAuthSucceeded = true;
          studentProfile = data.profile;
        } else {
          remoteErrorMessage = data.message || "Invalid PESU Academy credentials.";
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        remoteErrorMessage = errJson.message || `PESU Auth server returned status ${response.status}`;
      }
    } catch (networkError) {
      console.warn(`[pesu-dev/auth] Remote server unreachable at ${pesuAuthUrl}: ${networkError.message}`);
    }
    if (remoteAuthSucceeded && studentProfile) {
      const cleanSrn = studentProfile.srn.trim().toUpperCase();
      const existing = Database.getUserBySrn(cleanSrn);
      let campusVal = "RR Campus";
      if (studentProfile.campus?.toUpperCase().includes("EC") || studentProfile.campusCode === 2) {
        campusVal = "EC Campus";
      }
      const parsedSem = studentProfile.semester ? parseInt(String(studentProfile.semester), 10) : 4;
      const validSem = !isNaN(parsedSem) && parsedSem >= 1 && parsedSem <= 8 ? parsedSem : 4;
      if (existing) {
        const { hash, salt } = Database.hashPassword(password);
        const updated = Database.updateUser(cleanSrn, {
          name: studentProfile.name || existing.name,
          prn: studentProfile.prn || existing.prn,
          department: studentProfile.branch || existing.department,
          branch: studentProfile.branch ? studentProfile.branch.split(" ")[0] : existing.branch,
          semester: validSem,
          campus: campusVal,
          email: studentProfile.email || existing.email,
          phone: studentProfile.phone || existing.phone,
          passwordHash: hash,
          salt
        });
        const isFirst = !updated.interests || updated.interests.length === 0;
        return { user: updated, isFirstLogin: isFirst, authSource: "pesu-dev/auth" };
      } else {
        const { hash, salt } = Database.hashPassword(password);
        const newUser = {
          srn: cleanSrn,
          prn: studentProfile.prn,
          passwordHash: hash,
          salt,
          name: studentProfile.name,
          department: studentProfile.branch || "Computer Science & Engineering",
          branch: studentProfile.branch ? studentProfile.branch.split(" ")[0] : "CSE",
          semester: validSem,
          campus: campusVal,
          email: studentProfile.email || `${studentProfile.name.toLowerCase().replace(/\s+/g, "")}.${cleanSrn.slice(-4).toLowerCase()}@pes.edu`,
          phone: studentProfile.phone,
          photo_url: "",
          hackathon_count: 0,
          github_url: "",
          interests: [],
          skills: [],
          bio: "",
          looking_for_team: true,
          preferred_roles: ["Full Stack Developer"],
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        const created = Database.createUser(newUser);
        return { user: created, isFirstLogin: true, authSource: "pesu-dev/auth" };
      }
    }
    const localUser = Database.getUserByIdentifier(cleanUsername);
    if (localUser) {
      const isValid = Database.verifyPassword(password, localUser.passwordHash, localUser.salt);
      if (isValid) {
        const isFirst = !localUser.interests || localUser.interests.length === 0;
        return { user: localUser, isFirstLogin: isFirst, authSource: "local_db" };
      }
    }
    throw new Error(remoteErrorMessage || "Invalid PESU Academy credentials. Please verify your SRN/PRN and password.");
  }
};

// server/api.ts
var apiRouter = Router();
async function authMiddleware(req, res, next) {
  let srn;
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
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
    }
  }
  if (!srn) {
    res.status(401).json({ error: "Authentication required. Please sign in with your PESU credentials." });
    return;
  }
  const user = Database.getUserBySrn(srn);
  if (!user) {
    res.status(401).json({ error: "User account not found." });
    return;
  }
  req.user = user;
  req.sessionToken = token;
  next();
}
async function optionalAuthMiddleware(req, res, next) {
  let srn;
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
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
    }
  }
  if (srn) {
    const user = Database.getUserBySrn(srn);
    if (user) {
      req.user = user;
      req.sessionToken = token;
    }
  }
  next();
}
function sanitizeUser(user) {
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}
apiRouter.post("/auth/login", async (req, res) => {
  try {
    const { identifier, srn, username, password } = req.body;
    const lookupUsername = identifier || srn || username;
    if (!lookupUsername || typeof lookupUsername !== "string" || !lookupUsername.trim()) {
      res.status(400).json({ error: "PESU ID (SRN / PRN) is required." });
      return;
    }
    if (!password || typeof password !== "string" || !password.trim()) {
      res.status(400).json({ error: "Password is required." });
      return;
    }
    const authResult = await PesuAuthService.authenticate(lookupUsername, password);
    const authenticatedUser = authResult.user;
    const session = Database.createSession(authenticatedUser.srn);
    const ironSession = await getAppSession(req, res);
    ironSession.srn = authenticatedUser.srn;
    ironSession.token = session.token;
    ironSession.name = authenticatedUser.name;
    ironSession.email = authenticatedUser.email;
    ironSession.isLoggedIn = true;
    await ironSession.save();
    res.json({
      message: "Signed in successfully via PESU Academy.",
      token: session.token,
      user: sanitizeUser(authenticatedUser),
      isFirstLogin: authResult.isFirstLogin,
      redirect: authResult.isFirstLogin ? "/onboarding" : "/discover"
    });
  } catch (error) {
    res.status(401).json({ error: error.message || "Authentication failed. Please check your PESU credentials." });
  }
});
apiRouter.post("/auth/register", async (req, res) => {
  try {
    const {
      srn,
      prn,
      name,
      password,
      department,
      semester,
      campus,
      email,
      phone,
      hackathon_count,
      interests,
      skills,
      bio
    } = req.body;
    if (!srn || typeof srn !== "string" || !srn.trim()) {
      res.status(400).json({ error: "Valid PESU SRN is required (e.g. PES1UG23CS101)." });
      return;
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long." });
      return;
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "Full Student Name is required." });
      return;
    }
    const cleanSrn = srn.trim().toUpperCase();
    const existing = Database.getUserBySrn(cleanSrn);
    if (existing) {
      res.status(409).json({
        error: `An account with SRN ${cleanSrn} already exists. Please sign in with your password.`
      });
      return;
    }
    const { hash, salt } = Database.hashPassword(password);
    const newUser = {
      srn: cleanSrn,
      prn: prn ? prn.trim().toUpperCase() : void 0,
      passwordHash: hash,
      salt,
      name: name.trim(),
      department: department || "Computer Science & Engineering",
      branch: department ? department.split(" ")[0] : "CSE",
      semester: semester ? Number(semester) : 4,
      campus: campus === "EC Campus" ? "EC Campus" : "RR Campus",
      email: email ? email.trim().toLowerCase() : `${name.toLowerCase().replace(/\s+/g, "")}.${cleanSrn.slice(-4).toLowerCase()}@pes.edu`,
      phone: phone ? phone.trim() : void 0,
      photo_url: "",
      hackathon_count: hackathon_count ? Math.max(0, Number(hackathon_count)) : 0,
      github_url: "",
      interests: interests && Array.isArray(interests) ? interests : [],
      skills: skills && Array.isArray(skills) ? skills : [],
      bio: bio ? String(bio).trim() : "",
      looking_for_team: true,
      preferred_roles: ["Full Stack Developer"],
      created_at: (/* @__PURE__ */ new Date()).toISOString()
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
      message: "PESU Student Account registered successfully.",
      token: session.token,
      user: sanitizeUser(created),
      isFirstLogin: true,
      redirect: "/onboarding"
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Registration failed." });
  }
});
apiRouter.get("/auth/me", authMiddleware, async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ user: sanitizeUser(req.user) });
});
apiRouter.post("/auth/logout", async (req, res) => {
  try {
    const ironSession = await getAppSession(req, res);
    ironSession.destroy();
  } catch {
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    Database.deleteSession(token);
  }
  res.json({ message: "Logged out successfully." });
});
apiRouter.get("/profiles", optionalAuthMiddleware, (req, res) => {
  try {
    const {
      search,
      department,
      semester,
      minHackathons,
      interest,
      sortBy = "experience"
    } = req.query;
    let users = Database.getUsers();
    if (search && typeof search === "string" && search.trim()) {
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
    if (department && department !== "All" && typeof department === "string") {
      users = users.filter((u) => u.department.toLowerCase() === department.toLowerCase());
    }
    if (semester && semester !== "All") {
      users = users.filter((u) => u.semester.toString() === String(semester));
    }
    if (minHackathons) {
      const minH = Number(minHackathons);
      if (!isNaN(minH) && minH > 0) {
        users = users.filter((u) => u.hackathon_count >= minH);
      }
    }
    if (interest && interest !== "All" && typeof interest === "string") {
      users = users.filter((u) => u.interests?.includes(interest));
    }
    users.sort((a, b) => {
      if (sortBy === "experience") {
        return b.hackathon_count - a.hackathon_count;
      }
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });
    const sanitized = users.map(sanitizeUser);
    res.json({ profiles: sanitized, total: sanitized.length });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch profiles." });
  }
});
apiRouter.get("/profiles/:srn", (req, res) => {
  try {
    const srn = req.params.srn.toUpperCase();
    const user = Database.getUserBySrn(srn);
    if (!user) {
      res.status(404).json({ error: `Hacker profile with SRN ${srn} not found.` });
      return;
    }
    res.json({ profile: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch profile." });
  }
});
apiRouter.put("/profiles/:srn", authMiddleware, (req, res) => {
  try {
    const targetSrn = req.params.srn.toUpperCase();
    if (!req.user || req.user.srn.toUpperCase() !== targetSrn) {
      res.status(403).json({ error: "You are only authorized to update your own profile." });
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
      campus,
      email,
      phone,
      looking_for_team,
      preferred_roles
    } = req.body;
    const updates = {};
    if (name && typeof name === "string") updates.name = name.trim();
    if (department && typeof department === "string") {
      updates.department = department.trim();
      updates.branch = department.split(" ")[0] || "CSE";
    }
    if (semester !== void 0) updates.semester = Number(semester);
    if (hackathon_count !== void 0) updates.hackathon_count = Math.max(0, Number(hackathon_count));
    if (github_url !== void 0) updates.github_url = String(github_url).trim();
    if (photo_url !== void 0) updates.photo_url = String(photo_url).trim();
    if (interests && Array.isArray(interests)) updates.interests = interests;
    if (skills && Array.isArray(skills)) updates.skills = skills;
    if (bio !== void 0) updates.bio = String(bio).trim();
    if (campus) updates.campus = campus === "EC Campus" ? "EC Campus" : "RR Campus";
    if (email) updates.email = String(email).trim().toLowerCase();
    if (phone !== void 0) updates.phone = String(phone).trim();
    if (looking_for_team !== void 0) updates.looking_for_team = Boolean(looking_for_team);
    if (preferred_roles && Array.isArray(preferred_roles)) updates.preferred_roles = preferred_roles;
    const updated = Database.updateUser(targetSrn, updates);
    res.json({
      message: "Profile updated successfully.",
      profile: sanitizeUser(updated)
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update profile." });
  }
});
apiRouter.get("/posts", (req, res) => {
  try {
    const { hashtag, author_srn } = req.query;
    let posts = Database.getPosts();
    if (hashtag && typeof hashtag === "string") {
      const tagLower = hashtag.toLowerCase();
      posts = posts.filter((p) => p.hashtags?.some((h) => h.toLowerCase() === tagLower));
    }
    if (author_srn && typeof author_srn === "string") {
      const srnUpper = author_srn.toUpperCase();
      posts = posts.filter((p) => p.author_srn.toUpperCase() === srnUpper);
    }
    res.json({ posts, total: posts.length });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch community posts." });
  }
});
apiRouter.post("/posts", authMiddleware, (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const { body, looking_for_team } = req.body;
    if (!body || typeof body !== "string" || body.trim().length === 0) {
      res.status(400).json({ error: "Post content cannot be empty." });
      return;
    }
    const hashtagRegex = /#[\w-]+/g;
    const matches = body.match(hashtagRegex);
    const hashtags = matches ? Array.from(new Set(matches.map((m) => m.toLowerCase()))) : [];
    const newPost = Database.createPost({
      author_srn: req.user.srn,
      author_name: req.user.name,
      author_photo: req.user.photo_url || "",
      author_dept: req.user.department,
      author_semester: req.user.semester,
      body: body.trim(),
      hashtags,
      looking_for_team: looking_for_team ?? req.user.looking_for_team ?? true
    });
    res.status(201).json({
      message: "Post created successfully.",
      post: newPost
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create post." });
  }
});
apiRouter.post("/posts/:id/like", authMiddleware, (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const postId = req.params.id;
    const updatedPost = Database.toggleLike(postId, req.user.srn);
    res.json({ post: updatedPost });
  } catch (error) {
    res.status(404).json({ error: error.message || "Post not found." });
  }
});
apiRouter.post("/posts/:id/comments", authMiddleware, (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const postId = req.params.id;
    const { body } = req.body;
    if (!body || typeof body !== "string" || body.trim().length === 0) {
      res.status(400).json({ error: "Comment body cannot be empty." });
      return;
    }
    const newComment = Database.addComment(postId, {
      author_srn: req.user.srn,
      author_name: req.user.name,
      author_photo: req.user.photo_url || "",
      body: body.trim()
    });
    const updatedPost = Database.getPostById(postId);
    res.status(201).json({
      message: "Comment added successfully.",
      comment: newComment,
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to add comment." });
  }
});
apiRouter.get("/invites", authMiddleware, (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const invites = Database.getInvitesForUser(req.user.srn);
    res.json({ invites });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch invites." });
  }
});
apiRouter.post("/invites", authMiddleware, (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const { to_srn, message } = req.body;
    if (!to_srn || typeof to_srn !== "string") {
      res.status(400).json({ error: "Recipient SRN is required." });
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
      from_photo: req.user.photo_url || "",
      from_dept: req.user.department,
      to_srn: recipient.srn,
      message: message ? String(message).trim() : `Hey ${recipient.name}! Let's team up for SIH 2026!`,
      contact_info: {
        email: req.user.email,
        github: req.user.github_url,
        phone: req.user.phone
      }
    });
    res.status(201).json({
      message: "Invitation sent successfully.",
      invite: newInvite
    });
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to send invitation." });
  }
});
apiRouter.put("/invites/:id/respond", authMiddleware, (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const inviteId = req.params.id;
    const { status } = req.body;
    if (status !== "accepted" && status !== "declined") {
      res.status(400).json({ error: 'Status must be either "accepted" or "declined".' });
      return;
    }
    const updated = Database.updateInviteStatus(inviteId, status, req.user.srn);
    res.json({
      message: `Invitation ${status} successfully.`,
      invite: updated
    });
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to update invitation status." });
  }
});
apiRouter.get("/hashtags/trending", (_req, res) => {
  try {
    const trending = Database.getTrendingHashtags();
    res.json({ hashtags: trending });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch trending hashtags." });
  }
});
apiRouter.get("/stats/user/:srn", (req, res) => {
  try {
    const srn = req.params.srn.toUpperCase();
    const user = Database.getUserBySrn(srn);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const stats = Database.getStatsForUser(srn);
    res.json({
      srn,
      connections: stats.connectionsCount,
      hackathons: user.hackathon_count,
      invitesSent: stats.invitesSent,
      invitesReceived: stats.invitesReceived
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to calculate user stats." });
  }
});
apiRouter.get("/config", (_req, res) => {
  res.json({
    sihDeadline: process.env.SIH_REGISTRATION_DEADLINE || "2026-09-30T23:59:59.000Z",
    appName: "PESquad",
    institution: "PES University",
    authProvider: "pesu-dev/auth",
    version: "1.0.0"
  });
});

// api/index.ts
var app = express();
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});
app.use((req, _res, next) => {
  if (req.url.startsWith("/api/")) {
    req.url = req.url.substring(4);
  } else if (req.url === "/api") {
    req.url = "/";
  }
  next();
});
app.use("/", apiRouter);
app.use((err, _req, res, _next) => {
  console.error("[API Serverless Error]", err);
  res.status(500).json({ error: err?.message || "Internal Server Error" });
});
var index_default = app;
export {
  index_default as default
};
