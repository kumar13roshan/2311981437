import crypto from 'node:crypto';

export const createRequestId = (): string => crypto.randomUUID();
