import {
  ALL_PACKAGES,
  BACKEND_PACKAGES,
  FRONTEND_PACKAGES,
  LEVELS,
  SHARED_PACKAGES,
  STACKS,
  type Level,
  type PackageName,
  type Stack,
} from '../constants/loggerConstants';

export interface LogInput {
  stack: Stack;
  level: Level;
  packageName: PackageName;
  message: string;
}

export const validateLogInput = (
  stack: string,
  level: string,
  packageName: string,
  message: string,
): LogInput => {
  if (!STACKS.includes(stack as Stack)) {
    throw new Error(`Invalid stack "${stack}". Allowed: ${STACKS.join(', ')}`);
  }

  if (!LEVELS.includes(level as Level)) {
    throw new Error(`Invalid level "${level}". Allowed: ${LEVELS.join(', ')}`);
  }

  if (!ALL_PACKAGES.includes(packageName as PackageName)) {
    throw new Error(`Invalid package "${packageName}". Allowed: ${ALL_PACKAGES.join(', ')}`);
  }

  const packageAllowed =
    SHARED_PACKAGES.includes(packageName as never) ||
    (stack === 'backend' && BACKEND_PACKAGES.includes(packageName as never)) ||
    (stack === 'frontend' && FRONTEND_PACKAGES.includes(packageName as never));

  if (!packageAllowed) {
    throw new Error(`Package "${packageName}" is not valid for stack "${stack}"`);
  }

  if (typeof message !== 'string' || message.trim().length === 0) {
    throw new Error('Log message must be a non-empty string');
  }

  return {
    stack: stack as Stack,
    level: level as Level,
    packageName: packageName as PackageName,
    message: message.trim(),
  };
};
