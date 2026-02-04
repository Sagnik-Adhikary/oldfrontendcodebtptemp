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
