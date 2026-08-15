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
      semester: 4,
      gender: 'Male',
      campus: 'RR Campus',
      email: 'sufiyantatagar490@gmail.com',
      phone: '8050895979',
      photo_url: '',
      hackathon_count: 3,
      github_url: '',
      interests: ['Frontend', 'Backend', 'Full Stack'],
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      bio: 'Full Stack developer eager to build innovative solutions for SIH 2026.',
      looking_for_team: true,
      preferred_roles: ['Full Stack Developer'],
      created_at: '2026-08-14T20:35:30.654Z',
      updated_at: '2026-08-14T20:35:54.679Z',
    },
    {
      srn: 'PES1UG25CS309',
      prn: 'PES1202502309',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'Mohammed Yusuf Ahmed',
      department: 'Computer Science and Engineering',
      branch: 'CSE',
      semester: 4,
      gender: 'Male',
      campus: 'RR Campus',
      email: 'yusuf.ahmed@pes.edu',
      phone: '8088421593',
      photo_url: '',
      hackathon_count: 4,
      github_url: 'https://github.com/yusufahmed',
      interests: ['Frontend', 'Backend', 'Full Stack', 'Cloud Computing'],
      skills: ['Next.js', 'Python', 'Docker', 'FastAPI'],
      bio: 'Experienced backend & systems architect looking for an enthusiastic team for SIH 2026.',
      looking_for_team: true,
      preferred_roles: ['Backend Developer', 'Full Stack Developer'],
      created_at: '2026-08-14T21:00:00.000Z',
      updated_at: '2026-08-14T21:00:00.000Z',
    },
    {
      srn: 'PES1UG25ME042',
      prn: 'PES1202501042',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'SHREYAS SANJAY GAIKWAD',
      department: 'Mechanical Engineering',
      branch: 'ME',
      semester: 3,
      gender: 'Male',
      campus: 'RR Campus',
      email: 'shreyas.gaikwad@pes.edu',
      phone: '9036296715',
      photo_url: '',
      hackathon_count: 3,
      github_url: 'https://github.com/shreyasgaikwad',
      interests: ['Computer Vision', 'Natural Language Processing', 'Robotics'],
      skills: ['PyTorch', 'ROS', 'OpenCV', 'Python'],
      bio: 'Self-driven builder and developer passionate about creating autonomous systems and AI hardware for SIH.',
      looking_for_team: true,
      preferred_roles: ['AI / ML Engineer', 'Hardware / IoT Specialist'],
      created_at: '2026-08-14T21:30:00.000Z',
      updated_at: '2026-08-14T21:30:00.000Z',
    },
    {
      srn: 'PES1UG25EE054',
      prn: 'PES1202503054',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'MOHAMMAD SAFWAAN',
      department: 'Electrical & Electronics',
      branch: 'EEE',
      semester: 3,
      gender: 'Male',
      campus: 'RR Campus',
      email: 'mohammad.safwaan@pes.edu',
      phone: '8317452496',
      photo_url: '',
      hackathon_count: 0,
      github_url: '',
      interests: ['Frontend', 'Backend', 'IoT / Embedded'],
      skills: ['Embedded C', 'JavaScript', 'Node.js'],
      bio: 'Ready to contribute frontend UI and IoT device integration for smart hardware problem statements.',
      looking_for_team: true,
      preferred_roles: ['Frontend Developer', 'Hardware / IoT Specialist'],
      created_at: '2026-08-14T22:00:00.000Z',
      updated_at: '2026-08-14T22:00:00.000Z',
    },
    {
      srn: 'PES1UG25AM513',
      prn: 'PES1202505513',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'S BANUTEJA REDDY',
      department: 'Computer Science and Engineering',
      branch: 'AIML',
      semester: 4,
      gender: 'Male',
      campus: 'RR Campus',
      email: 'banuteja.reddy@pes.edu',
      phone: '',
      photo_url: '',
      hackathon_count: 0,
      github_url: '',
      interests: ['Frontend', 'Backend', 'Machine Learning'],
      skills: ['TensorFlow', 'Python', 'React'],
      bio: 'AI/ML enthusiast focused on predictive models and clean web interfaces for SIH 2026.',
      looking_for_team: true,
      preferred_roles: ['AI / ML Engineer', 'Backend Developer'],
      created_at: '2026-08-14T22:30:00.000Z',
      updated_at: '2026-08-14T22:30:00.000Z',
    },
    {
      srn: 'PES1UG25CS696',
      prn: 'PES1202504696',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'Spandana B M',
      department: 'Computer Science and Engineering',
      branch: 'CSE',
      semester: 4,
      gender: 'Female',
      campus: 'RR Campus',
      email: 'spandana.bm@pes.edu',
      phone: '',
      photo_url: '',
      hackathon_count: 0,
      github_url: '',
      interests: ['Frontend', 'UI/UX Design', 'Cloud Computing'],
      skills: ['Figma', 'React', 'CSS3', 'Tailwind'],
      bio: 'UI/UX Designer and Frontend developer passionate about building intuitive user-centric apps for SIH.',
      looking_for_team: true,
      preferred_roles: ['UI / UX Designer', 'Frontend Developer'],
      created_at: '2026-08-14T23:00:00.000Z',
      updated_at: '2026-08-14T23:00:00.000Z',
    },
    {
      srn: 'PES1UG25CS716',
      prn: 'PES1202504716',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'PESU Student (CS716)',
      department: 'Computer Science and Engineering',
      branch: 'CSE',
      semester: 4,
      gender: 'Male',
      campus: 'RR Campus',
      email: 'pes1ug25cs716@pes.edu',
      phone: '',
      photo_url: '',
      hackathon_count: 1,
      github_url: '',
      interests: ['Frontend', 'Backend', 'Mobile Development'],
      skills: ['Flutter', 'TypeScript', 'Node.js'],
      bio: 'Full Stack & Mobile developer eager to build innovative solutions for SIH 2026.',
      looking_for_team: true,
      preferred_roles: ['Full Stack Developer', 'Mobile Developer'],
      created_at: '2026-08-15T08:00:00.000Z',
      updated_at: '2026-08-15T08:00:00.000Z',
    },
    {
      srn: 'PES1UG25CS104',
      prn: 'PES1202500104',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'Ananya Sharma',
      department: 'Computer Science and Engineering',
      branch: 'CSE',
      semester: 4,
      gender: 'Female',
      campus: 'RR Campus',
      email: 'ananya.sharma@pes.edu',
      phone: '9845012345',
      photo_url: '',
      hackathon_count: 5,
      github_url: 'https://github.com/ananyasharma',
      interests: ['Natural Language Processing', 'Machine Learning', 'Full Stack'],
      skills: ['PyTorch', 'FastAPI', 'LangChain', 'React'],
      bio: '5x hackathon winner specializing in LLMs and AI agent architectures. Looking for a passionate team for SIH 2026!',
      looking_for_team: true,
      preferred_roles: ['AI / ML Engineer', 'Team Lead / PM'],
      created_at: '2026-08-15T08:30:00.000Z',
      updated_at: '2026-08-15T08:30:00.000Z',
    },
    {
      srn: 'PES1UG25EC215',
      prn: 'PES1202501215',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'Kavya Ramesh',
      department: 'Electronics & Communication',
      branch: 'ECE',
      semester: 4,
      gender: 'Female',
      campus: 'EC Campus',
      email: 'kavya.ramesh@pes.edu',
      phone: '9741098765',
      photo_url: '',
      hackathon_count: 2,
      github_url: 'https://github.com/kavyaramesh',
      interests: ['IoT / Embedded', 'Robotics', 'Edge AI'],
      skills: ['ESP32', 'Arduino', 'C++', 'TinyML'],
      bio: 'ECE hardware hacker building smart IoT sensors and edge computing devices for smart city and agri-tech challenges.',
      looking_for_team: true,
      preferred_roles: ['Hardware / IoT Specialist'],
      created_at: '2026-08-15T09:00:00.000Z',
      updated_at: '2026-08-15T09:00:00.000Z',
    },
    {
      srn: 'PES1UG25CS442',
      prn: 'PES1202503442',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'Rohan Varma',
      department: 'Computer Science and Engineering',
      branch: 'CSE',
      semester: 4,
      gender: 'Male',
      campus: 'EC Campus',
      email: 'rohan.varma@pes.edu',
      phone: '',
      photo_url: '',
      hackathon_count: 3,
      github_url: 'https://github.com/rohanvarma',
      interests: ['Cloud Computing', 'Backend', 'DevOps'],
      skills: ['AWS', 'Kubernetes', 'Go', 'PostgreSQL', 'Terraform'],
      bio: 'Cloud infra engineer passionate about building high-availability backends and scalable microservices architectures.',
      looking_for_team: true,
      preferred_roles: ['DevOps / Cloud Architect', 'Backend Developer'],
      created_at: '2026-08-15T09:30:00.000Z',
      updated_at: '2026-08-15T09:30:00.000Z',
    },
    {
      srn: 'PES1UG25BT019',
      prn: 'PES1202502019',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'Pooja Hegde',
      department: 'Biotechnology',
      branch: 'BT',
      semester: 4,
      gender: 'Female',
      campus: 'RR Campus',
      email: 'pooja.hegde@pes.edu',
      phone: '',
      photo_url: '',
      hackathon_count: 2,
      github_url: '',
      interests: ['Data Science', 'Healthcare Tech', 'Bioinformatics'],
      skills: ['BioPython', 'R', 'Python', 'Data Analytics'],
      bio: 'Biotech student bridging computational biology with health-tech AI solutions for SIH MedTech problem statements.',
      looking_for_team: true,
      preferred_roles: ['Data Scientist / Analyst', 'Domain Specialist'],
      created_at: '2026-08-15T10:00:00.000Z',
      updated_at: '2026-08-15T10:00:00.000Z',
    },
    {
      srn: 'PES1UG25CY118',
      prn: 'PES1202504118',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'Aditya Kulkarni',
      department: 'Computer Science and Engineering',
      branch: 'CSE',
      semester: 4,
      gender: 'Male',
      campus: 'RR Campus',
      email: 'aditya.kulkarni@pes.edu',
      phone: '9900112233',
      photo_url: '',
      hackathon_count: 4,
      github_url: 'https://github.com/adityakulkarni',
      interests: ['Cybersecurity', 'Blockchain / Web3', 'Backend'],
      skills: ['Solidity', 'Rust', 'Penetration Testing', 'Node.js'],
      bio: 'Smart contract auditor and security researcher. Keen on Web3, zero-knowledge proofs, and secure digital identity.',
      looking_for_team: true,
      preferred_roles: ['Blockchain / Web3 Dev', 'Security Specialist'],
      created_at: '2026-08-15T10:30:00.000Z',
      updated_at: '2026-08-15T10:30:00.000Z',
    },
    {
      srn: 'PES1UG25CS550',
      prn: 'PES1202503550',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'Tanvi Deshmukh',
      department: 'Computer Science and Engineering',
      branch: 'CSE',
      semester: 4,
      gender: 'Female',
      campus: 'EC Campus',
      email: 'tanvi.deshmukh@pes.edu',
      phone: '',
      photo_url: '',
      hackathon_count: 1,
      github_url: '',
      interests: ['AR / VR / XR', 'Frontend', 'Game Development'],
      skills: ['Three.js', 'Unity', 'WebGL', 'React', 'Tailwind'],
      bio: 'Creative 3D web developer building immersive spatial computing and AR/VR web experiences for SIH.',
      looking_for_team: true,
      preferred_roles: ['Frontend Developer', 'UI / UX Designer'],
      created_at: '2026-08-15T11:00:00.000Z',
      updated_at: '2026-08-15T11:00:00.000Z',
    },
    {
      srn: 'PES1UG25DS033',
      prn: 'PES1202505033',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'Deepak Sundaram',
      department: 'Data Science',
      branch: 'DS',
      semester: 4,
      gender: 'Male',
      campus: 'RR Campus',
      email: 'deepak.sundaram@pes.edu',
      phone: '',
      photo_url: '',
      hackathon_count: 2,
      github_url: 'https://github.com/deepaksundaram',
      interests: ['Deep Learning', 'Computer Vision', 'MLOps'],
      skills: ['TensorFlow', 'OpenCV', 'MLflow', 'Python', 'FastAPI'],
      bio: 'Passionate about real-time vision pipelines, object tracking, and deploying optimized models on edge hardware.',
      looking_for_team: true,
      preferred_roles: ['AI / ML Engineer', 'Backend Developer'],
      created_at: '2026-08-15T11:30:00.000Z',
      updated_at: '2026-08-15T11:30:00.000Z',
    },
    {
      srn: 'PES1UG25DS108',
      prn: 'PES1202505108',
      passwordHash: 'a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b',
      salt: '6ba6e622de36c13856a706ed64d09842',
      name: 'Meera Nandakumar',
      department: 'Data Science',
      branch: 'DS',
      semester: 4,
      gender: 'Female',
      campus: 'RR Campus',
      email: 'meera.nandakumar@pes.edu',
      phone: '9880011224',
      photo_url: '',
      hackathon_count: 3,
      github_url: 'https://github.com/meerananda',
      interests: ['Predictive Analytics', 'Full Stack', 'Data Science'],
      skills: ['Pandas', 'Scikit-Learn', 'React', 'Node.js', 'SQL'],
      bio: 'Data scientist & full stack engineer experienced in building data-driven dashboards and smart recommendation systems.',
      looking_for_team: true,
      preferred_roles: ['Data Scientist / Analyst', 'Full Stack Developer'],
      created_at: '2026-08-15T12:00:00.000Z',
      updated_at: '2026-08-15T12:00:00.000Z',
    },
  ],
  posts: [],
  invites: [],
  sessions: [],
};

// In-memory caching for serverless environments
let memoryDb: DatabaseSchema = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DB));
let dbInitialized = false;

function getDbFilePath(): string {
  // On Vercel (serverless), the deployed data/db.json is read-only.
  // Always use /tmp for writable storage in serverless environments.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), 'pesquad_db.json');
  }
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
  // Once loaded in this container, always use the in-memory cache.
  // This prevents re-reading a stale/read-only file from overwriting
  // in-memory changes (e.g. users created during login).
  if (dbInitialized) {
    return memoryDb;
  }

  const dbFile = getDbFilePath();
  const dbDir = path.dirname(dbFile);

  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(DEFAULT_INITIAL_DB, null, 2), 'utf-8');
      memoryDb = JSON.parse(JSON.stringify(DEFAULT_INITIAL_DB));
      dbInitialized = true;
      return memoryDb;
    }

    const content = fs.readFileSync(dbFile, 'utf-8');
    memoryDb = JSON.parse(content);
    dbInitialized = true;
    return memoryDb;
  } catch (error) {
    // Fallback to memoryDb if file system is read-only
    dbInitialized = true;
    return memoryDb;
  }
}

import { supabase, isSupabaseConfigured } from './supabase.js';

function toSupabaseUser(user: DbUser): any {
  return {
    srn: user.srn.toUpperCase(),
    prn: user.prn || null,
    name: user.name,
    password_hash: user.passwordHash || '',
    salt: user.salt || '',
    department: user.department || 'Computer Science and Engineering',
    branch: user.branch || 'CSE',
    semester: user.semester || 4,
    gender: user.gender || 'Male',
    campus: user.campus || 'RR Campus',
    email: user.email || null,
    phone: user.phone || null,
    photo_url: user.photo_url || '',
    hackathon_count: user.hackathon_count || 0,
    github_url: user.github_url || '',
    interests: user.interests || [],
    skills: user.skills || [],
    bio: user.bio || '',
    looking_for_team: user.looking_for_team ?? true,
    preferred_roles: user.preferred_roles || ['Full Stack Developer'],
    created_at: user.created_at || new Date().toISOString(),
    updated_at: user.updated_at || new Date().toISOString(),
  };
}

function fromSupabaseUser(row: any): DbUser {
  return {
    srn: String(row.srn).toUpperCase(),
    prn: row.prn || undefined,
    passwordHash: row.password_hash || '',
    salt: row.salt || '',
    name: row.name || row.srn,
    department: row.department || 'Computer Science and Engineering',
    branch: row.branch || 'CSE',
    semester: Number(row.semester) || 4,
    gender: row.gender || 'Male',
    campus: row.campus || 'RR Campus',
    email: row.email || undefined,
    phone: row.phone || undefined,
    photo_url: row.photo_url || '',
    hackathon_count: Number(row.hackathon_count) || 0,
    github_url: row.github_url || '',
    interests: Array.isArray(row.interests) ? row.interests : [],
    skills: Array.isArray(row.skills) ? row.skills : [],
    bio: row.bio || '',
    looking_for_team: row.looking_for_team ?? true,
    preferred_roles: Array.isArray(row.preferred_roles) ? row.preferred_roles : ['Full Stack Developer'],
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
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

  // Supabase Persistent Sync
  static async syncUserToSupabase(user: DbUser): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      await supabase.from('users').upsert(toSupabaseUser(user), { onConflict: 'srn' });
    } catch (e) {
      console.warn('[Supabase User Sync Error]', e);
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

  static async getUsersAsync(): Promise<DbUser[]> {
    const db = this.read();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          for (const row of data) {
            const u = fromSupabaseUser(row);
            const idx = db.users.findIndex((existing) => existing.srn.toUpperCase() === u.srn.toUpperCase());
            if (idx >= 0) {
              db.users[idx] = { ...db.users[idx], ...u };
            } else {
              db.users.push(u);
            }
          }
          this.write(db);
        }
      } catch (e) {
        console.warn('[Supabase Fetch Users Error]', e);
      }
    }
    return db.users;
  }

  static getUserBySrn(srn: string): DbUser | undefined {
    return this.read().users.find((u) => u.srn.toUpperCase() === srn.toUpperCase());
  }

  static async getUserBySrnAsync(srn: string): Promise<DbUser | undefined> {
    const cleanSrn = srn.toUpperCase();
    let user = this.getUserBySrn(cleanSrn);
    if (user) return user;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('srn', cleanSrn).maybeSingle();
        if (!error && data) {
          user = fromSupabaseUser(data);
          const db = this.read();
          const idx = db.users.findIndex((u) => u.srn.toUpperCase() === cleanSrn);
          if (idx >= 0) {
            db.users[idx] = user;
          } else {
            db.users.push(user);
          }
          this.write(db);
          return user;
        }
      } catch (e) {
        console.warn('[Supabase Fetch User By SRN Error]', e);
      }
    }
    return undefined;
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
      db.users[existingIndex] = user;
    } else {
      db.users.push(user);
    }
    this.write(db);
    this.syncUserToSupabase(user);
    return user;
  }

  static async createUserAsync(user: DbUser): Promise<DbUser> {
    const db = this.read();
    const existingIndex = db.users.findIndex((u) => u.srn.toUpperCase() === user.srn.toUpperCase());
    if (existingIndex >= 0) {
      db.users[existingIndex] = user;
    } else {
      db.users.push(user);
    }
    this.write(db);
    await this.syncUserToSupabase(user);
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
    this.syncUserToSupabase(updated);
    return updated;
  }

  static async updateUserAsync(srn: string, updates: Partial<DbUser>): Promise<DbUser> {
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
    await this.syncUserToSupabase(updated);
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
