export interface Company {
  id: string;
  name: string;
  location: string;
  value: string;
  leadScore: number;
  industry: string;
  description: string;
  isPro?: boolean;
  shipmentHistory?: Shipment[];
  contactInfo?: ContactInfo;
}

export interface Shipment {
  date: string;
  product: string;
  volume: string;
  port: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website: string;
}

export type UserPlan = 'free' | 'pro';

export interface AuthState {
  user: {
    email: string;
    plan: UserPlan;
  } | null;
  isAuthenticated: boolean;
}
