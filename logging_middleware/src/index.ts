import { createLogger } from './services/loggerService';

export * from './constants/loggerConstants';
export * from './config/loggerConfig';
export * from './services/loggerService';

const defaultLogger = createLogger();

export const Log = async (
  stack: string,
  level: string,
  packageName: string,
  message: string,
): Promise<void> => defaultLogger.Log(stack, level, packageName, message);

export const flushLogs = async (): Promise<void> => defaultLogger.flush();
export const authenticate = async (): Promise<string> => defaultLogger.authenticate();
export const register = async (): Promise<{ clientID: string; clientSecret: string }> => defaultLogger.register();
