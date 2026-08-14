import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { apiRouter } from '../server/api';

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global error logger
app.use((req, _res, next) => {
  console.log(`[Vercel Serverless] ${req.method} ${req.url}`);
  next();
});

// Mount the API router
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'PESquad Serverless API' });
});

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Vercel API Error]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
