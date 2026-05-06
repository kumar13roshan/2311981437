import { httpClient } from './httpClient';
import type { ApiResponse, Notification } from '../types/notification';

export interface NotificationQuery {
  page: number;
  limit: number;
  type?: string;
  read?: boolean;
}

export const notificationApi = {
  async list(query: NotificationQuery): Promise<ApiResponse<Notification[]>> {
    const response = await httpClient.get<ApiResponse<Notification[]>>('/notifications', { params: query });
    return response.data;
  },

  async priority(limit = 10): Promise<ApiResponse<Notification[]>> {
    const response = await httpClient.get<ApiResponse<Notification[]>>('/notifications/priority', { params: { limit } });
    return response.data;
  },

  async create(payload: Pick<Notification, 'title' | 'message' | 'type'>): Promise<ApiResponse<Notification>> {
    const response = await httpClient.post<ApiResponse<Notification>>('/notifications', payload);
    return response.data;
  },

  async markRead(id: string): Promise<ApiResponse<Notification>> {
    const response = await httpClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return response.data;
  },

  async remove(id: string): Promise<ApiResponse<null>> {
    const response = await httpClient.delete<ApiResponse<null>>(`/notifications/${id}`);
    return response.data;
  },
};
