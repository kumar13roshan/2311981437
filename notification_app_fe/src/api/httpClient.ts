import axios from 'axios';
import { logFrontend } from '../services/logger';

const defaultApiPrefix = '/api/v1';
const requestTimeoutMs = 8000;
const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL || '';
const apiPrefix = import.meta.env.VITE_API_PREFIX || defaultApiPrefix;

export const httpClient = axios.create({
  baseURL: `${backendBaseUrl}${apiPrefix}`,
  timeout: requestTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  void logFrontend('info', 'api', `API request ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    void logFrontend('info', 'api', `API success ${response.config.url} status=${response.status}`);
    return response;
  },
  (error) => {
    void logFrontend('error', 'api', `API failure ${error.config?.url} status=${error.response?.status || 'network'}`);
    return Promise.reject(error);
  },
);
