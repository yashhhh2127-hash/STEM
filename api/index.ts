// Vercel Serverless Function entry point
// This wraps the Express app for Vercel's serverless runtime.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../server/db';
import { authRouter } from '../server/routes/auth';
import { systemRouter } from '../server/routes/system';

dotenv.config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow the Vercel deployment origin + localhost dev
const allowedOrigins = [
  process.env.FRONTEND_URL || '',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => o && origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(null, true); // open during dev; tighten in production
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/system', systemRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'STEM Learn Backend API',
    timestamp: new Date().toISOString(),
  });
});

// ── Connect MongoDB once (cached across warm invocations) ─────────────────────
let isConnected = false;
const handler = async (req: any, res: any) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};

export default handler;
