// Tipos para la aplicación

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export type DestinationType = 'Beach' | 'Mountain' | 'City' | 'Cultural' | 'Adventure';

export interface Destination {
  id: number;
  name: string;
  description: string;
  countryCode: string;
  type: DestinationType;
  lastModif: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DestinationFormData {
  name: string;
  description: string;
  countryCode: string;
  type: DestinationType;
}

export interface DestinationListResponse {
  destinations: Destination[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DestinationFilters {
  page?: number;
  limit?: number;
  type?: DestinationType;
  countryCode?: string;
}

