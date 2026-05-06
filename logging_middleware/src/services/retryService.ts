import { sleep } from '../utils/sleep';

export const retry = async <T>(
  operation: (attempt: number) => Promise<T>,
  attempts: number,
  delayMs: number,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(delayMs * attempt);
    }
  }

  throw lastError;
};
