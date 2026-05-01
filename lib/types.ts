export interface SiteSettings {
  company_name: string;
  logo: string;
  favicon: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  linkedin_url: string;
  twitter_url: string;
  facebook_url: string;
  instagram_url: string;
  hero_headline: string;
  hero_subheadline: string;
  stat_projects: number;
  stat_clients: number;
  stat_years: number;
  stat_industries: number;
  seo_title: string;
  seo_description: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  icon: string;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  thumbnail: string;
  client_logo: string;
  tags: Tag[];
  project_url?: string;
  is_featured: boolean;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  summary?: string;
  body: string;
  cover_image: string;
  external_image_url: string;
  category: string;
  author: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  status: string;
  published_at: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role?: string;
  client_title?: string;
  client_company: string;
  avatar?: string;
  content?: string;
  body?: string;
  rating: number;
  order: number;
  is_active?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  features_list: string[];
  tech_stack: string;
  image_url: string;
  demo_url: string;
  price_starting_at: string;
  is_active: boolean;
}

export interface ContactSubmission {
  id: string;
  full_name: string;
  company?: string;
  email: string;
  phone?: string;
  service_interest: string;
  message: string;
  is_read: boolean;
  submitted_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface JWTTokens {
  access: string;
  refresh: string;
}
