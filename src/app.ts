import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './lib/config';
import { logger } from './lib/logger';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

import { noteRoutes } from './routes/note.routes';

const app = express();

// === MIDDLEWARE (runs on every request) ===
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// === REQUEST LOGGING ===
app.use((req, res, next) => {
  logger.info({
    event: 'request:received',
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  next();
});

// === HEALTH CHECK ===
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// === ROUTES (mounted here as they are built) ===
app.use('/api/v1/notes', noteRoutes);

// === 404 HANDLER (no route matched) ===
app.use(notFoundHandler);

// === ERROR HANDLER (must be last middleware) ===
app.use(errorHandler);

export { app };
