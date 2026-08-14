export interface UserProfile {
  srn: string;
  prn?: string;
  name: string;
  department: string;
  branch?: string;
  semester: number;
  gender?: 'Male' | 'Female' | 'Other';
  hackathon_count: number;
  github_url: string;
  photo_url: string;
  interests: string[];
  bio?: string;
  skills?: string[];
  campus?: 'RR Campus' | 'EC Campus';
  email?: string;
  phone?: string;
  looking_for_team?: boolean;
  preferred_roles?: string[];
  created_at: string;
  linkedin_url?: string;
  portfolio_url?: string;
}

export interface PostComment {
  id: string;
  author_srn: string;
  author_name: string;
  author_photo: string;
  body: string;
  created_at: string;
}

export interface Post {
  id: string;
  author_srn: string;
  author_name: string;
  author_photo: string;
  author_dept: string;
  author_semester: number;
  body: string;
  hashtags: string[];
  created_at: string;
  likes_count: number;
  liked_by: string[];
  looking_for_team: boolean;
  comments_count: number;
  comments?: PostComment[];
}

export interface ConnectionInvite {
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
    discord?: string;
    phone?: string;
  };
}

export interface PESUOAuthUser {
  srn: string;
  prn?: string;
  name: string;
  program?: string;
  branch?: string;
  semester?: number;
  section?: string;
  gender?: 'Male' | 'Female' | 'Other';
  campus?: 'RR Campus' | 'EC Campus';
  photo_base64?: string;
  email?: string;
}

export type PageRoute = 'login' | 'onboarding' | 'discover' | 'chat' | 'profile' | '404';

export interface FilterOptions {
  searchQuery: string;
  department: string;
  semester: string;
  gender?: string;
  minHackathons: number;
  sortBy: 'experience' | 'newest' | 'alphabetical';
  selectedInterest?: string;
}
