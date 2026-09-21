import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { authRouter } from './routes/auth';
import { systemRouter } from './routes/system';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/system', systemRouter);

// Root healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'STEM Learn Backend API', timestamp: new Date().toISOString() });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(import.meta.dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server & Connect MongoDB
async function start() {
  console.log('[Server] Initializing STEM Learn API Server...');
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] STEM Learn API running at http://localhost:${PORT}`);
    console.log(`[Server] Healthcheck available at http://localhost:${PORT}/api/health`);
  });
}

start();

export default app;
