interface ImportMetaEnv {
  readonly VITE_BACKEND_BASE_URL?: string;
  readonly VITE_API_PREFIX?: string;
  readonly VITE_EVALUATION_BASE_URL?: string;
  readonly VITE_EVALUATION_REGISTER_PATH?: string;
  readonly VITE_EVALUATION_AUTH_PATH?: string;
  readonly VITE_EVALUATION_LOGS_PATH?: string;
  readonly VITE_ACCESS_CODE?: string;
  readonly VITE_EMAIL?: string;
  readonly VITE_NAME?: string;
  readonly VITE_MOBILE_NO?: string;
  readonly VITE_GITHUB_USERNAME?: string;
  readonly VITE_ROLL_NO?: string;
  readonly VITE_CLIENT_ID?: string;
  readonly VITE_CLIENT_SECRET?: string;
  readonly VITE_LOG_TIMEOUT_MS?: string;
  readonly VITE_LOG_RETRY_ATTEMPTS?: string;
  readonly VITE_LOG_RETRY_DELAY_MS?: string;
  readonly VITE_LOG_BATCH_SIZE?: string;
  readonly VITE_LOG_FLUSH_INTERVAL_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
