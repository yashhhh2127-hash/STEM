import { Router } from 'express';
import { getDbStatus } from '../db';
import { User } from '../models/User';

export const systemRouter = Router();

systemRouter.get('/status', async (_req, res) => {
  const dbStatus = getDbStatus();
  let userCount = 0;
  let adminCount = 0;

  if (dbStatus.connected) {
    try {
      userCount = await User.countDocuments();
      adminCount = await User.countDocuments({ role: { $in: ['admin', 'faculty'] } });
    } catch {
      // ignore
    }
  }

  return res.json({
    success: true,
    server: 'STEM Learn Backend API',
    uptime: process.uptime(),
    database: {
      ...dbStatus,
      userCount,
      adminCount,
    },
    googleOAuthConfigured: Boolean(process.env.GOOGLE_CLIENT_ID),
  });
});
