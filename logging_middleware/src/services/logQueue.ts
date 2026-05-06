import type { AxiosInstance } from 'axios';
import type { LoggerConfig } from '../config/loggerConfig';
import type { Level, PackageName, Stack } from '../constants/loggerConstants';
import type { AuthService } from '../auth/authService';
import { retry } from './retryService';
import { writeConsoleFallback } from '../utils/consoleFallback';
import { nowIso } from '../utils/time';
import { createRequestId } from '../utils/requestId';

export interface LogPayload {
  stack: Stack;
  level: Level;
  package: PackageName;
  message: string;
  timestamp: string;
  requestId: string;
}

export class LogQueue {
  private queue: LogPayload[] = [];

  private flushing = false;

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly config: LoggerConfig,
    private readonly client: AxiosInstance,
    private readonly auth: AuthService,
  ) {}

  enqueue(stack: Stack, level: Level, packageName: PackageName, message: string): LogPayload {
    const payload: LogPayload = {
      stack,
      level,
      package: packageName,
      message,
      timestamp: nowIso(),
      requestId: createRequestId(),
    };

    this.queue.push(payload);
    this.ensureTimer();

    if (this.queue.length >= this.config.batchSize) {
      void this.flush();
    }

    return payload;
  }

  async flush(): Promise<void> {
    if (this.flushing || this.queue.length === 0) return;
    if (!this.canSendRemoteLogs()) {
      this.queue.splice(0, this.config.batchSize);
      return;
    }

    this.flushing = true;
    const batch = this.queue.splice(0, this.config.batchSize);

    try {
      await retry(async () => {
        const token = await this.auth.getToken();
        for (const payload of batch) {
          try {
            await this.client.post(
              this.config.logsPath,
              {
                stack: payload.stack,
                level: payload.level,
                package: payload.package,
                message: payload.message,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );
          } catch (error: any) {
            if (error?.response?.status === 401 || error?.response?.status === 429) {
              this.auth.clearToken();
            }
            throw error;
          }
        }
      }, this.config.retryAttempts, this.config.retryDelayMs);
    } catch (error: any) {
      batch.forEach((payload) => {
        writeConsoleFallback(this.config.consoleFallback, payload.level, payload.message, {
          remoteDelivery: 'failed',
          reason: error?.response?.data || error?.message || 'unknown',
          requestId: payload.requestId,
        });
      });
    } finally {
      this.flushing = false;
    }
  }

  private ensureTimer(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      void this.flush();
    }, this.config.flushIntervalMs);

    const timerWithUnref = this.timer as unknown as { unref?: () => void };
    if (typeof timerWithUnref.unref === 'function') {
      timerWithUnref.unref();
    }
  }

  private canSendRemoteLogs(): boolean {
    return Boolean(
      this.config.evaluationBaseUrl
      && this.config.email
      && this.config.name
      && this.config.rollNo
      && this.config.accessCode,
    );
  }
}
