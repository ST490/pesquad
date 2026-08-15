import { Database, DbUser } from './db.js';

export interface PesuAuthProfile {
  name: string;
  srn: string;
  prn: string;
  program?: string;
  branch?: string;
  semester?: string | number;
  section?: string;
  email?: string;
  phone?: string;
  campusCode?: number;
  campus?: string;
}

export interface PesuAuthResponse {
  status: boolean;
  message?: string;
  profile?: PesuAuthProfile;
}

export class PesuAuthService {
  public static getBaseUrl(): string {
    return process.env.PESU_AUTH_URL || 'https://pesu-auth.onrender.com';
  }

  /**
   * Authenticates PESU Academy student credentials using pesu-dev/auth API
   * POST /authenticate { username, password, profile: true }
   */
  public static async authenticate(
    username: string,
    password: string
  ): Promise<{
    user: DbUser;
    isFirstLogin: boolean;
    authSource: 'pesu-dev/auth' | 'local_db';
  }> {
    const rawUsername = username.trim();
    // Normalize SRN/PRN to uppercase (e.g. pes1ug25cs716 -> PES1UG25CS716)
    const cleanUsername = rawUsername.toUpperCase().startsWith('PES')
      ? rawUsername.toUpperCase()
      : rawUsername;
    const pesuAuthUrl = this.getBaseUrl().replace(/\/+$/, '');

    let remoteAuthSucceeded = false;
    let studentProfile: PesuAuthProfile | undefined;

    // 1. Attempt fast authentication against pesu-dev/auth upstream endpoint (6s limit)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${pesuAuthUrl}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: cleanUsername,
          password: password,
          profile: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as PesuAuthResponse;
        if (data.status && data.profile && data.profile.srn) {
          remoteAuthSucceeded = true;
          studentProfile = data.profile;
        }
      }
    } catch (networkError: any) {
      console.warn(`[pesu-dev/auth] Fast check completed/bypassed: ${networkError.message}`);
    }

    // 2. If remote auth succeeded, synchronize with local database
    if (remoteAuthSucceeded && studentProfile) {
      const cleanSrn = studentProfile.srn.trim().toUpperCase();
      const existing = Database.getUserBySrn(cleanSrn);

      let campusVal: 'RR Campus' | 'EC Campus' = 'RR Campus';
      if (studentProfile.campus?.toUpperCase().includes('EC') || studentProfile.campusCode === 2) {
        campusVal = 'EC Campus';
      }

      const parsedSem = studentProfile.semester ? parseInt(String(studentProfile.semester), 10) : 4;
      const validSem = !isNaN(parsedSem) && parsedSem >= 1 && parsedSem <= 8 ? parsedSem : 4;

      if (existing) {
        const { hash, salt } = Database.hashPassword(password);
        const updated = Database.updateUser(cleanSrn, {
          name: studentProfile.name || existing.name,
          prn: studentProfile.prn || existing.prn,
          department: studentProfile.branch || existing.department,
          branch: studentProfile.branch ? studentProfile.branch.split(' ')[0] : existing.branch,
          semester: validSem,
          campus: campusVal,
          email: studentProfile.email || existing.email,
          phone: studentProfile.phone || existing.phone,
          passwordHash: hash,
          salt: salt,
        });

        const isFirst = !updated.interests || updated.interests.length === 0;
        return { user: updated, isFirstLogin: isFirst, authSource: 'pesu-dev/auth' };
      } else {
        const { hash, salt } = Database.hashPassword(password);
        const newUser: DbUser = {
          srn: cleanSrn,
          prn: studentProfile.prn,
          passwordHash: hash,
          salt: salt,
          name: studentProfile.name,
          department: studentProfile.branch || 'Computer Science & Engineering',
          branch: studentProfile.branch ? studentProfile.branch.split(' ')[0] : 'CSE',
          semester: validSem,
          campus: campusVal,
          email: studentProfile.email || `${studentProfile.name.toLowerCase().replace(/\s+/g, '')}.${cleanSrn.slice(-4).toLowerCase()}@pes.edu`,
          phone: studentProfile.phone,
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

        const created = Database.createUser(newUser);
        return { user: created, isFirstLogin: true, authSource: 'pesu-dev/auth' };
      }
    }

    // 3. Fallback: If user already exists in database, verify password
    const localUser = Database.getUserByIdentifier(cleanUsername);
    if (localUser) {
      const isValid = Database.verifyPassword(password, localUser.passwordHash, localUser.salt);
      if (isValid) {
        const isFirst = !localUser.interests || localUser.interests.length === 0;
        return { user: localUser, isFirstLogin: isFirst, authSource: 'local_db' };
      }
      throw new Error('Incorrect password. Please use your PESU Academy password to sign in.');
    }

    // 4. No valid credentials found — reject the login attempt.
    // We do NOT auto-create accounts for unverified students.
    throw new Error(
      'Could not verify your PESU Academy credentials. Please ensure you are using your correct SRN/PRN and PESU Academy password. If the PESU server is temporarily unavailable, please try again in a few minutes.'
    );
  }
}
