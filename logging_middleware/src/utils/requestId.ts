export const createRequestId = (): string => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};
