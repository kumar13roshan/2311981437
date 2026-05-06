export const STACKS = ['backend', 'frontend'] as const;
export const LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const;

export const BACKEND_PACKAGES = [
  'cache',
  'controller',
  'cron_job',
  'db',
  'domain',
  'handler',
  'repository',
  'route',
  'service',
] as const;

export const FRONTEND_PACKAGES = [
  'api',
  'component',
  'hook',
  'page',
  'state',
  'style',
] as const;

export const SHARED_PACKAGES = ['auth', 'config', 'middleware', 'utils'] as const;
export const ALL_PACKAGES = [...BACKEND_PACKAGES, ...FRONTEND_PACKAGES, ...SHARED_PACKAGES] as const;

export type Stack = (typeof STACKS)[number];
export type Level = (typeof LEVELS)[number];
export type PackageName = (typeof ALL_PACKAGES)[number];
