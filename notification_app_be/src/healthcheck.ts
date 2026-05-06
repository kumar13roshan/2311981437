import app from './app';

if (!app) {
  throw new Error('Express app failed to load');
}

console.info('backend healthcheck ok');
