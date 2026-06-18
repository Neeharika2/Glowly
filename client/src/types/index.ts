export interface Service {
  id: number;
  salonId: number;
  name: string;
  price: number;
  duration?: number;
  category?: string;
}

export interface Stylist {
  id: number;
  salonId: number;
  name: string;
  bio?: string;
  avatar?: string;
  rating: number;
  specialization?: string;
}

export interface Salon {
  id: number;
  name: string;
  description: string;
  address: string;
  area: string;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string;
  latitude?: number;
  longitude?: number;
  priceRange: '₹' | '₹₹' | '₹₹₹';
  services: Service[];
  stylists?: Stylist[];
  phone?: string;
  openHours?: string;
  tags?: string;
  featured?: boolean;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  salonId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  userId: number;
  salonId: number;
  serviceId: number;
  stylistId?: number;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  salon?: { name: string; image?: string; address: string; area: string };
  service?: { name: string; price: number };
  stylist?: { name: string; specialization?: string };
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SalonMatchInput {
  occasion: string;
  hairType: string;
  skinType: string;
  budget: string;
  area: string;
}

export interface SalonMatchResult {
  salon: Salon;
  matchScore: number;
  reason: string;
  recommendedServices: string[];
}

export interface ReviewSummary {
  pros: string[];
  cons: string[];
  sentiment: string;
  score: number;
}

export interface AISearchFilters {
  area?: string;
  priceRange?: string;
  minRating?: number;
  services?: string[];
  occasion?: string;
  keywords?: string;
}
