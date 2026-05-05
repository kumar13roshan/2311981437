import axios from 'axios';
import { Log } from './logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  await Log('frontend', 'info', 'api', `${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  async (response) => {
    await Log('frontend', 'debug', 'api', `response ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    await Log('frontend', 'error', 'api', error.message);
    throw error;
  }
);

export async function getNotifications({ studentId, page, limit, type }) {
  const response = await api.get('/notifications', {
    params: {
      studentId,
      page,
      limit,
      ...(type ? { type } : {}),
    },
  });

  return response.data;
}

export async function getPriorityNotifications(studentId) {
  const response = await api.get('/notifications/priority', {
    params: { studentId },
  });

  return response.data.notifications;
}

export async function markNotificationAsRead(id) {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
}

