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
  gender TEXT DEFAULT 'Male' CHECK (gender IN ('Male', 'Female', 'Other')),
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

-- 5. Seed all 55 PES University student hacker profiles
INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS698',
  'PES1202504729',
  'SUFIYAN TATAGAR',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'sufiyantatagar490@gmail.com',
  '8050895979',
  3,
  'https://github.com/ST490',
  ARRAY['Frontend', 'Backend', 'Full Stack'],
  ARRAY['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
  'Full Stack developer eager to build innovative solutions for SIH 2026.',
  true,
  ARRAY['Full Stack Developer', 'Team Lead'],
  '2026-08-14T20:35:30.654Z',
  '2026-08-14T20:35:54.679Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS309',
  'PES1202502309',
  'Mohammed Yusuf Ahmed',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'yusuf.ahmed@pes.edu',
  '8088421593',
  4,
  'https://github.com/yusufahmed',
  ARRAY['Frontend', 'Backend', 'Full Stack', 'Cloud & DevOps'],
  ARRAY['Next.js', 'Python', 'Docker', 'FastAPI'],
  'Experienced backend & systems architect looking for an enthusiastic team for SIH 2026.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-14T21:00:00.000Z',
  '2026-08-14T21:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25ME042',
  'PES1202501042',
  'SHREYAS SANJAY GAIKWAD',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Mechanical Engineering',
  'ME',
  3,
  'Male',
  'RR Campus',
  'shreyas.gaikwad@pes.edu',
  '9036296715',
  3,
  'https://github.com/shreyasgaikwad',
  ARRAY['Computer Vision', 'Natural Language Processing', 'IoT & Robotics'],
  ARRAY['PyTorch', 'ROS', 'OpenCV', 'Python'],
  'Self-driven builder and developer passionate about creating autonomous systems and AI hardware for SIH.',
  true,
  ARRAY['AI / ML Engineer', 'Hardware / Embedded Systems Lead'],
  '2026-08-14T21:30:00.000Z',
  '2026-08-14T21:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EE054',
  'PES1202503054',
  'MOHAMMAD SAFWAAN',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electrical & Electronics',
  'EEE',
  3,
  'Male',
  'RR Campus',
  'mohammad.safwaan@pes.edu',
  '8317452496',
  1,
  '',
  ARRAY['Frontend', 'Backend', 'Embedded Systems', 'IoT & Robotics'],
  ARRAY['Embedded C', 'JavaScript', 'Node.js'],
  'Ready to contribute frontend UI and IoT device integration for smart hardware problem statements.',
  true,
  ARRAY['Full Stack Developer', 'Hardware / Embedded Systems Lead'],
  '2026-08-14T22:00:00.000Z',
  '2026-08-14T22:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25AM513',
  'PES1202505513',
  'S BANUTEJA REDDY',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  4,
  'Male',
  'RR Campus',
  'banuteja.reddy@pes.edu',
  '9845012345',
  2,
  '',
  ARRAY['Machine Learning', 'Deep Learning', 'Backend'],
  ARRAY['Python', 'Scikit-Learn', 'TensorFlow', 'SQL'],
  'Focused on AI model training, predictive analytics, and scalable model deployment for SIH projects.',
  true,
  ARRAY['AI / ML Engineer', 'Backend Specialist'],
  '2026-08-15T00:00:00.000Z',
  '2026-08-15T00:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS696',
  'PES1202504696',
  'Spandana B M',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'RR Campus',
  'spandana.bm@pes.edu',
  '9845112233',
  3,
  'https://github.com/spandanabm',
  ARRAY['UI/UX Design', 'Frontend', 'Mobile App (Flutter/React Native)'],
  ARRAY['Figma', 'React', 'Tailwind CSS', 'Flutter'],
  'Passionate UI/UX designer and frontend developer. Experienced in designing accessible and sleek mobile/web products.',
  true,
  ARRAY['UI/UX Designer', 'Full Stack Developer'],
  '2026-08-15T07:30:00.000Z',
  '2026-08-15T07:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS716',
  'PES1202504716',
  'Chirag Kulkarni',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'chirag.kulkarni@pes.edu',
  '9845223344',
  2,
  'https://github.com/chiragkulkarni',
  ARRAY['Cloud & DevOps', 'Backend', 'Full Stack'],
  ARRAY['Docker', 'AWS', 'Node.js', 'Linux', 'Express'],
  'DevOps enthusiast with practical experience in CI/CD pipelines, container orchestration, and microservices.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-15T08:00:00.000Z',
  '2026-08-15T08:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS104',
  'PES1202501104',
  'Ananya Sharma',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'RR Campus',
  'ananya.sharma@pes.edu',
  '9901234567',
  5,
  'https://github.com/ananyasharma',
  ARRAY['Machine Learning', 'Natural Language Processing', 'Full Stack'],
  ARRAY['PyTorch', 'FastAPI', 'LangChain', 'React'],
  '5x hackathon winner specializing in LLMs and AI agent architectures. Looking for a passionate team for SIH 2026!',
  true,
  ARRAY['AI / ML Engineer', 'Team Lead'],
  '2026-08-15T08:30:00.000Z',
  '2026-08-15T08:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EC215',
  'PES1202501215',
  'Kavya Ramesh',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electronics & Communication',
  'ECE',
  4,
  'Female',
  'EC Campus',
  'kavya.ramesh@pes.edu',
  '9741098765',
  2,
  'https://github.com/kavyaramesh',
  ARRAY['Embedded Systems', 'IoT & Robotics', 'Hardware / Embedded Systems Lead'],
  ARRAY['ESP32', 'Arduino', 'C++', 'TinyML'],
  'ECE hardware hacker building smart IoT sensors and edge computing devices for smart city and agri-tech challenges.',
  true,
  ARRAY['Hardware / Embedded Systems Lead'],
  '2026-08-15T09:00:00.000Z',
  '2026-08-15T09:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS442',
  'PES1202503442',
  'Rohan Varma',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'EC Campus',
  'rohan.varma@pes.edu',
  '9845334455',
  3,
  'https://github.com/rohanvarma',
  ARRAY['Cloud & DevOps', 'Backend', 'Data Engineering'],
  ARRAY['AWS', 'Kubernetes', 'Go', 'PostgreSQL', 'Terraform'],
  'Cloud infra engineer passionate about building high-availability backends and scalable microservices architectures.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-15T09:30:00.000Z',
  '2026-08-15T09:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25BT019',
  'PES1202502019',
  'Pooja Hegde',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Biotechnology',
  'BT',
  4,
  'Female',
  'RR Campus',
  'pooja.hegde@pes.edu',
  '9845445566',
  2,
  'https://github.com/poojahegde',
  ARRAY['Data Engineering', 'Machine Learning', 'Domain / Pitch Specialist'],
  ARRAY['BioPython', 'R', 'Python', 'Data Analytics'],
  'Biotech student bridging computational biology with health-tech AI solutions for SIH MedTech problem statements.',
  true,
  ARRAY['Domain / Pitch Specialist', 'AI / ML Engineer'],
  '2026-08-15T10:00:00.000Z',
  '2026-08-15T10:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CY118',
  'PES1202504118',
  'Aditya Kulkarni',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'aditya.kulkarni@pes.edu',
  '9900112233',
  4,
  'https://github.com/adityakulkarni',
  ARRAY['Cybersecurity', 'Blockchain & Web3', 'Backend'],
  ARRAY['Solidity', 'Rust', 'Penetration Testing', 'Node.js'],
  'Smart contract auditor and security researcher. Keen on Web3, zero-knowledge proofs, and secure digital identity.',
  true,
  ARRAY['Backend Specialist', 'Team Lead'],
  '2026-08-15T10:30:00.000Z',
  '2026-08-15T10:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS550',
  'PES1202503550',
  'Tanvi Deshmukh',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'EC Campus',
  'tanvi.deshmukh@pes.edu',
  '9845556677',
  1,
  'https://github.com/tanvideshmukh',
  ARRAY['AR / VR', 'Frontend', 'UI/UX Design'],
  ARRAY['Three.js', 'Unity', 'WebGL', 'React', 'Tailwind CSS'],
  'Creative 3D web developer building immersive spatial computing and AR/VR web experiences for SIH.',
  true,
  ARRAY['Frontend Developer', 'UI/UX Designer'],
  '2026-08-15T11:00:00.000Z',
  '2026-08-15T11:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25DS033',
  'PES1202505033',
  'Deepak Sundaram',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'deepak.sundaram@pes.edu',
  '9845667788',
  2,
  'https://github.com/deepaksundaram',
  ARRAY['Deep Learning', 'Computer Vision', 'Cloud & DevOps'],
  ARRAY['TensorFlow', 'OpenCV', 'MLflow', 'Python', 'FastAPI'],
  'Passionate about real-time vision pipelines, object tracking, and deploying optimized models on edge hardware.',
  true,
  ARRAY['AI / ML Engineer', 'Backend Specialist'],
  '2026-08-15T11:30:00.000Z',
  '2026-08-15T11:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25DS108',
  'PES1202505108',
  'Meera Nandakumar',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'RR Campus',
  'meera.nandakumar@pes.edu',
  '9880011224',
  3,
  'https://github.com/meerananda',
  ARRAY['Data Engineering', 'Full Stack', 'Machine Learning'],
  ARRAY['Pandas', 'Scikit-Learn', 'React', 'Node.js', 'SQL'],
  'Data scientist & full stack engineer experienced in building data-driven dashboards and smart recommendation systems.',
  true,
  ARRAY['Full Stack Developer', 'AI / ML Engineer'],
  '2026-08-15T12:00:00.000Z',
  '2026-08-15T12:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24CS201',
  'PES1202401201',
  'Aarav Patel',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  6,
  'Male',
  'RR Campus',
  'aarav.patel@pes.edu',
  '9845778899',
  4,
  'https://github.com/aaravpatel',
  ARRAY['Backend', 'Cloud & DevOps', 'Data Engineering'],
  ARRAY['Go', 'gRPC', 'Apache Kafka', 'Redis', 'PostgreSQL'],
  'Distributed systems engineer focused on fault-tolerant message queues, microservices, and high-throughput real-time pipelines.',
  true,
  ARRAY['Backend Specialist', 'Team Lead'],
  '2026-08-15T12:30:00.000Z',
  '2026-08-15T12:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24AM112',
  'PES1202402112',
  'Sneha Ranganathan',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  6,
  'Female',
  'RR Campus',
  'sneha.ranga@pes.edu',
  '9845889900',
  5,
  'https://github.com/sneharanga',
  ARRAY['Natural Language Processing', 'Deep Learning', 'Machine Learning'],
  ARRAY['LLMs', 'Hugging Face', 'RAG', 'LangGraph', 'Python'],
  'Specialized in multi-agent generative AI, retrieval-augmented generation (RAG), and fine-tuning open-source LLMs.',
  true,
  ARRAY['AI / ML Engineer', 'Team Lead'],
  '2026-08-15T13:00:00.000Z',
  '2026-08-15T13:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EC340',
  'PES1202503340',
  'Varun Rao',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electronics & Communication',
  'ECE',
  4,
  'Male',
  'EC Campus',
  'varun.rao@pes.edu',
  '9845990011',
  2,
  'https://github.com/varunrao',
  ARRAY['Embedded Systems', 'IoT & Robotics', 'Hardware / Embedded Systems Lead'],
  ARRAY['Verilog', 'STM32', 'FreeRTOS', 'C++', 'Circuit Design'],
  'VLSI and RTOS developer passionate about firmware engineering, FPGA accelerators, and hardware-software co-design.',
  true,
  ARRAY['Hardware / Embedded Systems Lead'],
  '2026-08-15T13:30:00.000Z',
  '2026-08-15T13:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG23CS088',
  'PES1202301088',
  'Priya Sundaresan',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  8,
  'Female',
  'RR Campus',
  'priya.sundar@pes.edu',
  '9880112233',
  6,
  'https://github.com/priyasundar',
  ARRAY['Full Stack', 'Cloud & DevOps', 'UI/UX Design'],
  ARRAY['Next.js 14', 'GraphQL', 'Docker', 'Google Cloud', 'TypeScript'],
  'Senior full-stack architect & veteran SIH finalist. Loves mentoring teams and crafting rapid production-ready prototypes.',
  true,
  ARRAY['Team Lead', 'Full Stack Developer'],
  '2026-08-15T14:00:00.000Z',
  '2026-08-15T14:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25ME105',
  'PES1202502105',
  'Nihal Gowda',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Mechanical Engineering',
  'ME',
  4,
  'Male',
  'RR Campus',
  'nihal.gowda@pes.edu',
  '9880223344',
  1,
  'https://github.com/nihalgowda',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Domain / Pitch Specialist'],
  ARRAY['SolidWorks', 'ANSYS', 'ROS 2', 'Python', 'CAN Bus'],
  'Robotics kinematics designer and CAD specialist ready to build autonomous mobile robots (AMR) and smart agritech rovers.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'Domain / Pitch Specialist'],
  '2026-08-15T14:30:00.000Z',
  '2026-08-15T14:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25BT044',
  'PES1202503044',
  'Divya Chandrashekar',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Biotechnology',
  'BT',
  4,
  'Female',
  'RR Campus',
  'divya.chandra@pes.edu',
  '9880334455',
  3,
  'https://github.com/divyachandra',
  ARRAY['Data Engineering', 'Machine Learning', 'Domain / Pitch Specialist'],
  ARRAY['BioConductor', 'Python', 'Nextflow', 'PyMOL', 'Bioinformatics'],
  'Computational biologist passionate about protein folding prediction, genomics pipelines, and drug discovery AI tools.',
  true,
  ARRAY['Domain / Pitch Specialist', 'AI / ML Engineer'],
  '2026-08-15T15:00:00.000Z',
  '2026-08-15T15:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EE120',
  'PES1202504120',
  'Harish Venkatesh',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electrical & Electronics',
  'EEE',
  4,
  'Male',
  'EC Campus',
  'harish.venkat@pes.edu',
  '9880445566',
  2,
  'https://github.com/harishvenkat',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Cloud & DevOps'],
  ARRAY['MATLAB/Simulink', 'ESP32', 'MQTT', 'KiCad', 'Power Electronics'],
  'Smart grid and green energy developer with experience in microgrid telemetry, telemetry sensors, and embedded control.',
  true,
  ARRAY['Hardware / Embedded Systems Lead'],
  '2026-08-15T15:30:00.000Z',
  '2026-08-15T15:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG26CS012',
  'PES1202601012',
  'Ishaan Gupta',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  2,
  'Male',
  'RR Campus',
  'ishaan.gupta@pes.edu',
  '9880556677',
  1,
  'https://github.com/ishaangupta',
  ARRAY['Backend', 'Full Stack', 'Data Engineering'],
  ARRAY['C++', 'Data Structures', 'Algorithms', 'Python', 'React'],
  'First year competitive programmer and enthusiastic builder excited to write hyper-optimized algorithms for SIH.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-15T16:00:00.000Z',
  '2026-08-15T16:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24DS075',
  'PES1202403075',
  'Sanjana Krishna',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  6,
  'Female',
  'EC Campus',
  'sanjana.krishna@pes.edu',
  '9880667788',
  4,
  'https://github.com/sanjanakrishna',
  ARRAY['Computer Vision', 'Deep Learning', 'IoT & Robotics'],
  ARRAY['YOLOv8', 'DeepStream', 'PyTorch', 'C++', 'OpenCV'],
  'Computer vision specialist working on low-latency video surveillance, automated inspection, and traffic analytics systems.',
  true,
  ARRAY['AI / ML Engineer', 'Team Lead'],
  '2026-08-15T16:30:00.000Z',
  '2026-08-15T16:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25DE018',
  'PES1202501018',
  'Aniket Joshi',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Design & Architecture',
  'DES',
  4,
  'Male',
  'RR Campus',
  'aniket.joshi@pes.edu',
  '9880778899',
  3,
  'https://github.com/aniketjoshi',
  ARRAY['UI/UX Design', 'Frontend', 'AR / VR'],
  ARRAY['Figma', 'Framer', 'Blender', 'User Research', 'Design Systems'],
  'Product designer focusing on human-centered UX design, design sprints, high-fidelity prototypes, and design systems.',
  true,
  ARRAY['UI/UX Designer', 'Domain / Pitch Specialist'],
  '2026-08-15T17:00:00.000Z',
  '2026-08-15T17:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS889',
  'PES1202504889',
  'Riya Sen',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'RR Campus',
  'riya.sen@pes.edu',
  '9880889900',
  3,
  'https://github.com/riyasen',
  ARRAY['Mobile App (Flutter/React Native)', 'Frontend', 'UI/UX Design'],
  ARRAY['Flutter', 'Dart', 'Firebase', 'Kotlin', 'REST APIs'],
  'Cross-platform mobile developer with 3 production app releases. Building responsive offline-first mobile apps for SIH.',
  true,
  ARRAY['Full Stack Developer', 'UI/UX Designer'],
  '2026-08-15T17:30:00.000Z',
  '2026-08-15T17:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24EE082',
  'PES1202402082',
  'Karthik Sridhar',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electrical & Electronics',
  'EEE',
  6,
  'Male',
  'RR Campus',
  'karthik.sridhar@pes.edu',
  '9880990011',
  2,
  'https://github.com/karthiksridhar',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Hardware / Embedded Systems Lead'],
  ARRAY['MATLAB', 'Altium Designer', 'Embedded C', 'BLE', 'Motor Drivers'],
  'EV powertrains, BMS (Battery Management Systems), and high-frequency power electronics engineer ready for EV hardware themes.',
  true,
  ARRAY['Hardware / Embedded Systems Lead'],
  '2026-08-15T18:00:00.000Z',
  '2026-08-15T18:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG23EC410',
  'PES1202304410',
  'Shweta Nambiar',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electronics & Communication',
  'ECE',
  8,
  'Female',
  'EC Campus',
  'shweta.nambiar@pes.edu',
  '9916001122',
  5,
  'https://github.com/shwetanambiar',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Cloud & DevOps'],
  ARRAY['LoRaWAN', 'Zigbee', 'Embedded C', 'Python', 'AWS IoT Core'],
  'Long-range low-power sensor networks and 5G edge computing researcher. Experienced leader with 5 national hackathon podiums.',
  true,
  ARRAY['Team Lead', 'Hardware / Embedded Systems Lead'],
  '2026-08-15T18:30:00.000Z',
  '2026-08-15T18:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25AM204',
  'PES1202502204',
  'Pranav Nair',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  4,
  'Male',
  'RR Campus',
  'pranav.nair@pes.edu',
  '9916112233',
  3,
  'https://github.com/pranavnair',
  ARRAY['Deep Learning', 'Machine Learning', 'Backend'],
  ARRAY['Stable-Baselines3', 'PyTorch', 'OpenAI Gym', 'FastAPI', 'NumPy'],
  'Reinforcement learning enthusiast building autonomous decision-making agents for smart traffic and logistics optimization.',
  true,
  ARRAY['AI / ML Engineer', 'Backend Specialist'],
  '2026-08-15T19:00:00.000Z',
  '2026-08-15T19:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS612',
  'PES1202503612',
  'Natasha D''Souza',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'EC Campus',
  'natasha.dsouza@pes.edu',
  '9916223344',
  2,
  'https://github.com/natashadsouza',
  ARRAY['Cybersecurity', 'Cloud & DevOps', 'Backend'],
  ARRAY['OWASP', 'Kubernetes Security', 'Go', 'Wireshark', 'Docker'],
  'DevSecOps & web security enthusiast ensuring that SIH systems are built with zero vulnerabilities and strong cryptography.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-15T19:30:00.000Z',
  '2026-08-15T19:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG26AM045',
  'PES1202602045',
  'Siddharth Menon',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  2,
  'Male',
  'RR Campus',
  'siddharth.menon@pes.edu',
  '9916334455',
  1,
  'https://github.com/siddharthmenon',
  ARRAY['Frontend', 'Machine Learning', 'UI/UX Design'],
  ARRAY['TypeScript', 'React', 'Three.js', 'OpenAI API', 'Tailwind CSS'],
  'Freshman passionate about creative frontend coding, interactive 3D canvases, and AI-assisted conversational interfaces.',
  true,
  ARRAY['Frontend Developer', 'UI/UX Designer'],
  '2026-08-15T20:00:00.000Z',
  '2026-08-15T20:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24ME067',
  'PES1202403067',
  'Bhavana Reddy',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Mechanical Engineering',
  'ME',
  6,
  'Female',
  'RR Campus',
  'bhavana.reddy@pes.edu',
  '9916445566',
  4,
  'https://github.com/bhavanareddy',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Computer Vision'],
  ARRAY['PX4 Autopilot', 'ArduPilot', 'ROS', 'SolidWorks', '3D Printing'],
  'Drone & UAV flight dynamics engineer with hands-on experience building autonomous mapping and search-and-rescue quadcopters.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'Team Lead'],
  '2026-08-15T20:30:00.000Z',
  '2026-08-15T20:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS920',
  'PES1202504920',
  'Tejas Nayak',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'tejas.nayak@pes.edu',
  '9916556677',
  3,
  'https://github.com/tejasnayak',
  ARRAY['Blockchain & Web3', 'Full Stack', 'Backend'],
  ARRAY['Solidity', 'IPFS', 'Ethereum', 'Wagmi', 'Next.js'],
  'Decentralized application developer passionate about verifiable credentials, governance DAOs, and transparent public registries.',
  true,
  ARRAY['Full Stack Developer', 'Backend Specialist'],
  '2026-08-15T21:00:00.000Z',
  '2026-08-15T21:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25DE033',
  'PES1202502033',
  'Aishwarya Pillai',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Design & Architecture',
  'DES',
  4,
  'Female',
  'RR Campus',
  'aishwarya.pillai@pes.edu',
  '9916667788',
  2,
  'https://github.com/aishwaryapillai',
  ARRAY['UI/UX Design', 'AR / VR', 'Frontend'],
  ARRAY['Figma', 'Spline 3D', 'Design Tokens', 'Tailwind CSS', 'Design Thinking'],
  'Visual and motion designer creating stunning pitch decks, micro-interactions, and high-impact UI themes for winning hackathon submissions.',
  true,
  ARRAY['UI/UX Designer', 'Domain / Pitch Specialist'],
  '2026-08-15T21:30:00.000Z',
  '2026-08-15T21:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG23CS150',
  'PES1202302150',
  'Vikramaditya Singh',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  8,
  'Male',
  'EC Campus',
  'vikram.singh@pes.edu',
  '9916778899',
  5,
  'https://github.com/vikramadityasingh',
  ARRAY['Cloud & DevOps', 'Backend', 'Data Engineering'],
  ARRAY['AWS Solutions Architect', 'Terraform', 'Kubernetes', 'Go', 'Prometheus'],
  'Final year cloud infrastructure specialist and 5-time hackathon organizer with extensive experience architecting production grade systems.',
  true,
  ARRAY['Team Lead', 'Backend Specialist'],
  '2026-08-15T22:00:00.000Z',
  '2026-08-15T22:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25BT032',
  'PES1202504032',
  'Keerthi Prasanna',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Biotechnology',
  'BT',
  4,
  'Female',
  'RR Campus',
  'keerthi.prasanna@pes.edu',
  '9916889900',
  2,
  'https://github.com/keerthiprasanna',
  ARRAY['Domain / Pitch Specialist', 'IoT & Robotics', 'Data Engineering'],
  ARRAY['Microfluidics', 'Python', 'OpenCV', 'Arduino', 'Biosensors'],
  'Biotech researcher building low-cost optical biosensors, water quality analysis rigs, and field diagnostics kits.',
  true,
  ARRAY['Domain / Pitch Specialist', 'Hardware / Embedded Systems Lead'],
  '2026-08-15T22:30:00.000Z',
  '2026-08-15T22:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EC190',
  'PES1202502190',
  'Rahul B',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electronics & Communication',
  'ECE',
  4,
  'Male',
  'RR Campus',
  'rahul.b@pes.edu',
  '9916990011',
  2,
  'https://github.com/rahulb-ece',
  ARRAY['Embedded Systems', 'IoT & Robotics', 'Deep Learning'],
  ARRAY['DSP', 'C++', 'TinyML', 'MATLAB', 'ARM Cortex'],
  'DSP and Edge AI engineer building voice-recognition trigger words and real-time audio anomaly detectors on microcontrollers.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'AI / ML Engineer'],
  '2026-08-15T23:00:00.000Z',
  '2026-08-15T23:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24CS512',
  'PES1202404512',
  'Samiksha Rao',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  6,
  'Female',
  'EC Campus',
  'samiksha.rao@pes.edu',
  '9920001122',
  3,
  'https://github.com/samiksharao',
  ARRAY['Data Engineering', 'Deep Learning', 'Backend'],
  ARRAY['CUDA', 'C++', 'Python', 'OpenMP', 'GPU Profiling'],
  'High performance GPU programmer accelerating matrix calculations, parallel graph traversal, and deep learning training loops.',
  true,
  ARRAY['AI / ML Engineer', 'Backend Specialist'],
  '2026-08-15T23:30:00.000Z',
  '2026-08-15T23:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EE095',
  'PES1202501095',
  'Gautham Krishnan',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electrical & Electronics',
  'EEE',
  4,
  'Male',
  'RR Campus',
  'gautham.krishnan@pes.edu',
  '9920112233',
  1,
  'https://github.com/gauthamkrishnan',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Full Stack'],
  ARRAY['Raspberry Pi', 'Yocto', 'MQTT', 'Python', 'Node-RED'],
  'Embedded Linux hacker building industrial IoT gateways, edge telemetry data collectors, and smart building energy meters.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'Full Stack Developer'],
  '2026-08-16T00:00:00.000Z',
  '2026-08-16T00:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24AM310',
  'PES1202403310',
  'Shruti Bhatt',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  6,
  'Female',
  'RR Campus',
  'shruti.bhatt@pes.edu',
  '9920223344',
  4,
  'https://github.com/shrutibhatt',
  ARRAY['Deep Learning', 'Natural Language Processing', 'Full Stack'],
  ARRAY['OpenAI Whisper', 'Librosa', 'PyTorch', 'FastAPI', 'React'],
  'Multimodal AI specialist building automated transcription, real-time accent translation, and speech-to-text assistive tech.',
  true,
  ARRAY['AI / ML Engineer', 'Team Lead'],
  '2026-08-16T00:30:00.000Z',
  '2026-08-16T00:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24CS402',
  'PES1202402402',
  'Aditi Deshpande',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  6,
  'Female',
  'RR Campus',
  'aditi.deshpande@pes.edu',
  '9920334455',
  4,
  'https://github.com/aditideshpande',
  ARRAY['Full Stack', 'Frontend', 'Backend'],
  ARRAY['Next.js', 'TypeScript', 'Apollo GraphQL', 'PostgreSQL', 'Tailwind CSS'],
  'Full stack engineer building rapid, type-safe web portals and real-time collaborative dashboards for SIH.',
  true,
  ARRAY['Full Stack Developer', 'Team Lead'],
  '2026-08-16T01:00:00.000Z',
  '2026-08-16T01:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EC115',
  'PES1202501115',
  'Manoj Kumar K',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electronics & Communication',
  'ECE',
  4,
  'Male',
  'RR Campus',
  'manoj.kumar@pes.edu',
  '9920445566',
  2,
  'https://github.com/manojkumar-ece',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Computer Vision'],
  ARRAY['ROS 2', 'C++', 'SLAM', 'LiDAR', 'Python'],
  'Autonomous navigation and SLAM robotics developer working on LiDAR-based mapping for search & rescue themes.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'AI / ML Engineer'],
  '2026-08-16T01:30:00.000Z',
  '2026-08-16T01:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25AM308',
  'PES1202503308',
  'Tanmayee Bhat',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  4,
  'Female',
  'RR Campus',
  'tanmayee.bhat@pes.edu',
  '9920556677',
  3,
  'https://github.com/tanmayeebhat',
  ARRAY['Machine Learning', 'Natural Language Processing', 'Full Stack'],
  ARRAY['LangChain', 'OpenAI API', 'Streamlit', 'ChromaDB', 'Python'],
  'AI solutions builder creating intelligent domain chatbots, document question-answering systems, and RAG pipelines.',
  true,
  ARRAY['AI / ML Engineer', 'Full Stack Developer'],
  '2026-08-16T02:00:00.000Z',
  '2026-08-16T02:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24ME091',
  'PES1202401091',
  'Abhishek N',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Mechanical Engineering',
  'ME',
  6,
  'Male',
  'EC Campus',
  'abhishek.n@pes.edu',
  '9920667788',
  3,
  'https://github.com/abhishekn-me',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Domain / Pitch Specialist'],
  ARRAY['ANSYS Fluent', 'PX4', 'SolidWorks', 'C++', 'Aerodynamics'],
  'UAV airframe and propulsion engineer with experience designing delivery drones and thermal flow analysis.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'Domain / Pitch Specialist'],
  '2026-08-16T02:30:00.000Z',
  '2026-08-16T02:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS330',
  'PES1202502330',
  'Siddhartha Roy',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'EC Campus',
  'siddhartha.roy@pes.edu',
  '9920778899',
  2,
  'https://github.com/siddhartharoy',
  ARRAY['Backend', 'Cloud & DevOps', 'Data Engineering'],
  ARRAY['Go', 'Redis', 'RabbitMQ', 'Docker', 'MongoDB'],
  'Backend systems engineer focused on high-speed event streaming, task queues, and resilient database replication.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-16T03:00:00.000Z',
  '2026-08-16T03:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25BT058',
  'PES1202503058',
  'Anwita Rao',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Biotechnology',
  'BT',
  4,
  'Female',
  'RR Campus',
  'anwita.rao@pes.edu',
  '9920889900',
  2,
  'https://github.com/anwitarao',
  ARRAY['Domain / Pitch Specialist', 'Data Engineering', 'Machine Learning'],
  ARRAY['Python', 'R', 'Biopython', 'Data Analytics', 'Genomics'],
  'Biotechnology enthusiast applying data science and synthetic biology for water safety and pathogen identification.',
  true,
  ARRAY['Domain / Pitch Specialist', 'Data Scientist / Analyst'],
  '2026-08-16T03:30:00.000Z',
  '2026-08-16T03:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24EE049',
  'PES1202401049',
  'Rohit Krishnan',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electrical & Electronics',
  'EEE',
  6,
  'Male',
  'RR Campus',
  'rohit.krishnan@pes.edu',
  '9930001122',
  3,
  'https://github.com/rohitkrishnan-ee',
  ARRAY['Embedded Systems', 'IoT & Robotics', 'Hardware / Embedded Systems Lead'],
  ARRAY['Embedded C', 'MATLAB', 'CAN Bus', 'KiCad', 'STM32'],
  'Automotive telemetry and BMS hardware engineer specializing in vehicle control units and industrial CAN buses.',
  true,
  ARRAY['Hardware / Embedded Systems Lead'],
  '2026-08-16T04:00:00.000Z',
  '2026-08-16T04:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25DE042',
  'PES1202504042',
  'Nandita Iyer',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Design & Architecture',
  'DES',
  4,
  'Female',
  'RR Campus',
  'nandita.iyer@pes.edu',
  '9930112233',
  3,
  'https://github.com/nanditaiyer',
  ARRAY['UI/UX Design', 'Frontend', 'AR / VR'],
  ARRAY['Figma', 'After Effects', 'Lottie', 'Tailwind CSS', 'User Journey Mapping'],
  'Product designer and motion specialist designing micro-interactions and high-converting presentation decks.',
  true,
  ARRAY['UI/UX Designer', 'Domain / Pitch Specialist'],
  '2026-08-16T04:30:00.000Z',
  '2026-08-16T04:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG26CS110',
  'PES1202602110',
  'Varun Shenoy',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  2,
  'Male',
  'RR Campus',
  'varun.shenoy@pes.edu',
  '9930223344',
  1,
  'https://github.com/varunshenoy',
  ARRAY['Backend', 'Data Engineering', 'Full Stack'],
  ARRAY['C++', 'Python', 'Competitive Programming', 'Graph Algorithms'],
  'Algorithm and graph optimization specialist passionate about routing algorithms and high performance computing.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-16T05:00:00.000Z',
  '2026-08-16T05:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24AM415',
  'PES1202404415',
  'Kavitha Sundar',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  6,
  'Female',
  'EC Campus',
  'kavitha.sundar@pes.edu',
  '9930334455',
  4,
  'https://github.com/kavithasundar',
  ARRAY['Computer Vision', 'Deep Learning', 'Cloud & DevOps'],
  ARRAY['PyTorch', 'OpenCV', 'TensorRT', 'FastAPI', 'Docker'],
  'Real-time AI video analytics and edge inference expert. Optimizing vision models for sub-20ms latency.',
  true,
  ARRAY['AI / ML Engineer', 'Team Lead'],
  '2026-08-16T05:30:00.000Z',
  '2026-08-16T05:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS780',
  'PES1202503780',
  'Prateek Hegde',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'prateek.hegde@pes.edu',
  '9930445566',
  4,
  'https://github.com/prateekhegde',
  ARRAY['Cloud & DevOps', 'Backend', 'Data Engineering'],
  ARRAY['Kubernetes', 'Helm', 'Prometheus', 'Grafana', 'Terraform', 'AWS'],
  'Site reliability and cloud DevOps specialist creating self-healing infrastructure, observability dashboards, and load-tested clusters.',
  true,
  ARRAY['Backend Specialist', 'Team Lead'],
  '2026-08-16T06:00:00.000Z',
  '2026-08-16T06:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EC420',
  'PES1202504420',
  'Meghana Murthy',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electronics & Communication',
  'ECE',
  4,
  'Female',
  'EC Campus',
  'meghana.murthy@pes.edu',
  '9930556677',
  2,
  'https://github.com/meghanamurthy',
  ARRAY['Embedded Systems', 'IoT & Robotics', 'Mobile App (Flutter/React Native)'],
  ARRAY['ESP32', 'Nordic nRF52', 'BLE', 'Embedded C', 'MQTT'],
  'Bluetooth Low Energy (BLE) and wearables developer connecting low-power smart hardware to mobile companion apps.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'Full Stack Developer'],
  '2026-08-16T06:30:00.000Z',
  '2026-08-16T06:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24CS670',
  'PES1202403670',
  'Vikas Chandran',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  6,
  'Male',
  'RR Campus',
  'vikas.chandran@pes.edu',
  '9930667788',
  3,
  'https://github.com/vikaschandran',
  ARRAY['Blockchain & Web3', 'Cybersecurity', 'Full Stack'],
  ARRAY['Solidity', 'Circom', 'Hardhat', 'Ethers.js', 'Next.js'],
  'Zero knowledge proof and blockchain privacy researcher creating tamper-proof citizen verification protocols.',
  true,
  ARRAY['Full Stack Developer', 'Backend Specialist'],
  '2026-08-16T07:00:00.000Z',
  '2026-08-16T07:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25AM190',
  'PES1202501190',
  'Aakash Somasekhar',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  4,
  'Male',
  'RR Campus',
  'aakash.soma@pes.edu',
  '9930778899',
  2,
  'https://github.com/aakashsomasekhar',
  ARRAY['Natural Language Processing', 'Data Engineering', 'Machine Learning'],
  ARRAY['Neo4j', 'LangChain', 'SentenceTransformers', 'Python', 'FastAPI'],
  'Knowledge graph architect combining graph databases with vector embeddings for hallucination-free legal and scientific research.',
  true,
  ARRAY['AI / ML Engineer', 'Backend Specialist'],
  '2026-08-16T07:30:00.000Z',
  '2026-08-16T07:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG23CS290',
  'PES1202303290',
  'Shreya Narayanan',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  8,
  'Female',
  'RR Campus',
  'shreya.narayanan@pes.edu',
  '9930889900',
  6,
  'https://github.com/shreyanarayanan',
  ARRAY['Full Stack', 'Cloud & DevOps', 'UI/UX Design'],
  ARRAY['React', 'Node.js', 'Microservices', 'System Design', 'CI/CD'],
  'Senior 4th year team captain, 6x hackathon winner, and full stack lead experienced in building complete end-to-end hackathon solutions.',
  true,
  ARRAY['Team Lead', 'Full Stack Developer'],
  '2026-08-16T08:00:00.000Z',
  '2026-08-16T08:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

-- 5. Seed all 40 PES University student hacker profiles
INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS698',
  'PES1202504729',
  'SUFIYAN TATAGAR',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'sufiyantatagar490@gmail.com',
  '8050895979',
  3,
  'https://github.com/ST490',
  ARRAY['Frontend', 'Backend', 'Full Stack'],
  ARRAY['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
  'Full Stack developer eager to build innovative solutions for SIH 2026.',
  true,
  ARRAY['Full Stack Developer', 'Team Lead'],
  '2026-08-14T20:35:30.654Z',
  '2026-08-14T20:35:54.679Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS309',
  'PES1202502309',
  'Mohammed Yusuf Ahmed',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'yusuf.ahmed@pes.edu',
  '8088421593',
  4,
  'https://github.com/yusufahmed',
  ARRAY['Frontend', 'Backend', 'Full Stack', 'Cloud & DevOps'],
  ARRAY['Next.js', 'Python', 'Docker', 'FastAPI'],
  'Experienced backend & systems architect looking for an enthusiastic team for SIH 2026.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-14T21:00:00.000Z',
  '2026-08-14T21:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25ME042',
  'PES1202501042',
  'SHREYAS SANJAY GAIKWAD',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Mechanical Engineering',
  'ME',
  3,
  'Male',
  'RR Campus',
  'shreyas.gaikwad@pes.edu',
  '9036296715',
  3,
  'https://github.com/shreyasgaikwad',
  ARRAY['Computer Vision', 'Natural Language Processing', 'IoT & Robotics'],
  ARRAY['PyTorch', 'ROS', 'OpenCV', 'Python'],
  'Self-driven builder and developer passionate about creating autonomous systems and AI hardware for SIH.',
  true,
  ARRAY['AI / ML Engineer', 'Hardware / Embedded Systems Lead'],
  '2026-08-14T21:30:00.000Z',
  '2026-08-14T21:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EE054',
  'PES1202503054',
  'MOHAMMAD SAFWAAN',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electrical & Electronics',
  'EEE',
  3,
  'Male',
  'RR Campus',
  'mohammad.safwaan@pes.edu',
  '8317452496',
  1,
  '',
  ARRAY['Frontend', 'Backend', 'Embedded Systems', 'IoT & Robotics'],
  ARRAY['Embedded C', 'JavaScript', 'Node.js'],
  'Ready to contribute frontend UI and IoT device integration for smart hardware problem statements.',
  true,
  ARRAY['Full Stack Developer', 'Hardware / Embedded Systems Lead'],
  '2026-08-14T22:00:00.000Z',
  '2026-08-14T22:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25AM513',
  'PES1202505513',
  'S BANUTEJA REDDY',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  4,
  'Male',
  'RR Campus',
  'banuteja.reddy@pes.edu',
  '9845012345',
  2,
  '',
  ARRAY['Machine Learning', 'Deep Learning', 'Backend'],
  ARRAY['Python', 'Scikit-Learn', 'TensorFlow', 'SQL'],
  'Focused on AI model training, predictive analytics, and scalable model deployment for SIH projects.',
  true,
  ARRAY['AI / ML Engineer', 'Backend Specialist'],
  '2026-08-15T00:00:00.000Z',
  '2026-08-15T00:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS696',
  'PES1202504696',
  'Spandana B M',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'RR Campus',
  'spandana.bm@pes.edu',
  '9845112233',
  3,
  'https://github.com/spandanabm',
  ARRAY['UI/UX Design', 'Frontend', 'Mobile App (Flutter/React Native)'],
  ARRAY['Figma', 'React', 'Tailwind CSS', 'Flutter'],
  'Passionate UI/UX designer and frontend developer. Experienced in designing accessible and sleek mobile/web products.',
  true,
  ARRAY['UI/UX Designer', 'Full Stack Developer'],
  '2026-08-15T07:30:00.000Z',
  '2026-08-15T07:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS716',
  'PES1202504716',
  'Chirag Kulkarni',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'chirag.kulkarni@pes.edu',
  '9845223344',
  2,
  'https://github.com/chiragkulkarni',
  ARRAY['Cloud & DevOps', 'Backend', 'Full Stack'],
  ARRAY['Docker', 'AWS', 'Node.js', 'Linux', 'Express'],
  'DevOps enthusiast with practical experience in CI/CD pipelines, container orchestration, and microservices.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-15T08:00:00.000Z',
  '2026-08-15T08:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS104',
  'PES1202501104',
  'Ananya Sharma',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'RR Campus',
  'ananya.sharma@pes.edu',
  '9901234567',
  5,
  'https://github.com/ananyasharma',
  ARRAY['Machine Learning', 'Natural Language Processing', 'Full Stack'],
  ARRAY['PyTorch', 'FastAPI', 'LangChain', 'React'],
  '5x hackathon winner specializing in LLMs and AI agent architectures. Looking for a passionate team for SIH 2026!',
  true,
  ARRAY['AI / ML Engineer', 'Team Lead'],
  '2026-08-15T08:30:00.000Z',
  '2026-08-15T08:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EC215',
  'PES1202501215',
  'Kavya Ramesh',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electronics & Communication',
  'ECE',
  4,
  'Female',
  'EC Campus',
  'kavya.ramesh@pes.edu',
  '9741098765',
  2,
  'https://github.com/kavyaramesh',
  ARRAY['Embedded Systems', 'IoT & Robotics', 'Hardware / Embedded Systems Lead'],
  ARRAY['ESP32', 'Arduino', 'C++', 'TinyML'],
  'ECE hardware hacker building smart IoT sensors and edge computing devices for smart city and agri-tech challenges.',
  true,
  ARRAY['Hardware / Embedded Systems Lead'],
  '2026-08-15T09:00:00.000Z',
  '2026-08-15T09:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS442',
  'PES1202503442',
  'Rohan Varma',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'EC Campus',
  'rohan.varma@pes.edu',
  '9845334455',
  3,
  'https://github.com/rohanvarma',
  ARRAY['Cloud & DevOps', 'Backend', 'Data Engineering'],
  ARRAY['AWS', 'Kubernetes', 'Go', 'PostgreSQL', 'Terraform'],
  'Cloud infra engineer passionate about building high-availability backends and scalable microservices architectures.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-15T09:30:00.000Z',
  '2026-08-15T09:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25BT019',
  'PES1202502019',
  'Pooja Hegde',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Biotechnology',
  'BT',
  4,
  'Female',
  'RR Campus',
  'pooja.hegde@pes.edu',
  '9845445566',
  2,
  'https://github.com/poojahegde',
  ARRAY['Data Engineering', 'Machine Learning', 'Domain / Pitch Specialist'],
  ARRAY['BioPython', 'R', 'Python', 'Data Analytics'],
  'Biotech student bridging computational biology with health-tech AI solutions for SIH MedTech problem statements.',
  true,
  ARRAY['Domain / Pitch Specialist', 'AI / ML Engineer'],
  '2026-08-15T10:00:00.000Z',
  '2026-08-15T10:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CY118',
  'PES1202504118',
  'Aditya Kulkarni',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'aditya.kulkarni@pes.edu',
  '9900112233',
  4,
  'https://github.com/adityakulkarni',
  ARRAY['Cybersecurity', 'Blockchain & Web3', 'Backend'],
  ARRAY['Solidity', 'Rust', 'Penetration Testing', 'Node.js'],
  'Smart contract auditor and security researcher. Keen on Web3, zero-knowledge proofs, and secure digital identity.',
  true,
  ARRAY['Backend Specialist', 'Team Lead'],
  '2026-08-15T10:30:00.000Z',
  '2026-08-15T10:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS550',
  'PES1202503550',
  'Tanvi Deshmukh',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'EC Campus',
  'tanvi.deshmukh@pes.edu',
  '9845556677',
  1,
  'https://github.com/tanvideshmukh',
  ARRAY['AR / VR', 'Frontend', 'UI/UX Design'],
  ARRAY['Three.js', 'Unity', 'WebGL', 'React', 'Tailwind CSS'],
  'Creative 3D web developer building immersive spatial computing and AR/VR web experiences for SIH.',
  true,
  ARRAY['Frontend Developer', 'UI/UX Designer'],
  '2026-08-15T11:00:00.000Z',
  '2026-08-15T11:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25DS033',
  'PES1202505033',
  'Deepak Sundaram',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'deepak.sundaram@pes.edu',
  '9845667788',
  2,
  'https://github.com/deepaksundaram',
  ARRAY['Deep Learning', 'Computer Vision', 'Cloud & DevOps'],
  ARRAY['TensorFlow', 'OpenCV', 'MLflow', 'Python', 'FastAPI'],
  'Passionate about real-time vision pipelines, object tracking, and deploying optimized models on edge hardware.',
  true,
  ARRAY['AI / ML Engineer', 'Backend Specialist'],
  '2026-08-15T11:30:00.000Z',
  '2026-08-15T11:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25DS108',
  'PES1202505108',
  'Meera Nandakumar',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'RR Campus',
  'meera.nandakumar@pes.edu',
  '9880011224',
  3,
  'https://github.com/meerananda',
  ARRAY['Data Engineering', 'Full Stack', 'Machine Learning'],
  ARRAY['Pandas', 'Scikit-Learn', 'React', 'Node.js', 'SQL'],
  'Data scientist & full stack engineer experienced in building data-driven dashboards and smart recommendation systems.',
  true,
  ARRAY['Full Stack Developer', 'AI / ML Engineer'],
  '2026-08-15T12:00:00.000Z',
  '2026-08-15T12:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24CS201',
  'PES1202401201',
  'Aarav Patel',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  6,
  'Male',
  'RR Campus',
  'aarav.patel@pes.edu',
  '9845778899',
  4,
  'https://github.com/aaravpatel',
  ARRAY['Backend', 'Cloud & DevOps', 'Data Engineering'],
  ARRAY['Go', 'gRPC', 'Apache Kafka', 'Redis', 'PostgreSQL'],
  'Distributed systems engineer focused on fault-tolerant message queues, microservices, and high-throughput real-time pipelines.',
  true,
  ARRAY['Backend Specialist', 'Team Lead'],
  '2026-08-15T12:30:00.000Z',
  '2026-08-15T12:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24AM112',
  'PES1202402112',
  'Sneha Ranganathan',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  6,
  'Female',
  'RR Campus',
  'sneha.ranga@pes.edu',
  '9845889900',
  5,
  'https://github.com/sneharanga',
  ARRAY['Natural Language Processing', 'Deep Learning', 'Machine Learning'],
  ARRAY['LLMs', 'Hugging Face', 'RAG', 'LangGraph', 'Python'],
  'Specialized in multi-agent generative AI, retrieval-augmented generation (RAG), and fine-tuning open-source LLMs.',
  true,
  ARRAY['AI / ML Engineer', 'Team Lead'],
  '2026-08-15T13:00:00.000Z',
  '2026-08-15T13:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EC340',
  'PES1202503340',
  'Varun Rao',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electronics & Communication',
  'ECE',
  4,
  'Male',
  'EC Campus',
  'varun.rao@pes.edu',
  '9845990011',
  2,
  'https://github.com/varunrao',
  ARRAY['Embedded Systems', 'IoT & Robotics', 'Hardware / Embedded Systems Lead'],
  ARRAY['Verilog', 'STM32', 'FreeRTOS', 'C++', 'Circuit Design'],
  'VLSI and RTOS developer passionate about firmware engineering, FPGA accelerators, and hardware-software co-design.',
  true,
  ARRAY['Hardware / Embedded Systems Lead'],
  '2026-08-15T13:30:00.000Z',
  '2026-08-15T13:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG23CS088',
  'PES1202301088',
  'Priya Sundaresan',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  8,
  'Female',
  'RR Campus',
  'priya.sundar@pes.edu',
  '9880112233',
  6,
  'https://github.com/priyasundar',
  ARRAY['Full Stack', 'Cloud & DevOps', 'UI/UX Design'],
  ARRAY['Next.js 14', 'GraphQL', 'Docker', 'Google Cloud', 'TypeScript'],
  'Senior full-stack architect & veteran SIH finalist. Loves mentoring teams and crafting rapid production-ready prototypes.',
  true,
  ARRAY['Team Lead', 'Full Stack Developer'],
  '2026-08-15T14:00:00.000Z',
  '2026-08-15T14:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25ME105',
  'PES1202502105',
  'Nihal Gowda',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Mechanical Engineering',
  'ME',
  4,
  'Male',
  'RR Campus',
  'nihal.gowda@pes.edu',
  '9880223344',
  1,
  'https://github.com/nihalgowda',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Domain / Pitch Specialist'],
  ARRAY['SolidWorks', 'ANSYS', 'ROS 2', 'Python', 'CAN Bus'],
  'Robotics kinematics designer and CAD specialist ready to build autonomous mobile robots (AMR) and smart agritech rovers.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'Domain / Pitch Specialist'],
  '2026-08-15T14:30:00.000Z',
  '2026-08-15T14:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25BT044',
  'PES1202503044',
  'Divya Chandrashekar',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Biotechnology',
  'BT',
  4,
  'Female',
  'RR Campus',
  'divya.chandra@pes.edu',
  '9880334455',
  3,
  'https://github.com/divyachandra',
  ARRAY['Data Engineering', 'Machine Learning', 'Domain / Pitch Specialist'],
  ARRAY['BioConductor', 'Python', 'Nextflow', 'PyMOL', 'Bioinformatics'],
  'Computational biologist passionate about protein folding prediction, genomics pipelines, and drug discovery AI tools.',
  true,
  ARRAY['Domain / Pitch Specialist', 'AI / ML Engineer'],
  '2026-08-15T15:00:00.000Z',
  '2026-08-15T15:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EE120',
  'PES1202504120',
  'Harish Venkatesh',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electrical & Electronics',
  'EEE',
  4,
  'Male',
  'EC Campus',
  'harish.venkat@pes.edu',
  '9880445566',
  2,
  'https://github.com/harishvenkat',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Cloud & DevOps'],
  ARRAY['MATLAB/Simulink', 'ESP32', 'MQTT', 'KiCad', 'Power Electronics'],
  'Smart grid and green energy developer with experience in microgrid telemetry, telemetry sensors, and embedded control.',
  true,
  ARRAY['Hardware / Embedded Systems Lead'],
  '2026-08-15T15:30:00.000Z',
  '2026-08-15T15:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG26CS012',
  'PES1202601012',
  'Ishaan Gupta',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  2,
  'Male',
  'RR Campus',
  'ishaan.gupta@pes.edu',
  '9880556677',
  1,
  'https://github.com/ishaangupta',
  ARRAY['Backend', 'Full Stack', 'Data Engineering'],
  ARRAY['C++', 'Data Structures', 'Algorithms', 'Python', 'React'],
  'First year competitive programmer and enthusiastic builder excited to write hyper-optimized algorithms for SIH.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-15T16:00:00.000Z',
  '2026-08-15T16:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24DS075',
  'PES1202403075',
  'Sanjana Krishna',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  6,
  'Female',
  'EC Campus',
  'sanjana.krishna@pes.edu',
  '9880667788',
  4,
  'https://github.com/sanjanakrishna',
  ARRAY['Computer Vision', 'Deep Learning', 'IoT & Robotics'],
  ARRAY['YOLOv8', 'DeepStream', 'PyTorch', 'C++', 'OpenCV'],
  'Computer vision specialist working on low-latency video surveillance, automated inspection, and traffic analytics systems.',
  true,
  ARRAY['AI / ML Engineer', 'Team Lead'],
  '2026-08-15T16:30:00.000Z',
  '2026-08-15T16:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25DE018',
  'PES1202501018',
  'Aniket Joshi',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Design & Architecture',
  'DES',
  4,
  'Male',
  'RR Campus',
  'aniket.joshi@pes.edu',
  '9880778899',
  3,
  'https://github.com/aniketjoshi',
  ARRAY['UI/UX Design', 'Frontend', 'AR / VR'],
  ARRAY['Figma', 'Framer', 'Blender', 'User Research', 'Design Systems'],
  'Product designer focusing on human-centered UX design, design sprints, high-fidelity prototypes, and design systems.',
  true,
  ARRAY['UI/UX Designer', 'Domain / Pitch Specialist'],
  '2026-08-15T17:00:00.000Z',
  '2026-08-15T17:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS889',
  'PES1202504889',
  'Riya Sen',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'RR Campus',
  'riya.sen@pes.edu',
  '9880889900',
  3,
  'https://github.com/riyasen',
  ARRAY['Mobile App (Flutter/React Native)', 'Frontend', 'UI/UX Design'],
  ARRAY['Flutter', 'Dart', 'Firebase', 'Kotlin', 'REST APIs'],
  'Cross-platform mobile developer with 3 production app releases. Building responsive offline-first mobile apps for SIH.',
  true,
  ARRAY['Full Stack Developer', 'UI/UX Designer'],
  '2026-08-15T17:30:00.000Z',
  '2026-08-15T17:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24EE082',
  'PES1202402082',
  'Karthik Sridhar',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electrical & Electronics',
  'EEE',
  6,
  'Male',
  'RR Campus',
  'karthik.sridhar@pes.edu',
  '9880990011',
  2,
  'https://github.com/karthiksridhar',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Hardware / Embedded Systems Lead'],
  ARRAY['MATLAB', 'Altium Designer', 'Embedded C', 'BLE', 'Motor Drivers'],
  'EV powertrains, BMS (Battery Management Systems), and high-frequency power electronics engineer ready for EV hardware themes.',
  true,
  ARRAY['Hardware / Embedded Systems Lead'],
  '2026-08-15T18:00:00.000Z',
  '2026-08-15T18:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG23EC410',
  'PES1202304410',
  'Shweta Nambiar',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electronics & Communication',
  'ECE',
  8,
  'Female',
  'EC Campus',
  'shweta.nambiar@pes.edu',
  '9916001122',
  5,
  'https://github.com/shwetanambiar',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Cloud & DevOps'],
  ARRAY['LoRaWAN', 'Zigbee', 'Embedded C', 'Python', 'AWS IoT Core'],
  'Long-range low-power sensor networks and 5G edge computing researcher. Experienced leader with 5 national hackathon podiums.',
  true,
  ARRAY['Team Lead', 'Hardware / Embedded Systems Lead'],
  '2026-08-15T18:30:00.000Z',
  '2026-08-15T18:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25AM204',
  'PES1202502204',
  'Pranav Nair',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  4,
  'Male',
  'RR Campus',
  'pranav.nair@pes.edu',
  '9916112233',
  3,
  'https://github.com/pranavnair',
  ARRAY['Deep Learning', 'Machine Learning', 'Backend'],
  ARRAY['Stable-Baselines3', 'PyTorch', 'OpenAI Gym', 'FastAPI', 'NumPy'],
  'Reinforcement learning enthusiast building autonomous decision-making agents for smart traffic and logistics optimization.',
  true,
  ARRAY['AI / ML Engineer', 'Backend Specialist'],
  '2026-08-15T19:00:00.000Z',
  '2026-08-15T19:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS612',
  'PES1202503612',
  'Natasha D''Souza',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Female',
  'EC Campus',
  'natasha.dsouza@pes.edu',
  '9916223344',
  2,
  'https://github.com/natashadsouza',
  ARRAY['Cybersecurity', 'Cloud & DevOps', 'Backend'],
  ARRAY['OWASP', 'Kubernetes Security', 'Go', 'Wireshark', 'Docker'],
  'DevSecOps & web security enthusiast ensuring that SIH systems are built with zero vulnerabilities and strong cryptography.',
  true,
  ARRAY['Backend Specialist', 'Full Stack Developer'],
  '2026-08-15T19:30:00.000Z',
  '2026-08-15T19:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG26AM045',
  'PES1202602045',
  'Siddharth Menon',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  2,
  'Male',
  'RR Campus',
  'siddharth.menon@pes.edu',
  '9916334455',
  1,
  'https://github.com/siddharthmenon',
  ARRAY['Frontend', 'Machine Learning', 'UI/UX Design'],
  ARRAY['TypeScript', 'React', 'Three.js', 'OpenAI API', 'Tailwind CSS'],
  'Freshman passionate about creative frontend coding, interactive 3D canvases, and AI-assisted conversational interfaces.',
  true,
  ARRAY['Frontend Developer', 'UI/UX Designer'],
  '2026-08-15T20:00:00.000Z',
  '2026-08-15T20:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24ME067',
  'PES1202403067',
  'Bhavana Reddy',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Mechanical Engineering',
  'ME',
  6,
  'Female',
  'RR Campus',
  'bhavana.reddy@pes.edu',
  '9916445566',
  4,
  'https://github.com/bhavanareddy',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Computer Vision'],
  ARRAY['PX4 Autopilot', 'ArduPilot', 'ROS', 'SolidWorks', '3D Printing'],
  'Drone & UAV flight dynamics engineer with hands-on experience building autonomous mapping and search-and-rescue quadcopters.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'Team Lead'],
  '2026-08-15T20:30:00.000Z',
  '2026-08-15T20:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25CS920',
  'PES1202504920',
  'Tejas Nayak',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  4,
  'Male',
  'RR Campus',
  'tejas.nayak@pes.edu',
  '9916556677',
  3,
  'https://github.com/tejasnayak',
  ARRAY['Blockchain & Web3', 'Full Stack', 'Backend'],
  ARRAY['Solidity', 'IPFS', 'Ethereum', 'Wagmi', 'Next.js'],
  'Decentralized application developer passionate about verifiable credentials, governance DAOs, and transparent public registries.',
  true,
  ARRAY['Full Stack Developer', 'Backend Specialist'],
  '2026-08-15T21:00:00.000Z',
  '2026-08-15T21:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25DE033',
  'PES1202502033',
  'Aishwarya Pillai',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Design & Architecture',
  'DES',
  4,
  'Female',
  'RR Campus',
  'aishwarya.pillai@pes.edu',
  '9916667788',
  2,
  'https://github.com/aishwaryapillai',
  ARRAY['UI/UX Design', 'AR / VR', 'Frontend'],
  ARRAY['Figma', 'Spline 3D', 'Design Tokens', 'Tailwind CSS', 'Design Thinking'],
  'Visual and motion designer creating stunning pitch decks, micro-interactions, and high-impact UI themes for winning hackathon submissions.',
  true,
  ARRAY['UI/UX Designer', 'Domain / Pitch Specialist'],
  '2026-08-15T21:30:00.000Z',
  '2026-08-15T21:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG23CS150',
  'PES1202302150',
  'Vikramaditya Singh',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  8,
  'Male',
  'EC Campus',
  'vikram.singh@pes.edu',
  '9916778899',
  5,
  'https://github.com/vikramadityasingh',
  ARRAY['Cloud & DevOps', 'Backend', 'Data Engineering'],
  ARRAY['AWS Solutions Architect', 'Terraform', 'Kubernetes', 'Go', 'Prometheus'],
  'Final year cloud infrastructure specialist and 5-time hackathon organizer with extensive experience architecting production grade systems.',
  true,
  ARRAY['Team Lead', 'Backend Specialist'],
  '2026-08-15T22:00:00.000Z',
  '2026-08-15T22:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25BT032',
  'PES1202504032',
  'Keerthi Prasanna',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Biotechnology',
  'BT',
  4,
  'Female',
  'RR Campus',
  'keerthi.prasanna@pes.edu',
  '9916889900',
  2,
  'https://github.com/keerthiprasanna',
  ARRAY['Domain / Pitch Specialist', 'IoT & Robotics', 'Data Engineering'],
  ARRAY['Microfluidics', 'Python', 'OpenCV', 'Arduino', 'Biosensors'],
  'Biotech researcher building low-cost optical biosensors, water quality analysis rigs, and field diagnostics kits.',
  true,
  ARRAY['Domain / Pitch Specialist', 'Hardware / Embedded Systems Lead'],
  '2026-08-15T22:30:00.000Z',
  '2026-08-15T22:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EC190',
  'PES1202502190',
  'Rahul B',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electronics & Communication',
  'ECE',
  4,
  'Male',
  'RR Campus',
  'rahul.b@pes.edu',
  '9916990011',
  2,
  'https://github.com/rahulb-ece',
  ARRAY['Embedded Systems', 'IoT & Robotics', 'Deep Learning'],
  ARRAY['DSP', 'C++', 'TinyML', 'MATLAB', 'ARM Cortex'],
  'DSP and Edge AI engineer building voice-recognition trigger words and real-time audio anomaly detectors on microcontrollers.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'AI / ML Engineer'],
  '2026-08-15T23:00:00.000Z',
  '2026-08-15T23:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24CS512',
  'PES1202404512',
  'Samiksha Rao',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Computer Science & Engineering',
  'CSE',
  6,
  'Female',
  'EC Campus',
  'samiksha.rao@pes.edu',
  '9920001122',
  3,
  'https://github.com/samiksharao',
  ARRAY['Data Engineering', 'Deep Learning', 'Backend'],
  ARRAY['CUDA', 'C++', 'Python', 'OpenMP', 'GPU Profiling'],
  'High performance GPU programmer accelerating matrix calculations, parallel graph traversal, and deep learning training loops.',
  true,
  ARRAY['AI / ML Engineer', 'Backend Specialist'],
  '2026-08-15T23:30:00.000Z',
  '2026-08-15T23:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG25EE095',
  'PES1202501095',
  'Gautham Krishnan',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'Electrical & Electronics',
  'EEE',
  4,
  'Male',
  'RR Campus',
  'gautham.krishnan@pes.edu',
  '9920112233',
  1,
  'https://github.com/gauthamkrishnan',
  ARRAY['IoT & Robotics', 'Embedded Systems', 'Full Stack'],
  ARRAY['Raspberry Pi', 'Yocto', 'MQTT', 'Python', 'Node-RED'],
  'Embedded Linux hacker building industrial IoT gateways, edge telemetry data collectors, and smart building energy meters.',
  true,
  ARRAY['Hardware / Embedded Systems Lead', 'Full Stack Developer'],
  '2026-08-16T00:00:00.000Z',
  '2026-08-16T00:00:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  'PES1UG24AM310',
  'PES1202403310',
  'Shruti Bhatt',
  'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
  '6ba6e622de36c13856a706ed64d09842',
  'AI & Machine Learning',
  'AIML',
  6,
  'Female',
  'RR Campus',
  'shruti.bhatt@pes.edu',
  '9920223344',
  4,
  'https://github.com/shrutibhatt',
  ARRAY['Deep Learning', 'Natural Language Processing', 'Full Stack'],
  ARRAY['OpenAI Whisper', 'Librosa', 'PyTorch', 'FastAPI', 'React'],
  'Multimodal AI specialist building automated transcription, real-time accent translation, and speech-to-text assistive tech.',
  true,
  ARRAY['AI / ML Engineer', 'Team Lead'],
  '2026-08-16T00:30:00.000Z',
  '2026-08-16T00:30:00.000Z'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;

