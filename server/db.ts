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
        "srn": "PES1UG25CS698",
        "prn": "PES1202504729",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "SUFIYAN TATAGAR",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "sufiyantatagar490@gmail.com",
        "phone": "8050895979",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/ST490",
        "interests": [
            "Frontend",
            "Backend",
            "Full Stack"
        ],
        "skills": [
            "React",
            "TypeScript",
            "Node.js",
            "Tailwind CSS"
        ],
        "bio": "Full Stack developer eager to build innovative solutions for SIH 2026.",
        "looking_for_team": true,
        "preferred_roles": [
            "Full Stack Developer",
            "Team Lead"
        ],
        "created_at": "2026-08-14T20:35:30.654Z",
        "updated_at": "2026-08-14T20:35:54.679Z"
    },
    {
        "srn": "PES1UG25CS309",
        "prn": "PES1202502309",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Mohammed Yusuf Ahmed",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "yusuf.ahmed@pes.edu",
        "phone": "8088421593",
        "photo_url": "",
        "hackathon_count": 4,
        "github_url": "https://github.com/yusufahmed",
        "interests": [
            "Frontend",
            "Backend",
            "Full Stack",
            "Cloud & DevOps"
        ],
        "skills": [
            "Next.js",
            "Python",
            "Docker",
            "FastAPI"
        ],
        "bio": "Experienced backend & systems architect looking for an enthusiastic team for SIH 2026.",
        "looking_for_team": true,
        "preferred_roles": [
            "Backend Specialist",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-14T21:00:00.000Z",
        "updated_at": "2026-08-14T21:00:00.000Z"
    },
    {
        "srn": "PES1UG25ME042",
        "prn": "PES1202501042",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "SHREYAS SANJAY GAIKWAD",
        "department": "Mechanical Engineering",
        "branch": "ME",
        "semester": 3,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "shreyas.gaikwad@pes.edu",
        "phone": "9036296715",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/shreyasgaikwad",
        "interests": [
            "Computer Vision",
            "Natural Language Processing",
            "IoT & Robotics"
        ],
        "skills": [
            "PyTorch",
            "ROS",
            "OpenCV",
            "Python"
        ],
        "bio": "Self-driven builder and developer passionate about creating autonomous systems and AI hardware for SIH.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Hardware / Embedded Systems Lead"
        ],
        "created_at": "2026-08-14T21:30:00.000Z",
        "updated_at": "2026-08-14T21:30:00.000Z"
    },
    {
        "srn": "PES1UG25EE054",
        "prn": "PES1202503054",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "MOHAMMAD SAFWAAN",
        "department": "Electrical & Electronics",
        "branch": "EEE",
        "semester": 3,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "mohammad.safwaan@pes.edu",
        "phone": "8317452496",
        "photo_url": "",
        "hackathon_count": 1,
        "github_url": "",
        "interests": [
            "Frontend",
            "Backend",
            "Embedded Systems",
            "IoT & Robotics"
        ],
        "skills": [
            "Embedded C",
            "JavaScript",
            "Node.js"
        ],
        "bio": "Ready to contribute frontend UI and IoT device integration for smart hardware problem statements.",
        "looking_for_team": true,
        "preferred_roles": [
            "Full Stack Developer",
            "Hardware / Embedded Systems Lead"
        ],
        "created_at": "2026-08-14T22:00:00.000Z",
        "updated_at": "2026-08-14T22:00:00.000Z"
    },
    {
        "srn": "PES1UG25AM513",
        "prn": "PES1202505513",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "S BANUTEJA REDDY",
        "department": "AI & Machine Learning",
        "branch": "AIML",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "banuteja.reddy@pes.edu",
        "phone": "9845012345",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "",
        "interests": [
            "Machine Learning",
            "Deep Learning",
            "Backend"
        ],
        "skills": [
            "Python",
            "Scikit-Learn",
            "TensorFlow",
            "SQL"
        ],
        "bio": "Focused on AI model training, predictive analytics, and scalable model deployment for SIH projects.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Backend Specialist"
        ],
        "created_at": "2026-08-15T00:00:00.000Z",
        "updated_at": "2026-08-15T00:00:00.000Z"
    },
    {
        "srn": "PES1UG25CS696",
        "prn": "PES1202504696",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Spandana B M",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "spandana.bm@pes.edu",
        "phone": "9845112233",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/spandanabm",
        "interests": [
            "UI/UX Design",
            "Frontend",
            "Mobile App (Flutter/React Native)"
        ],
        "skills": [
            "Figma",
            "React",
            "Tailwind CSS",
            "Flutter"
        ],
        "bio": "Passionate UI/UX designer and frontend developer. Experienced in designing accessible and sleek mobile/web products.",
        "looking_for_team": true,
        "preferred_roles": [
            "UI/UX Designer",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-15T07:30:00.000Z",
        "updated_at": "2026-08-15T07:30:00.000Z"
    },
    {
        "srn": "PES1UG25CS716",
        "prn": "PES1202504716",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Chirag Kulkarni",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "chirag.kulkarni@pes.edu",
        "phone": "9845223344",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/chiragkulkarni",
        "interests": [
            "Cloud & DevOps",
            "Backend",
            "Full Stack"
        ],
        "skills": [
            "Docker",
            "AWS",
            "Node.js",
            "Linux",
            "Express"
        ],
        "bio": "DevOps enthusiast with practical experience in CI/CD pipelines, container orchestration, and microservices.",
        "looking_for_team": true,
        "preferred_roles": [
            "Backend Specialist",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-15T08:00:00.000Z",
        "updated_at": "2026-08-15T08:00:00.000Z"
    },
    {
        "srn": "PES1UG25CS104",
        "prn": "PES1202501104",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Ananya Sharma",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "ananya.sharma@pes.edu",
        "phone": "9901234567",
        "photo_url": "",
        "hackathon_count": 5,
        "github_url": "https://github.com/ananyasharma",
        "interests": [
            "Machine Learning",
            "Natural Language Processing",
            "Full Stack"
        ],
        "skills": [
            "PyTorch",
            "FastAPI",
            "LangChain",
            "React"
        ],
        "bio": "5x hackathon winner specializing in LLMs and AI agent architectures. Looking for a passionate team for SIH 2026!",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Team Lead"
        ],
        "created_at": "2026-08-15T08:30:00.000Z",
        "updated_at": "2026-08-15T08:30:00.000Z"
    },
    {
        "srn": "PES1UG25EC215",
        "prn": "PES1202501215",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Kavya Ramesh",
        "department": "Electronics & Communication",
        "branch": "ECE",
        "semester": 4,
        "gender": "Female",
        "campus": "EC Campus",
        "email": "kavya.ramesh@pes.edu",
        "phone": "9741098765",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/kavyaramesh",
        "interests": [
            "Embedded Systems",
            "IoT & Robotics",
            "Hardware / Embedded Systems Lead"
        ],
        "skills": [
            "ESP32",
            "Arduino",
            "C++",
            "TinyML"
        ],
        "bio": "ECE hardware hacker building smart IoT sensors and edge computing devices for smart city and agri-tech challenges.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead"
        ],
        "created_at": "2026-08-15T09:00:00.000Z",
        "updated_at": "2026-08-15T09:00:00.000Z"
    },
    {
        "srn": "PES1UG25CS442",
        "prn": "PES1202503442",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Rohan Varma",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Male",
        "campus": "EC Campus",
        "email": "rohan.varma@pes.edu",
        "phone": "9845334455",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/rohanvarma",
        "interests": [
            "Cloud & DevOps",
            "Backend",
            "Data Engineering"
        ],
        "skills": [
            "AWS",
            "Kubernetes",
            "Go",
            "PostgreSQL",
            "Terraform"
        ],
        "bio": "Cloud infra engineer passionate about building high-availability backends and scalable microservices architectures.",
        "looking_for_team": true,
        "preferred_roles": [
            "Backend Specialist",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-15T09:30:00.000Z",
        "updated_at": "2026-08-15T09:30:00.000Z"
    },
    {
        "srn": "PES1UG25BT019",
        "prn": "PES1202502019",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Pooja Hegde",
        "department": "Biotechnology",
        "branch": "BT",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "pooja.hegde@pes.edu",
        "phone": "9845445566",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/poojahegde",
        "interests": [
            "Data Engineering",
            "Machine Learning",
            "Domain / Pitch Specialist"
        ],
        "skills": [
            "BioPython",
            "R",
            "Python",
            "Data Analytics"
        ],
        "bio": "Biotech student bridging computational biology with health-tech AI solutions for SIH MedTech problem statements.",
        "looking_for_team": true,
        "preferred_roles": [
            "Domain / Pitch Specialist",
            "AI / ML Engineer"
        ],
        "created_at": "2026-08-15T10:00:00.000Z",
        "updated_at": "2026-08-15T10:00:00.000Z"
    },
    {
        "srn": "PES1UG25CY118",
        "prn": "PES1202504118",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Aditya Kulkarni",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "aditya.kulkarni@pes.edu",
        "phone": "9900112233",
        "photo_url": "",
        "hackathon_count": 4,
        "github_url": "https://github.com/adityakulkarni",
        "interests": [
            "Cybersecurity",
            "Blockchain & Web3",
            "Backend"
        ],
        "skills": [
            "Solidity",
            "Rust",
            "Penetration Testing",
            "Node.js"
        ],
        "bio": "Smart contract auditor and security researcher. Keen on Web3, zero-knowledge proofs, and secure digital identity.",
        "looking_for_team": true,
        "preferred_roles": [
            "Backend Specialist",
            "Team Lead"
        ],
        "created_at": "2026-08-15T10:30:00.000Z",
        "updated_at": "2026-08-15T10:30:00.000Z"
    },
    {
        "srn": "PES1UG25CS550",
        "prn": "PES1202503550",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Tanvi Deshmukh",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Female",
        "campus": "EC Campus",
        "email": "tanvi.deshmukh@pes.edu",
        "phone": "9845556677",
        "photo_url": "",
        "hackathon_count": 1,
        "github_url": "https://github.com/tanvideshmukh",
        "interests": [
            "AR / VR",
            "Frontend",
            "UI/UX Design"
        ],
        "skills": [
            "Three.js",
            "Unity",
            "WebGL",
            "React",
            "Tailwind CSS"
        ],
        "bio": "Creative 3D web developer building immersive spatial computing and AR/VR web experiences for SIH.",
        "looking_for_team": true,
        "preferred_roles": [
            "Frontend Developer",
            "UI/UX Designer"
        ],
        "created_at": "2026-08-15T11:00:00.000Z",
        "updated_at": "2026-08-15T11:00:00.000Z"
    },
    {
        "srn": "PES1UG25DS033",
        "prn": "PES1202505033",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Deepak Sundaram",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "deepak.sundaram@pes.edu",
        "phone": "9845667788",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/deepaksundaram",
        "interests": [
            "Deep Learning",
            "Computer Vision",
            "Cloud & DevOps"
        ],
        "skills": [
            "TensorFlow",
            "OpenCV",
            "MLflow",
            "Python",
            "FastAPI"
        ],
        "bio": "Passionate about real-time vision pipelines, object tracking, and deploying optimized models on edge hardware.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Backend Specialist"
        ],
        "created_at": "2026-08-15T11:30:00.000Z",
        "updated_at": "2026-08-15T11:30:00.000Z"
    },
    {
        "srn": "PES1UG25DS108",
        "prn": "PES1202505108",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Meera Nandakumar",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "meera.nandakumar@pes.edu",
        "phone": "9880011224",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/meerananda",
        "interests": [
            "Data Engineering",
            "Full Stack",
            "Machine Learning"
        ],
        "skills": [
            "Pandas",
            "Scikit-Learn",
            "React",
            "Node.js",
            "SQL"
        ],
        "bio": "Data scientist & full stack engineer experienced in building data-driven dashboards and smart recommendation systems.",
        "looking_for_team": true,
        "preferred_roles": [
            "Full Stack Developer",
            "AI / ML Engineer"
        ],
        "created_at": "2026-08-15T12:00:00.000Z",
        "updated_at": "2026-08-15T12:00:00.000Z"
    },
    {
        "srn": "PES1UG24CS201",
        "prn": "PES1202401201",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Aarav Patel",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 6,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "aarav.patel@pes.edu",
        "phone": "9845778899",
        "photo_url": "",
        "hackathon_count": 4,
        "github_url": "https://github.com/aaravpatel",
        "interests": [
            "Backend",
            "Cloud & DevOps",
            "Data Engineering"
        ],
        "skills": [
            "Go",
            "gRPC",
            "Apache Kafka",
            "Redis",
            "PostgreSQL"
        ],
        "bio": "Distributed systems engineer focused on fault-tolerant message queues, microservices, and high-throughput real-time pipelines.",
        "looking_for_team": true,
        "preferred_roles": [
            "Backend Specialist",
            "Team Lead"
        ],
        "created_at": "2026-08-15T12:30:00.000Z",
        "updated_at": "2026-08-15T12:30:00.000Z"
    },
    {
        "srn": "PES1UG24AM112",
        "prn": "PES1202402112",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Sneha Ranganathan",
        "department": "AI & Machine Learning",
        "branch": "AIML",
        "semester": 6,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "sneha.ranga@pes.edu",
        "phone": "9845889900",
        "photo_url": "",
        "hackathon_count": 5,
        "github_url": "https://github.com/sneharanga",
        "interests": [
            "Natural Language Processing",
            "Deep Learning",
            "Machine Learning"
        ],
        "skills": [
            "LLMs",
            "Hugging Face",
            "RAG",
            "LangGraph",
            "Python"
        ],
        "bio": "Specialized in multi-agent generative AI, retrieval-augmented generation (RAG), and fine-tuning open-source LLMs.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Team Lead"
        ],
        "created_at": "2026-08-15T13:00:00.000Z",
        "updated_at": "2026-08-15T13:00:00.000Z"
    },
    {
        "srn": "PES1UG25EC340",
        "prn": "PES1202503340",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Varun Rao",
        "department": "Electronics & Communication",
        "branch": "ECE",
        "semester": 4,
        "gender": "Male",
        "campus": "EC Campus",
        "email": "varun.rao@pes.edu",
        "phone": "9845990011",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/varunrao",
        "interests": [
            "Embedded Systems",
            "IoT & Robotics",
            "Hardware / Embedded Systems Lead"
        ],
        "skills": [
            "Verilog",
            "STM32",
            "FreeRTOS",
            "C++",
            "Circuit Design"
        ],
        "bio": "VLSI and RTOS developer passionate about firmware engineering, FPGA accelerators, and hardware-software co-design.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead"
        ],
        "created_at": "2026-08-15T13:30:00.000Z",
        "updated_at": "2026-08-15T13:30:00.000Z"
    },
    {
        "srn": "PES1UG23CS088",
        "prn": "PES1202301088",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Priya Sundaresan",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 8,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "priya.sundar@pes.edu",
        "phone": "9880112233",
        "photo_url": "",
        "hackathon_count": 6,
        "github_url": "https://github.com/priyasundar",
        "interests": [
            "Full Stack",
            "Cloud & DevOps",
            "UI/UX Design"
        ],
        "skills": [
            "Next.js 14",
            "GraphQL",
            "Docker",
            "Google Cloud",
            "TypeScript"
        ],
        "bio": "Senior full-stack architect & veteran SIH finalist. Loves mentoring teams and crafting rapid production-ready prototypes.",
        "looking_for_team": true,
        "preferred_roles": [
            "Team Lead",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-15T14:00:00.000Z",
        "updated_at": "2026-08-15T14:00:00.000Z"
    },
    {
        "srn": "PES1UG25ME105",
        "prn": "PES1202502105",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Nihal Gowda",
        "department": "Mechanical Engineering",
        "branch": "ME",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "nihal.gowda@pes.edu",
        "phone": "9880223344",
        "photo_url": "",
        "hackathon_count": 1,
        "github_url": "https://github.com/nihalgowda",
        "interests": [
            "IoT & Robotics",
            "Embedded Systems",
            "Domain / Pitch Specialist"
        ],
        "skills": [
            "SolidWorks",
            "ANSYS",
            "ROS 2",
            "Python",
            "CAN Bus"
        ],
        "bio": "Robotics kinematics designer and CAD specialist ready to build autonomous mobile robots (AMR) and smart agritech rovers.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead",
            "Domain / Pitch Specialist"
        ],
        "created_at": "2026-08-15T14:30:00.000Z",
        "updated_at": "2026-08-15T14:30:00.000Z"
    },
    {
        "srn": "PES1UG25BT044",
        "prn": "PES1202503044",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Divya Chandrashekar",
        "department": "Biotechnology",
        "branch": "BT",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "divya.chandra@pes.edu",
        "phone": "9880334455",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/divyachandra",
        "interests": [
            "Data Engineering",
            "Machine Learning",
            "Domain / Pitch Specialist"
        ],
        "skills": [
            "BioConductor",
            "Python",
            "Nextflow",
            "PyMOL",
            "Bioinformatics"
        ],
        "bio": "Computational biologist passionate about protein folding prediction, genomics pipelines, and drug discovery AI tools.",
        "looking_for_team": true,
        "preferred_roles": [
            "Domain / Pitch Specialist",
            "AI / ML Engineer"
        ],
        "created_at": "2026-08-15T15:00:00.000Z",
        "updated_at": "2026-08-15T15:00:00.000Z"
    },
    {
        "srn": "PES1UG25EE120",
        "prn": "PES1202504120",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Harish Venkatesh",
        "department": "Electrical & Electronics",
        "branch": "EEE",
        "semester": 4,
        "gender": "Male",
        "campus": "EC Campus",
        "email": "harish.venkat@pes.edu",
        "phone": "9880445566",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/harishvenkat",
        "interests": [
            "IoT & Robotics",
            "Embedded Systems",
            "Cloud & DevOps"
        ],
        "skills": [
            "MATLAB/Simulink",
            "ESP32",
            "MQTT",
            "KiCad",
            "Power Electronics"
        ],
        "bio": "Smart grid and green energy developer with experience in microgrid telemetry, telemetry sensors, and embedded control.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead"
        ],
        "created_at": "2026-08-15T15:30:00.000Z",
        "updated_at": "2026-08-15T15:30:00.000Z"
    },
    {
        "srn": "PES1UG26CS012",
        "prn": "PES1202601012",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Ishaan Gupta",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 2,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "ishaan.gupta@pes.edu",
        "phone": "9880556677",
        "photo_url": "",
        "hackathon_count": 1,
        "github_url": "https://github.com/ishaangupta",
        "interests": [
            "Backend",
            "Full Stack",
            "Data Engineering"
        ],
        "skills": [
            "C++",
            "Data Structures",
            "Algorithms",
            "Python",
            "React"
        ],
        "bio": "First year competitive programmer and enthusiastic builder excited to write hyper-optimized algorithms for SIH.",
        "looking_for_team": true,
        "preferred_roles": [
            "Backend Specialist",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-15T16:00:00.000Z",
        "updated_at": "2026-08-15T16:00:00.000Z"
    },
    {
        "srn": "PES1UG24DS075",
        "prn": "PES1202403075",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Sanjana Krishna",
        "department": "AI & Machine Learning",
        "branch": "AIML",
        "semester": 6,
        "gender": "Female",
        "campus": "EC Campus",
        "email": "sanjana.krishna@pes.edu",
        "phone": "9880667788",
        "photo_url": "",
        "hackathon_count": 4,
        "github_url": "https://github.com/sanjanakrishna",
        "interests": [
            "Computer Vision",
            "Deep Learning",
            "IoT & Robotics"
        ],
        "skills": [
            "YOLOv8",
            "DeepStream",
            "PyTorch",
            "C++",
            "OpenCV"
        ],
        "bio": "Computer vision specialist working on low-latency video surveillance, automated inspection, and traffic analytics systems.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Team Lead"
        ],
        "created_at": "2026-08-15T16:30:00.000Z",
        "updated_at": "2026-08-15T16:30:00.000Z"
    },
    {
        "srn": "PES1UG25DE018",
        "prn": "PES1202501018",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Aniket Joshi",
        "department": "Design & Architecture",
        "branch": "DES",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "aniket.joshi@pes.edu",
        "phone": "9880778899",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/aniketjoshi",
        "interests": [
            "UI/UX Design",
            "Frontend",
            "AR / VR"
        ],
        "skills": [
            "Figma",
            "Framer",
            "Blender",
            "User Research",
            "Design Systems"
        ],
        "bio": "Product designer focusing on human-centered UX design, design sprints, high-fidelity prototypes, and design systems.",
        "looking_for_team": true,
        "preferred_roles": [
            "UI/UX Designer",
            "Domain / Pitch Specialist"
        ],
        "created_at": "2026-08-15T17:00:00.000Z",
        "updated_at": "2026-08-15T17:00:00.000Z"
    },
    {
        "srn": "PES1UG25CS889",
        "prn": "PES1202504889",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Riya Sen",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "riya.sen@pes.edu",
        "phone": "9880889900",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/riyasen",
        "interests": [
            "Mobile App (Flutter/React Native)",
            "Frontend",
            "UI/UX Design"
        ],
        "skills": [
            "Flutter",
            "Dart",
            "Firebase",
            "Kotlin",
            "REST APIs"
        ],
        "bio": "Cross-platform mobile developer with 3 production app releases. Building responsive offline-first mobile apps for SIH.",
        "looking_for_team": true,
        "preferred_roles": [
            "Full Stack Developer",
            "UI/UX Designer"
        ],
        "created_at": "2026-08-15T17:30:00.000Z",
        "updated_at": "2026-08-15T17:30:00.000Z"
    },
    {
        "srn": "PES1UG24EE082",
        "prn": "PES1202402082",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Karthik Sridhar",
        "department": "Electrical & Electronics",
        "branch": "EEE",
        "semester": 6,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "karthik.sridhar@pes.edu",
        "phone": "9880990011",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/karthiksridhar",
        "interests": [
            "IoT & Robotics",
            "Embedded Systems",
            "Hardware / Embedded Systems Lead"
        ],
        "skills": [
            "MATLAB",
            "Altium Designer",
            "Embedded C",
            "BLE",
            "Motor Drivers"
        ],
        "bio": "EV powertrains, BMS (Battery Management Systems), and high-frequency power electronics engineer ready for EV hardware themes.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead"
        ],
        "created_at": "2026-08-15T18:00:00.000Z",
        "updated_at": "2026-08-15T18:00:00.000Z"
    },
    {
        "srn": "PES1UG23EC410",
        "prn": "PES1202304410",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Shweta Nambiar",
        "department": "Electronics & Communication",
        "branch": "ECE",
        "semester": 8,
        "gender": "Female",
        "campus": "EC Campus",
        "email": "shweta.nambiar@pes.edu",
        "phone": "9916001122",
        "photo_url": "",
        "hackathon_count": 5,
        "github_url": "https://github.com/shwetanambiar",
        "interests": [
            "IoT & Robotics",
            "Embedded Systems",
            "Cloud & DevOps"
        ],
        "skills": [
            "LoRaWAN",
            "Zigbee",
            "Embedded C",
            "Python",
            "AWS IoT Core"
        ],
        "bio": "Long-range low-power sensor networks and 5G edge computing researcher. Experienced leader with 5 national hackathon podiums.",
        "looking_for_team": true,
        "preferred_roles": [
            "Team Lead",
            "Hardware / Embedded Systems Lead"
        ],
        "created_at": "2026-08-15T18:30:00.000Z",
        "updated_at": "2026-08-15T18:30:00.000Z"
    },
    {
        "srn": "PES1UG25AM204",
        "prn": "PES1202502204",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Pranav Nair",
        "department": "AI & Machine Learning",
        "branch": "AIML",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "pranav.nair@pes.edu",
        "phone": "9916112233",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/pranavnair",
        "interests": [
            "Deep Learning",
            "Machine Learning",
            "Backend"
        ],
        "skills": [
            "Stable-Baselines3",
            "PyTorch",
            "OpenAI Gym",
            "FastAPI",
            "NumPy"
        ],
        "bio": "Reinforcement learning enthusiast building autonomous decision-making agents for smart traffic and logistics optimization.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Backend Specialist"
        ],
        "created_at": "2026-08-15T19:00:00.000Z",
        "updated_at": "2026-08-15T19:00:00.000Z"
    },
    {
        "srn": "PES1UG25CS612",
        "prn": "PES1202503612",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Natasha D'Souza",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Female",
        "campus": "EC Campus",
        "email": "natasha.dsouza@pes.edu",
        "phone": "9916223344",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/natashadsouza",
        "interests": [
            "Cybersecurity",
            "Cloud & DevOps",
            "Backend"
        ],
        "skills": [
            "OWASP",
            "Kubernetes Security",
            "Go",
            "Wireshark",
            "Docker"
        ],
        "bio": "DevSecOps & web security enthusiast ensuring that SIH systems are built with zero vulnerabilities and strong cryptography.",
        "looking_for_team": true,
        "preferred_roles": [
            "Backend Specialist",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-15T19:30:00.000Z",
        "updated_at": "2026-08-15T19:30:00.000Z"
    },
    {
        "srn": "PES1UG26AM045",
        "prn": "PES1202602045",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Siddharth Menon",
        "department": "AI & Machine Learning",
        "branch": "AIML",
        "semester": 2,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "siddharth.menon@pes.edu",
        "phone": "9916334455",
        "photo_url": "",
        "hackathon_count": 1,
        "github_url": "https://github.com/siddharthmenon",
        "interests": [
            "Frontend",
            "Machine Learning",
            "UI/UX Design"
        ],
        "skills": [
            "TypeScript",
            "React",
            "Three.js",
            "OpenAI API",
            "Tailwind CSS"
        ],
        "bio": "Freshman passionate about creative frontend coding, interactive 3D canvases, and AI-assisted conversational interfaces.",
        "looking_for_team": true,
        "preferred_roles": [
            "Frontend Developer",
            "UI/UX Designer"
        ],
        "created_at": "2026-08-15T20:00:00.000Z",
        "updated_at": "2026-08-15T20:00:00.000Z"
    },
    {
        "srn": "PES1UG24ME067",
        "prn": "PES1202403067",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Bhavana Reddy",
        "department": "Mechanical Engineering",
        "branch": "ME",
        "semester": 6,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "bhavana.reddy@pes.edu",
        "phone": "9916445566",
        "photo_url": "",
        "hackathon_count": 4,
        "github_url": "https://github.com/bhavanareddy",
        "interests": [
            "IoT & Robotics",
            "Embedded Systems",
            "Computer Vision"
        ],
        "skills": [
            "PX4 Autopilot",
            "ArduPilot",
            "ROS",
            "SolidWorks",
            "3D Printing"
        ],
        "bio": "Drone & UAV flight dynamics engineer with hands-on experience building autonomous mapping and search-and-rescue quadcopters.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead",
            "Team Lead"
        ],
        "created_at": "2026-08-15T20:30:00.000Z",
        "updated_at": "2026-08-15T20:30:00.000Z"
    },
    {
        "srn": "PES1UG25CS920",
        "prn": "PES1202504920",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Tejas Nayak",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "tejas.nayak@pes.edu",
        "phone": "9916556677",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/tejasnayak",
        "interests": [
            "Blockchain & Web3",
            "Full Stack",
            "Backend"
        ],
        "skills": [
            "Solidity",
            "IPFS",
            "Ethereum",
            "Wagmi",
            "Next.js"
        ],
        "bio": "Decentralized application developer passionate about verifiable credentials, governance DAOs, and transparent public registries.",
        "looking_for_team": true,
        "preferred_roles": [
            "Full Stack Developer",
            "Backend Specialist"
        ],
        "created_at": "2026-08-15T21:00:00.000Z",
        "updated_at": "2026-08-15T21:00:00.000Z"
    },
    {
        "srn": "PES1UG25DE033",
        "prn": "PES1202502033",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Aishwarya Pillai",
        "department": "Design & Architecture",
        "branch": "DES",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "aishwarya.pillai@pes.edu",
        "phone": "9916667788",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/aishwaryapillai",
        "interests": [
            "UI/UX Design",
            "AR / VR",
            "Frontend"
        ],
        "skills": [
            "Figma",
            "Spline 3D",
            "Design Tokens",
            "Tailwind CSS",
            "Design Thinking"
        ],
        "bio": "Visual and motion designer creating stunning pitch decks, micro-interactions, and high-impact UI themes for winning hackathon submissions.",
        "looking_for_team": true,
        "preferred_roles": [
            "UI/UX Designer",
            "Domain / Pitch Specialist"
        ],
        "created_at": "2026-08-15T21:30:00.000Z",
        "updated_at": "2026-08-15T21:30:00.000Z"
    },
    {
        "srn": "PES1UG23CS150",
        "prn": "PES1202302150",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Vikramaditya Singh",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 8,
        "gender": "Male",
        "campus": "EC Campus",
        "email": "vikram.singh@pes.edu",
        "phone": "9916778899",
        "photo_url": "",
        "hackathon_count": 5,
        "github_url": "https://github.com/vikramadityasingh",
        "interests": [
            "Cloud & DevOps",
            "Backend",
            "Data Engineering"
        ],
        "skills": [
            "AWS Solutions Architect",
            "Terraform",
            "Kubernetes",
            "Go",
            "Prometheus"
        ],
        "bio": "Final year cloud infrastructure specialist and 5-time hackathon organizer with extensive experience architecting production grade systems.",
        "looking_for_team": true,
        "preferred_roles": [
            "Team Lead",
            "Backend Specialist"
        ],
        "created_at": "2026-08-15T22:00:00.000Z",
        "updated_at": "2026-08-15T22:00:00.000Z"
    },
    {
        "srn": "PES1UG25BT032",
        "prn": "PES1202504032",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Keerthi Prasanna",
        "department": "Biotechnology",
        "branch": "BT",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "keerthi.prasanna@pes.edu",
        "phone": "9916889900",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/keerthiprasanna",
        "interests": [
            "Domain / Pitch Specialist",
            "IoT & Robotics",
            "Data Engineering"
        ],
        "skills": [
            "Microfluidics",
            "Python",
            "OpenCV",
            "Arduino",
            "Biosensors"
        ],
        "bio": "Biotech researcher building low-cost optical biosensors, water quality analysis rigs, and field diagnostics kits.",
        "looking_for_team": true,
        "preferred_roles": [
            "Domain / Pitch Specialist",
            "Hardware / Embedded Systems Lead"
        ],
        "created_at": "2026-08-15T22:30:00.000Z",
        "updated_at": "2026-08-15T22:30:00.000Z"
    },
    {
        "srn": "PES1UG25EC190",
        "prn": "PES1202502190",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Rahul B",
        "department": "Electronics & Communication",
        "branch": "ECE",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "rahul.b@pes.edu",
        "phone": "9916990011",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/rahulb-ece",
        "interests": [
            "Embedded Systems",
            "IoT & Robotics",
            "Deep Learning"
        ],
        "skills": [
            "DSP",
            "C++",
            "TinyML",
            "MATLAB",
            "ARM Cortex"
        ],
        "bio": "DSP and Edge AI engineer building voice-recognition trigger words and real-time audio anomaly detectors on microcontrollers.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead",
            "AI / ML Engineer"
        ],
        "created_at": "2026-08-15T23:00:00.000Z",
        "updated_at": "2026-08-15T23:00:00.000Z"
    },
    {
        "srn": "PES1UG24CS512",
        "prn": "PES1202404512",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Samiksha Rao",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 6,
        "gender": "Female",
        "campus": "EC Campus",
        "email": "samiksha.rao@pes.edu",
        "phone": "9920001122",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/samiksharao",
        "interests": [
            "Data Engineering",
            "Deep Learning",
            "Backend"
        ],
        "skills": [
            "CUDA",
            "C++",
            "Python",
            "OpenMP",
            "GPU Profiling"
        ],
        "bio": "High performance GPU programmer accelerating matrix calculations, parallel graph traversal, and deep learning training loops.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Backend Specialist"
        ],
        "created_at": "2026-08-15T23:30:00.000Z",
        "updated_at": "2026-08-15T23:30:00.000Z"
    },
    {
        "srn": "PES1UG25EE095",
        "prn": "PES1202501095",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Gautham Krishnan",
        "department": "Electrical & Electronics",
        "branch": "EEE",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "gautham.krishnan@pes.edu",
        "phone": "9920112233",
        "photo_url": "",
        "hackathon_count": 1,
        "github_url": "https://github.com/gauthamkrishnan",
        "interests": [
            "IoT & Robotics",
            "Embedded Systems",
            "Full Stack"
        ],
        "skills": [
            "Raspberry Pi",
            "Yocto",
            "MQTT",
            "Python",
            "Node-RED"
        ],
        "bio": "Embedded Linux hacker building industrial IoT gateways, edge telemetry data collectors, and smart building energy meters.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-16T00:00:00.000Z",
        "updated_at": "2026-08-16T00:00:00.000Z"
    },
    {
        "srn": "PES1UG24AM310",
        "prn": "PES1202403310",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Shruti Bhatt",
        "department": "AI & Machine Learning",
        "branch": "AIML",
        "semester": 6,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "shruti.bhatt@pes.edu",
        "phone": "9920223344",
        "photo_url": "",
        "hackathon_count": 4,
        "github_url": "https://github.com/shrutibhatt",
        "interests": [
            "Deep Learning",
            "Natural Language Processing",
            "Full Stack"
        ],
        "skills": [
            "OpenAI Whisper",
            "Librosa",
            "PyTorch",
            "FastAPI",
            "React"
        ],
        "bio": "Multimodal AI specialist building automated transcription, real-time accent translation, and speech-to-text assistive tech.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Team Lead"
        ],
        "created_at": "2026-08-16T00:30:00.000Z",
        "updated_at": "2026-08-16T00:30:00.000Z"
    },
    {
        "srn": "PES1UG24CS402",
        "prn": "PES1202402402",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Aditi Deshpande",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 6,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "aditi.deshpande@pes.edu",
        "phone": "9920334455",
        "photo_url": "",
        "hackathon_count": 4,
        "github_url": "https://github.com/aditideshpande",
        "interests": [
            "Full Stack",
            "Frontend",
            "Backend"
        ],
        "skills": [
            "Next.js",
            "TypeScript",
            "Apollo GraphQL",
            "PostgreSQL",
            "Tailwind CSS"
        ],
        "bio": "Full stack engineer building rapid, type-safe web portals and real-time collaborative dashboards for SIH.",
        "looking_for_team": true,
        "preferred_roles": [
            "Full Stack Developer",
            "Team Lead"
        ],
        "created_at": "2026-08-16T01:00:00.000Z",
        "updated_at": "2026-08-16T01:00:00.000Z"
    },
    {
        "srn": "PES1UG25EC115",
        "prn": "PES1202501115",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Manoj Kumar K",
        "department": "Electronics & Communication",
        "branch": "ECE",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "manoj.kumar@pes.edu",
        "phone": "9920445566",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/manojkumar-ece",
        "interests": [
            "IoT & Robotics",
            "Embedded Systems",
            "Computer Vision"
        ],
        "skills": [
            "ROS 2",
            "C++",
            "SLAM",
            "LiDAR",
            "Python"
        ],
        "bio": "Autonomous navigation and SLAM robotics developer working on LiDAR-based mapping for search & rescue themes.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead",
            "AI / ML Engineer"
        ],
        "created_at": "2026-08-16T01:30:00.000Z",
        "updated_at": "2026-08-16T01:30:00.000Z"
    },
    {
        "srn": "PES1UG25AM308",
        "prn": "PES1202503308",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Tanmayee Bhat",
        "department": "AI & Machine Learning",
        "branch": "AIML",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "tanmayee.bhat@pes.edu",
        "phone": "9920556677",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/tanmayeebhat",
        "interests": [
            "Machine Learning",
            "Natural Language Processing",
            "Full Stack"
        ],
        "skills": [
            "LangChain",
            "OpenAI API",
            "Streamlit",
            "ChromaDB",
            "Python"
        ],
        "bio": "AI solutions builder creating intelligent domain chatbots, document question-answering systems, and RAG pipelines.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-16T02:00:00.000Z",
        "updated_at": "2026-08-16T02:00:00.000Z"
    },
    {
        "srn": "PES1UG24ME091",
        "prn": "PES1202401091",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Abhishek N",
        "department": "Mechanical Engineering",
        "branch": "ME",
        "semester": 6,
        "gender": "Male",
        "campus": "EC Campus",
        "email": "abhishek.n@pes.edu",
        "phone": "9920667788",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/abhishekn-me",
        "interests": [
            "IoT & Robotics",
            "Embedded Systems",
            "Domain / Pitch Specialist"
        ],
        "skills": [
            "ANSYS Fluent",
            "PX4",
            "SolidWorks",
            "C++",
            "Aerodynamics"
        ],
        "bio": "UAV airframe and propulsion engineer with experience designing delivery drones and thermal flow analysis.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead",
            "Domain / Pitch Specialist"
        ],
        "created_at": "2026-08-16T02:30:00.000Z",
        "updated_at": "2026-08-16T02:30:00.000Z"
    },
    {
        "srn": "PES1UG25CS330",
        "prn": "PES1202502330",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Siddhartha Roy",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Male",
        "campus": "EC Campus",
        "email": "siddhartha.roy@pes.edu",
        "phone": "9920778899",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/siddhartharoy",
        "interests": [
            "Backend",
            "Cloud & DevOps",
            "Data Engineering"
        ],
        "skills": [
            "Go",
            "Redis",
            "RabbitMQ",
            "Docker",
            "MongoDB"
        ],
        "bio": "Backend systems engineer focused on high-speed event streaming, task queues, and resilient database replication.",
        "looking_for_team": true,
        "preferred_roles": [
            "Backend Specialist",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-16T03:00:00.000Z",
        "updated_at": "2026-08-16T03:00:00.000Z"
    },
    {
        "srn": "PES1UG25BT058",
        "prn": "PES1202503058",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Anwita Rao",
        "department": "Biotechnology",
        "branch": "BT",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "anwita.rao@pes.edu",
        "phone": "9920889900",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/anwitarao",
        "interests": [
            "Domain / Pitch Specialist",
            "Data Engineering",
            "Machine Learning"
        ],
        "skills": [
            "Python",
            "R",
            "Biopython",
            "Data Analytics",
            "Genomics"
        ],
        "bio": "Biotechnology enthusiast applying data science and synthetic biology for water safety and pathogen identification.",
        "looking_for_team": true,
        "preferred_roles": [
            "Domain / Pitch Specialist",
            "Data Scientist / Analyst"
        ],
        "created_at": "2026-08-16T03:30:00.000Z",
        "updated_at": "2026-08-16T03:30:00.000Z"
    },
    {
        "srn": "PES1UG24EE049",
        "prn": "PES1202401049",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Rohit Krishnan",
        "department": "Electrical & Electronics",
        "branch": "EEE",
        "semester": 6,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "rohit.krishnan@pes.edu",
        "phone": "9930001122",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/rohitkrishnan-ee",
        "interests": [
            "Embedded Systems",
            "IoT & Robotics",
            "Hardware / Embedded Systems Lead"
        ],
        "skills": [
            "Embedded C",
            "MATLAB",
            "CAN Bus",
            "KiCad",
            "STM32"
        ],
        "bio": "Automotive telemetry and BMS hardware engineer specializing in vehicle control units and industrial CAN buses.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead"
        ],
        "created_at": "2026-08-16T04:00:00.000Z",
        "updated_at": "2026-08-16T04:00:00.000Z"
    },
    {
        "srn": "PES1UG25DE042",
        "prn": "PES1202504042",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Nandita Iyer",
        "department": "Design & Architecture",
        "branch": "DES",
        "semester": 4,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "nandita.iyer@pes.edu",
        "phone": "9930112233",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/nanditaiyer",
        "interests": [
            "UI/UX Design",
            "Frontend",
            "AR / VR"
        ],
        "skills": [
            "Figma",
            "After Effects",
            "Lottie",
            "Tailwind CSS",
            "User Journey Mapping"
        ],
        "bio": "Product designer and motion specialist designing micro-interactions and high-converting presentation decks.",
        "looking_for_team": true,
        "preferred_roles": [
            "UI/UX Designer",
            "Domain / Pitch Specialist"
        ],
        "created_at": "2026-08-16T04:30:00.000Z",
        "updated_at": "2026-08-16T04:30:00.000Z"
    },
    {
        "srn": "PES1UG26CS110",
        "prn": "PES1202602110",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Varun Shenoy",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 2,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "varun.shenoy@pes.edu",
        "phone": "9930223344",
        "photo_url": "",
        "hackathon_count": 1,
        "github_url": "https://github.com/varunshenoy",
        "interests": [
            "Backend",
            "Data Engineering",
            "Full Stack"
        ],
        "skills": [
            "C++",
            "Python",
            "Competitive Programming",
            "Graph Algorithms"
        ],
        "bio": "Algorithm and graph optimization specialist passionate about routing algorithms and high performance computing.",
        "looking_for_team": true,
        "preferred_roles": [
            "Backend Specialist",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-16T05:00:00.000Z",
        "updated_at": "2026-08-16T05:00:00.000Z"
    },
    {
        "srn": "PES1UG24AM415",
        "prn": "PES1202404415",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Kavitha Sundar",
        "department": "AI & Machine Learning",
        "branch": "AIML",
        "semester": 6,
        "gender": "Female",
        "campus": "EC Campus",
        "email": "kavitha.sundar@pes.edu",
        "phone": "9930334455",
        "photo_url": "",
        "hackathon_count": 4,
        "github_url": "https://github.com/kavithasundar",
        "interests": [
            "Computer Vision",
            "Deep Learning",
            "Cloud & DevOps"
        ],
        "skills": [
            "PyTorch",
            "OpenCV",
            "TensorRT",
            "FastAPI",
            "Docker"
        ],
        "bio": "Real-time AI video analytics and edge inference expert. Optimizing vision models for sub-20ms latency.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Team Lead"
        ],
        "created_at": "2026-08-16T05:30:00.000Z",
        "updated_at": "2026-08-16T05:30:00.000Z"
    },
    {
        "srn": "PES1UG25CS780",
        "prn": "PES1202503780",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Prateek Hegde",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "prateek.hegde@pes.edu",
        "phone": "9930445566",
        "photo_url": "",
        "hackathon_count": 4,
        "github_url": "https://github.com/prateekhegde",
        "interests": [
            "Cloud & DevOps",
            "Backend",
            "Data Engineering"
        ],
        "skills": [
            "Kubernetes",
            "Helm",
            "Prometheus",
            "Grafana",
            "Terraform",
            "AWS"
        ],
        "bio": "Site reliability and cloud DevOps specialist creating self-healing infrastructure, observability dashboards, and load-tested clusters.",
        "looking_for_team": true,
        "preferred_roles": [
            "Backend Specialist",
            "Team Lead"
        ],
        "created_at": "2026-08-16T06:00:00.000Z",
        "updated_at": "2026-08-16T06:00:00.000Z"
    },
    {
        "srn": "PES1UG25EC420",
        "prn": "PES1202504420",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Meghana Murthy",
        "department": "Electronics & Communication",
        "branch": "ECE",
        "semester": 4,
        "gender": "Female",
        "campus": "EC Campus",
        "email": "meghana.murthy@pes.edu",
        "phone": "9930556677",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/meghanamurthy",
        "interests": [
            "Embedded Systems",
            "IoT & Robotics",
            "Mobile App (Flutter/React Native)"
        ],
        "skills": [
            "ESP32",
            "Nordic nRF52",
            "BLE",
            "Embedded C",
            "MQTT"
        ],
        "bio": "Bluetooth Low Energy (BLE) and wearables developer connecting low-power smart hardware to mobile companion apps.",
        "looking_for_team": true,
        "preferred_roles": [
            "Hardware / Embedded Systems Lead",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-16T06:30:00.000Z",
        "updated_at": "2026-08-16T06:30:00.000Z"
    },
    {
        "srn": "PES1UG24CS670",
        "prn": "PES1202403670",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Vikas Chandran",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 6,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "vikas.chandran@pes.edu",
        "phone": "9930667788",
        "photo_url": "",
        "hackathon_count": 3,
        "github_url": "https://github.com/vikaschandran",
        "interests": [
            "Blockchain & Web3",
            "Cybersecurity",
            "Full Stack"
        ],
        "skills": [
            "Solidity",
            "Circom",
            "Hardhat",
            "Ethers.js",
            "Next.js"
        ],
        "bio": "Zero knowledge proof and blockchain privacy researcher creating tamper-proof citizen verification protocols.",
        "looking_for_team": true,
        "preferred_roles": [
            "Full Stack Developer",
            "Backend Specialist"
        ],
        "created_at": "2026-08-16T07:00:00.000Z",
        "updated_at": "2026-08-16T07:00:00.000Z"
    },
    {
        "srn": "PES1UG25AM190",
        "prn": "PES1202501190",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Aakash Somasekhar",
        "department": "AI & Machine Learning",
        "branch": "AIML",
        "semester": 4,
        "gender": "Male",
        "campus": "RR Campus",
        "email": "aakash.soma@pes.edu",
        "phone": "9930778899",
        "photo_url": "",
        "hackathon_count": 2,
        "github_url": "https://github.com/aakashsomasekhar",
        "interests": [
            "Natural Language Processing",
            "Data Engineering",
            "Machine Learning"
        ],
        "skills": [
            "Neo4j",
            "LangChain",
            "SentenceTransformers",
            "Python",
            "FastAPI"
        ],
        "bio": "Knowledge graph architect combining graph databases with vector embeddings for hallucination-free legal and scientific research.",
        "looking_for_team": true,
        "preferred_roles": [
            "AI / ML Engineer",
            "Backend Specialist"
        ],
        "created_at": "2026-08-16T07:30:00.000Z",
        "updated_at": "2026-08-16T07:30:00.000Z"
    },
    {
        "srn": "PES1UG23CS290",
        "prn": "PES1202303290",
        "passwordHash": "a905fd4ab895a6877c0d522b42601694da19b56be6d0d644c2cd6ee5265ebc1c90ec2e15058b9eb06577c0e9cf0e872a6eb9d67a715087f2fd84ae839e6c0f5b",
        "salt": "6ba6e622de36c13856a706ed64d09842",
        "name": "Shreya Narayanan",
        "department": "Computer Science & Engineering",
        "branch": "CSE",
        "semester": 8,
        "gender": "Female",
        "campus": "RR Campus",
        "email": "shreya.narayanan@pes.edu",
        "phone": "9930889900",
        "photo_url": "",
        "hackathon_count": 6,
        "github_url": "https://github.com/shreyanarayanan",
        "interests": [
            "Full Stack",
            "Cloud & DevOps",
            "UI/UX Design"
        ],
        "skills": [
            "React",
            "Node.js",
            "Microservices",
            "System Design",
            "CI/CD"
        ],
        "bio": "Senior 4th year team captain, 6x hackathon winner, and full stack lead experienced in building complete end-to-end hackathon solutions.",
        "looking_for_team": true,
        "preferred_roles": [
            "Team Lead",
            "Full Stack Developer"
        ],
        "created_at": "2026-08-16T08:00:00.000Z",
        "updated_at": "2026-08-16T08:00:00.000Z"
    }
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
