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
    // Normalize SRN/PRN to uppercase (e.g. pes1ug25cs698 -> PES1UG25CS698)
    const cleanUsername = rawUsername.toUpperCase().startsWith('PES')
      ? rawUsername.toUpperCase()
      : rawUsername;
    const pesuAuthUrl = this.getBaseUrl().replace(/\/+$/, '');

    let remoteAuthSucceeded = false;
    let studentProfile: PesuAuthProfile | undefined;
    let remoteErrorMessage = '';
    let remoteReachable = false;

    // 1. Attempt authentication against pesu-dev/auth upstream endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

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
      remoteReachable = true;

      if (response.ok) {
        const data = (await response.json()) as PesuAuthResponse;
        if (data.status && data.profile && data.profile.srn) {
          remoteAuthSucceeded = true;
          studentProfile = data.profile;
        } else {
          remoteErrorMessage = data.message || 'Invalid PESU Academy credentials.';
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        remoteErrorMessage = errJson.message || `PESU Auth server returned status ${response.status}`;
      }
    } catch (networkError: any) {
      console.warn(`[pesu-dev/auth] Remote server unreachable at ${pesuAuthUrl}: ${networkError.message}`);
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
        // Update user with verified latest academic records
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
        // First-time login -> create initial student record
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

    // 3. Fallback: If remote PESU server is offline or returned error, verify with local registered credentials
    const localUser = Database.getUserByIdentifier(cleanUsername);
    if (localUser) {
      const isValid = Database.verifyPassword(password, localUser.passwordHash, localUser.salt);
      if (isValid) {
        const isFirst = !localUser.interests || localUser.interests.length === 0;
        return { user: localUser, isFirstLogin: isFirst, authSource: 'local_db' };
      }
      throw new Error('Incorrect password for this PESU account. Please verify your password or use your registered credentials.');
    }

    // If both failed and user doesn't exist locally
    if (!remoteReachable) {
      throw new Error('PESU Academy authentication is currently unreachable. If you are new, please click "Register Account" to sign up.');
    }

    throw new Error(remoteErrorMessage || 'Invalid PESU Academy credentials. Please verify your SRN/PRN and password, or use "Register Account" to sign up.');
  }
}
