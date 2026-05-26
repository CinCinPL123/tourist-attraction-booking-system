export interface Review {
  id: number;
  attractionId: number;
  author: string;
  rating: number;
  comment: string;
  reply: string;
  isFlagged: boolean;
  attraction?: Attraction;
}

export interface Attraction {
  id: number;
  title: string;
  category: string;
  price: number;
  kidFriendly: boolean;
  rating: number;
  lat: number;
  lng: number;
  image: string;
  desc: string;
  isApproved: boolean;
  providerName: string;
  reviews?: Review[];
}

export interface Booking {
  id: number;
  attractionId: number;
  userId?: number;
  date: string;
  ticketsCount: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'declined';
  attraction?: Attraction;
}

export interface CmsPage {
  slug: string;
  title: string;
  content: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'tourist' | 'provider' | 'admin';
  phoneNumber?: string;
  companyName?: string;
  description?: string;
  taxNumber?: string;
  roleLevel?: number;
}

export interface Category {
  id: number;
  name: string;
}
