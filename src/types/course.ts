export interface Course {
  id: number;
  title: string;
  description: string;
  perks?: string;
  timeline?: string;
  duration?: string;
  assignments?: string;
  category: string;
  image_url?: string;
  price?: number;
  start_date?: string;
  created_at: string;
  enrollment_count?: number;
  // Instructor fields
  instructor_name?: string;
  instructor_bio?: string;
  instructor_image?: string;
  // Curriculum fields
  what_you_learn?: string;
  requirements?: string;
  lessons?: string;
  skill_tags?: string;
  lessons_count?: number;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: 'pending' | 'approved' | 'rejected';
  payment_status: 'pending' | 'paid';
  enrolled_at: string;
  name?: string;
  email?: string;
  avatar?: string;
}
