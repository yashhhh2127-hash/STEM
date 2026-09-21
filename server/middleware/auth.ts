import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'stem-learn-super-secret-jwt-key-2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'faculty' | 'student';
    name: string;
  };
}

export function generateToken(payload: { id: string; email: string; role: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }

  req.user = decoded;
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  authenticate(req, res, () => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'faculty')) {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
  });
}
