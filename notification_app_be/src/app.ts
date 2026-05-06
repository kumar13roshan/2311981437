import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Log } from 'affordmed-logging-middleware';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestIdMiddleware } from './middleware/requestIdMiddleware';
import { requestLogger } from './middleware/requestLogger';
import notificationRoutes from './routes/notificationRoutes';
import { successResponse } from './utils/responseFormatter';

const jsonBodyLimit = '1mb';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: jsonBodyLimit }));
app.use(express.urlencoded({ extended: true }));
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.get('/health', async (_req, res) => {
  await Log('backend', 'info', 'route', 'Health check route hit');
  return successResponse(res, 200, 'Notification API is healthy', {
    environment: env.nodeEnv,
    uptime: process.uptime(),
  });
});

app.use(`${env.apiPrefix}/notifications`, notificationRoutes);
app.use('/notifications', notificationRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
