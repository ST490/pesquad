import { getIronSession, IronSession } from 'iron-session';
import { Request, Response } from 'express';

export interface UserSessionData {
  srn?: string;
  token?: string;
  name?: string;
  email?: string;
  isLoggedIn?: boolean;
  codeVerifier?: string;
  oauthState?: string;
}

export const sessionOptions = {
  password:
    process.env.SESSION_PASSWORD ||
    'pesquad_super_secure_iron_session_password_32_characters_long_min_2026',
  cookieName: 'pesquad_session_cookie',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};

export async function getAppSession(
  req: Request,
  res: Response
): Promise<IronSession<UserSessionData>> {
  return getIronSession<UserSessionData>(req, res, sessionOptions);
}
