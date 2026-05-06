import dotenv from 'dotenv';

dotenv.config();

const defaultPort = 5000;
const defaultApiPrefix = '/api/v1';
const defaultCorsOrigin = '*';
const defaultRateLimitWindowMs = 60_000;
const defaultRateLimitMax = 120;

const numberValue = (key: string, fallback: number): number => {
  const parsed = Number(process.env[key]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: numberValue('PORT', defaultPort),
  apiPrefix: process.env.API_PREFIX || defaultApiPrefix,
  corsOrigin: process.env.CORS_ORIGIN || defaultCorsOrigin,
  rateLimitWindowMs: numberValue('RATE_LIMIT_WINDOW_MS', defaultRateLimitWindowMs),
  rateLimitMax: numberValue('RATE_LIMIT_MAX', defaultRateLimitMax),
  evaluationBaseUrl: process.env.EVALUATION_BASE_URL || '',
};
