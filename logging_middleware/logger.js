const axios = require('axios');

const LOG_API_URL = process.env.LOG_API_URL || 'http://20.207.122.201/evaluation-service/logs';

const allowedStacks = new Set(['backend', 'frontend']);
const allowedLevels = new Set(['debug', 'info', 'warn', 'error', 'fatal']);
const allowedPackages = new Set([
  'cache',
  'controller',
  'cron_job',
  'db',
  'domain',
  'handler',
  'repository',
  'route',
  'service',
  'api',
  'component',
  'hook',
  'page',
  'state',
  'style',
  'auth',
  'config',
  'middleware',
  'utils',
]);

const validateLogInput = (stack, level, pkg, message) => {
  if (!allowedStacks.has(stack)) throw new Error(`Invalid stack: ${stack}`);
  if (!allowedLevels.has(level)) throw new Error(`Invalid level: ${level}`);
  if (!allowedPackages.has(pkg)) throw new Error(`Invalid package: ${pkg}`);
  if (typeof message !== 'string' || message.trim().length === 0) {
    throw new Error('Log message must be a non-empty string');
  }
};

async function Log(stack, level, pkg, message) {
  try {
    validateLogInput(stack, level, pkg, message);

    const headers = {
      'Content-Type': 'application/json',
    };

    if (process.env.LOG_ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${process.env.LOG_ACCESS_TOKEN}`;
    }

    const payload = {
      stack,
      level,
      package: pkg,
      message,
    };

    const response = await axios.post(LOG_API_URL, payload, { headers, timeout: 3000 });
    return response.data;
  } catch (error) {
    const reason = error.response?.data || error.message;
    console.error('Logging middleware failed:', reason);
    return null;
  }
}

module.exports = { Log };

