import crypto from 'crypto';
import { Database, DbUser } from './db.js';

export interface PesuOAuthProfile {
  name: string;
  prn: string;
  srn: string;
  email?: string;
  phone?: string;
  program?: string;
  branch?: string;
  semester?: string | number;
  section?: string;
  campus?: string;
  photo?: string;
}

export interface PesuTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

export class PesuOAuthService {
  public static getBaseUrl(): string {
    return (process.env.PESU_OAUTH_URL || 'https://pesu-oauth2.vercel.app').replace(/\/+$/, '');
  }

  public static getClientId(): string {
    return process.env.PESU_OAUTH_CLIENT_ID || 'pesquad';
  }

  public static getClientSecret(): string | undefined {
    return process.env.PESU_OAUTH_CLIENT_SECRET || undefined;
  }

  public static getScopes(): string {
    return 'profile:basic profile:academic profile:contact profile:photo';
  }

  /**
   * Generates PKCE code_verifier and code_challenge (S256)
   */
  public static generatePKCE(): { codeVerifier: string; codeChallenge: string } {
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    const codeChallenge = hash.toString('base64url');
    return { codeVerifier, codeChallenge };
  }

  /**
   * Generates a random state parameter for CSRF mitigation
   */
  public static generateState(): string {
    return crypto.randomBytes(24).toString('hex');
  }

  /**
   * Builds the OAuth2 authorization URL
   */
  public static getAuthorizationUrl(redirectUri: string, state: string, codeChallenge: string): string {
    const baseUrl = this.getBaseUrl();
    const clientId = this.getClientId();
    const scope = this.getScopes();

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${baseUrl}/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Exchanges authorization code for access tokens
   */
  public static async exchangeCodeForTokens(
    code: string,
    redirectUri: string,
    codeVerifier: string
  ): Promise<PesuTokenResponse> {
    const baseUrl = this.getBaseUrl();
    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();

    const bodyParams: Record<string, string> = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    };

    if (clientSecret) {
      bodyParams.client_secret = clientSecret;
    }

    const response = await fetch(`${baseUrl}/api/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams(bodyParams).toString(),
    });

    const data = (await response.json()) as PesuTokenResponse;
    if (!response.ok || data.error) {
      throw new Error(data.error_description || data.error || `Token exchange failed with HTTP ${response.status}`);
    }

    return data;
  }

  /**
   * Fetches user profile data using access token
   */
  public static async fetchUserProfile(accessToken: string): Promise<PesuOAuthProfile> {
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Failed to fetch user profile: ${response.status} ${errorText}`);
    }

    const profile = (await response.json()) as PesuOAuthProfile;
    if (!profile || (!profile.srn && !profile.prn)) {
      throw new Error('OAuth profile response missing SRN/PRN identity.');
    }

    return profile;
  }

  /**
   * Synchronizes authenticated OAuth profile with local database / Supabase
   */
  public static syncOAuthUser(profile: PesuOAuthProfile): { user: DbUser; isFirstLogin: boolean } {
    const cleanSrn = (profile.srn || profile.prn).trim().toUpperCase();
    const cleanPrn = profile.prn ? profile.prn.trim().toUpperCase() : undefined;
    const existing = Database.getUserBySrn(cleanSrn);

    let campusVal: 'RR Campus' | 'EC Campus' = 'RR Campus';
    if (profile.campus?.toUpperCase().includes('EC')) {
      campusVal = 'EC Campus';
    }

    const parsedSem = profile.semester ? parseInt(String(profile.semester), 10) : 4;
    const validSem = !isNaN(parsedSem) && parsedSem >= 1 && parsedSem <= 8 ? parsedSem : 4;

    const deptVal = profile.branch || profile.program || 'Computer Science & Engineering';
    const branchVal = profile.branch ? profile.branch.split(' ')[0] : 'CSE';

    if (existing) {
      const updated = Database.updateUser(cleanSrn, {
        name: profile.name || existing.name,
        prn: cleanPrn || existing.prn,
        department: deptVal || existing.department,
        branch: branchVal || existing.branch,
        semester: validSem,
        campus: campusVal,
        email: profile.email || existing.email,
        phone: profile.phone || existing.phone,
        photo_url: profile.photo || existing.photo_url,
      });

      const isFirst = !updated.interests || updated.interests.length === 0;
      return { user: updated, isFirstLogin: isFirst };
    } else {
      const newUser: DbUser = {
        srn: cleanSrn,
        prn: cleanPrn,
        passwordHash: '',
        salt: '',
        name: profile.name || cleanSrn,
        department: deptVal,
        branch: branchVal,
        semester: validSem,
        campus: campusVal,
        email: profile.email || `${cleanSrn.toLowerCase()}@pes.edu`,
        phone: profile.phone,
        photo_url: profile.photo || '',
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
      return { user: created, isFirstLogin: true };
    }
  }
}
