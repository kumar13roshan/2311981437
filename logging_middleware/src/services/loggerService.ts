import { AuthService } from '../auth/authService';
import { createDefaultConfig, type LoggerConfig } from '../config/loggerConfig';
import { createApiClient } from './apiClient';
import { LogQueue } from './logQueue';
import { validateLogInput } from '../validators/logValidator';
import { writeConsoleFallback } from '../utils/consoleFallback';

export class LoggerService {
  private readonly queue: LogQueue;

  private readonly auth: AuthService;

  constructor(configOverrides: Partial<LoggerConfig> = {}) {
    const config = createDefaultConfig(configOverrides);
    const client = createApiClient(config);
    this.auth = new AuthService(config, client);
    this.queue = new LogQueue(config, client, this.auth);
  }

  async Log(stack: string, level: string, packageName: string, message: string): Promise<void> {
    try {
      const input = validateLogInput(stack, level, packageName, message);
      const payload = this.queue.enqueue(input.stack, input.level, input.packageName, input.message);
      writeConsoleFallback(true, input.level, input.message, {
        local: true,
        stack: input.stack,
        package: input.packageName,
        requestId: payload.requestId,
      });
    } catch (error: any) {
      writeConsoleFallback(true, 'warn', 'log validation failed', {
        reason: error?.message || 'unknown',
      });
    }
  }

  async flush(): Promise<void> {
    await this.queue.flush();
  }

  async authenticate(): Promise<string> {
    return this.auth.getToken();
  }

  async register(): Promise<{ clientID: string; clientSecret: string }> {
    return this.auth.register();
  }
}

export const createLogger = (config?: Partial<LoggerConfig>): LoggerService => new LoggerService(config);
