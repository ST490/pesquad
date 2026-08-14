import express from 'express';
import cookieParser from 'cookie-parser';
import { apiRouter } from '../server/api';

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount the API router
app.use('/api', apiRouter);
// Also support direct path if stripped by Vercel
app.use('/', apiRouter);

export default app;
