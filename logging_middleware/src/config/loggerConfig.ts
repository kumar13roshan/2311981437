export interface EvaluationCredentials {
  email?: string;
  name?: string;
  mobileNo?: string;
  githubUsername?: string;
  rollNo?: string;
  accessCode?: string;
  clientID?: string;
  clientSecret?: string;
}

export interface LoggerConfig extends EvaluationCredentials {
  evaluationBaseUrl: string;
  registerPath: string;
  authPath: string;
  logsPath: string;
  timeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
  batchSize: number;
  flushIntervalMs: number;
  consoleFallback: boolean;
}

const defaultRegisterPath = '/register';
const defaultAuthPath = '/auth';
const defaultLogsPath = '/logs';
const defaultTimeoutMs = 5000;
const defaultRetryAttempts = 3;
const defaultRetryDelayMs = 400;
const defaultBatchSize = 5;
const defaultFlushIntervalMs = 1000;

const envValue = (key: string): string | undefined => {
  const runtimeProcess = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process;
  const nodeEnv = runtimeProcess?.env?.[key];
  if (nodeEnv) return nodeEnv;

  const viteEnv = (globalThis as unknown as { import?: { meta?: { env?: Record<string, string> } } }).import?.meta?.env;
  return viteEnv?.[`VITE_${key}`] || viteEnv?.[key];
};

const numberValue = (key: string, fallback: number): number => {
  const parsed = Number(envValue(key));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const createDefaultConfig = (overrides: Partial<LoggerConfig> = {}): LoggerConfig => ({
  evaluationBaseUrl: envValue('EVALUATION_BASE_URL') || '',
  registerPath: envValue('EVALUATION_REGISTER_PATH') || defaultRegisterPath,
  authPath: envValue('EVALUATION_AUTH_PATH') || defaultAuthPath,
  logsPath: envValue('EVALUATION_LOGS_PATH') || defaultLogsPath,
  timeoutMs: numberValue('LOG_TIMEOUT_MS', defaultTimeoutMs),
  retryAttempts: numberValue('LOG_RETRY_ATTEMPTS', defaultRetryAttempts),
  retryDelayMs: numberValue('LOG_RETRY_DELAY_MS', defaultRetryDelayMs),
  batchSize: numberValue('LOG_BATCH_SIZE', defaultBatchSize),
  flushIntervalMs: numberValue('LOG_FLUSH_INTERVAL_MS', defaultFlushIntervalMs),
  consoleFallback: envValue('LOG_CONSOLE_ENABLED') !== 'false',
  email: envValue('EMAIL'),
  name: envValue('NAME'),
  mobileNo: envValue('MOBILE_NO'),
  githubUsername: envValue('GITHUB_USERNAME'),
  rollNo: envValue('ROLL_NO'),
  accessCode: envValue('ACCESS_CODE'),
  clientID: envValue('CLIENT_ID'),
  clientSecret: envValue('CLIENT_SECRET'),
  ...overrides,
});
