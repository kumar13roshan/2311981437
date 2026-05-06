import { createLogger } from 'affordmed-logging-middleware';

const defaultRegisterPath = '/register';
const defaultAuthPath = '/auth';
const defaultLogsPath = '/logs';

export const frontendLogger = createLogger({
  evaluationBaseUrl: import.meta.env.VITE_EVALUATION_BASE_URL,
  registerPath: import.meta.env.VITE_EVALUATION_REGISTER_PATH || defaultRegisterPath,
  authPath: import.meta.env.VITE_EVALUATION_AUTH_PATH || defaultAuthPath,
  logsPath: import.meta.env.VITE_EVALUATION_LOGS_PATH || defaultLogsPath,
  accessCode: import.meta.env.VITE_ACCESS_CODE,
  email: import.meta.env.VITE_EMAIL,
  name: import.meta.env.VITE_NAME,
  mobileNo: import.meta.env.VITE_MOBILE_NO,
  githubUsername: import.meta.env.VITE_GITHUB_USERNAME,
  rollNo: import.meta.env.VITE_ROLL_NO,
  clientID: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
});

export const logFrontend = async (level: string, packageName: string, message: string): Promise<void> => {
  await frontendLogger.Log('frontend', level, packageName, message);
};
