export type Review = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
};

export type Tutor = {
  id: string;
  name: string;
  avatarId: string;
  subject: string;
  subjects: string[];
  headline: string;
  bio: string;
  qualifications: string[];
  experience: string;
  rating: number;
  reviews: Review[];
  pricePerHour: number;
  availability: 'Full-time' | 'Part-time' | 'Weekends only';
};

export const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'English',
  'Computer Science',
  'Spanish',
] as const;

export type Subject = (typeof subjects)[number];
