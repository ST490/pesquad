-- =========================================================
-- PESquad Supabase Database Schema
-- Project: PES University SIH Teammate Matchmaker
-- =========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  srn TEXT PRIMARY KEY,
  prn TEXT,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  department TEXT NOT NULL,
  branch TEXT NOT NULL,
  semester INT NOT NULL DEFAULT 4,
  campus TEXT NOT NULL DEFAULT 'RR Campus',
  email TEXT,
  phone TEXT,
  photo_url TEXT DEFAULT '',
  hackathon_count INT DEFAULT 0,
  github_url TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  looking_for_team BOOLEAN DEFAULT true,
  preferred_roles TEXT[] DEFAULT '{"Full Stack Developer"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Posts Table (Community SIH Feed)
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  author_srn TEXT REFERENCES public.users(srn) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_photo TEXT DEFAULT '',
  author_dept TEXT NOT NULL,
  author_semester INT NOT NULL,
  body TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  looking_for_team BOOLEAN DEFAULT true,
  likes_count INT DEFAULT 0,
  liked_by TEXT[] DEFAULT '{}',
  comments_count INT DEFAULT 0,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Team Invites Table
CREATE TABLE IF NOT EXISTS public.invites (
  id TEXT PRIMARY KEY,
  from_srn TEXT REFERENCES public.users(srn) ON DELETE CASCADE,
  from_name TEXT NOT NULL,
  from_photo TEXT DEFAULT '',
  from_dept TEXT NOT NULL,
  to_srn TEXT REFERENCES public.users(srn) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  message TEXT NOT NULL,
  contact_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
  token TEXT PRIMARY KEY,
  srn TEXT REFERENCES public.users(srn) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes for lightning fast searches & filtering
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users(department);
CREATE INDEX IF NOT EXISTS idx_users_semester ON public.users(semester);
CREATE INDEX IF NOT EXISTS idx_users_campus ON public.users(campus);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_srn);
CREATE INDEX IF NOT EXISTS idx_invites_to ON public.invites(to_srn);
CREATE INDEX IF NOT EXISTS idx_invites_from ON public.invites(from_srn);

-- Insert initial verified student SUFIYAN TATAGAR
INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, campus, email, phone, hackathon_count, interests, skills, bio, looking_for_team
) VALUES (
  'PES1UG25CS698',
  'PES1202504729',
  'SUFIYAN TATAGAR',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science and Engineering',
  'CSE',
  3,
  'RR Campus',
  'sufiyantatagar490@gmail.com',
  '8050895979',
  3,
  ARRAY['Frontend', 'Backend'],
  ARRAY['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
  'Full Stack developer eager to build innovative solutions for SIH 2026.',
  true
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email;
