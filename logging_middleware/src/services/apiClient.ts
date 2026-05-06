import axios, { type AxiosInstance } from 'axios';
import type { LoggerConfig } from '../config/loggerConfig';
import { createRequestId } from '../utils/requestId';

export const createApiClient = (config: LoggerConfig): AxiosInstance => {
  const client = axios.create({
    baseURL: config.evaluationBaseUrl,
    timeout: config.timeoutMs,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((requestConfig) => {
    requestConfig.headers.set('X-Request-Id', createRequestId());
    return requestConfig;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  );

  return client;
};
