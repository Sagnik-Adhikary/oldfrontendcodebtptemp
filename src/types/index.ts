export interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  price_range?: string;
  delivery_time?: string;
  image_url?: string;
  created_at: string;
  provider_name?: string;
  provider_avatar?: string;
  provider?: {
    id: number;
    name: string;
    avatar?: string;
    bio?: string;
    email?: string;
  };
  is_active?: boolean;
}

export interface ServiceRequest {
  id: number;
  user_id: number;
  service_id?: number;
  project_type: string;
  description: string;
  budget_range?: string;
  status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    type: 'Podcast' | 'Seminar' | 'Webinar' | 'Fundae Session' | 'Meeting';
    date: string;
    time: string;
    location: string;
    image_url?: string;
    speaker_name?: string;
    speaker_bio?: string;
    speaker_image?: string;
    speaker_contact?: string;
    created_at: string;
    attendee_count?: number;
    is_enrolled?: boolean;
}

export interface EventAttendee {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    enrolled_at: string;
}
