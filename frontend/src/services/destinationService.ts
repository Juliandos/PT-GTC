import api from './api';
import { Destination, DestinationListResponse, DestinationFilters, DestinationFormData } from '../types';

export const destinationService = {
  // Get all destinations with filters
  getAll: async (filters?: DestinationFilters): Promise<DestinationListResponse> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.type) params.append('type', filters.type);
    if (filters?.countryCode) params.append('countryCode', filters.countryCode);

    const response = await api.get<DestinationListResponse>(
      `/api/destinations?${params.toString()}`
    );
    return response.data;
  },

  // Get destination by ID
  getById: async (id: number): Promise<Destination> => {
    const response = await api.get<Destination>(`/api/destinations/${id}`);
    return response.data;
  },

  // Create destination
  create: async (data: DestinationFormData): Promise<Destination> => {
    const response = await api.post<Destination>('/api/destinations', data);
    return response.data;
  },

  // Update destination
  update: async (id: number, data: Partial<DestinationFormData>): Promise<Destination> => {
    const response = await api.put<Destination>(`/api/destinations/${id}`, data);
    return response.data;
  },

  // Delete destination
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/destinations/${id}`);
  },
};

