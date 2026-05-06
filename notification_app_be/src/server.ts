import { flushLogs, Log } from 'affordmed-logging-middleware';
import app from './app';
import { env } from './config/env';

const server = app.listen(env.port, async () => {
  await Log('backend', 'info', 'config', `Server startup port=${env.port} env=${env.nodeEnv}`);
});

const shutdown = async (signal: string): Promise<void> => {
  await Log('backend', 'warn', 'config', `Graceful shutdown signal=${signal}`);
  await flushLogs();
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
