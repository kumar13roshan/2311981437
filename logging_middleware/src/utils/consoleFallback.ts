import type { Level } from '../constants/loggerConstants';
import { nowIso } from './time';

export const writeConsoleFallback = (
  enabled: boolean,
  level: Level | 'warn',
  message: string,
  meta: Record<string, unknown> = {},
): void => {
  if (!enabled) return;

  const line = JSON.stringify({
    timestamp: nowIso(),
    level,
    message,
    ...meta,
  });

  if (level === 'error' || level === 'fatal') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.info(line);
};
