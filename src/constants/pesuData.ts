export const PESU_DEPARTMENTS = [
  'Computer Science & Engineering',
  'AI & Machine Learning',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Biotechnology',
  'Design & Architecture',
] as const;

export type DepartmentType = (typeof PESU_DEPARTMENTS)[number];

export const AVAILABLE_INTERESTS = [
  'Frontend',
  'Backend',
  'Full Stack',
  'Machine Learning',
  'Deep Learning',
  'UI/UX Design',
  'Computer Vision',
  'Natural Language Processing',
  'IoT & Robotics',
  'Embedded Systems',
  'Blockchain & Web3',
  'Cloud & DevOps',
  'Cybersecurity',
  'Mobile App (Flutter/React Native)',
  'Data Engineering',
  'AR / VR',
] as const;

export type InterestType = (typeof AVAILABLE_INTERESTS)[number];

export const CAMPUS_OPTIONS = ['RR Campus', 'EC Campus'] as const;
export type CampusType = (typeof CAMPUS_OPTIONS)[number];

export const SQUAD_ROLES = [
  'Team Lead',
  'Full Stack Developer',
  'AI / ML Engineer',
  'Hardware / Embedded Systems Lead',
  'UI/UX Designer',
  'Backend Specialist',
  'Domain / Pitch Specialist',
] as const;
