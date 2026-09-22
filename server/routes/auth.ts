import { Router, Response } from 'express';
import { User } from '../models/User';
import { generateToken, authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { getDbStatus } from '../db';

export const authRouter = Router();

// Helper to sanitize user object for response
function sanitizeUser(user: any) {
  return {
    id: user._id?.toString() || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    provider: user.googleId ? 'google' : 'local',
    avatar: user.avatar,
    department: user.department,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
}

// In-Memory & Local Resilient Fallback User Store
interface FallbackUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'faculty' | 'student';
  provider: 'local' | 'google';
  avatar?: string;
  department?: string;
  googleId?: string;
  createdAt: string;
  lastLogin: string;
}

const FALLBACK_USERS: FallbackUser[] = [
  {
    id: 'usr-student-demo',
    name: 'STEM Scholar',
    email: 'student@stemlearn.edu',
    password: 'student123',
    role: 'student',
    provider: 'local',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=STEMScholar',
    department: 'SDES Junior STEM Academy',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr-admin-demo',
    name: 'Dr. Palghar Faculty',
    email: 'admin@stemlearn.edu',
    password: 'admin123',
    role: 'admin',
    provider: 'local',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PalgharFaculty',
    department: 'Department of Information Technology, SDES Palghar',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr-faculty-demo',
    name: 'Prof. SDES Faculty',
    email: 'faculty@stemlearn.edu',
    password: 'faculty123',
    role: 'faculty',
    provider: 'local',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SDESFaculty',
    department: 'Department of Information Technology, SDES Palghar',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr-yash-demo',
    name: 'Yash Kini',
    email: 'yash@stemlearn.edu',
    password: 'password123',
    role: 'student',
    provider: 'local',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=YashKini',
    department: 'SDES Junior STEM Academy',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
];

export function getFallbackUsers() {
  return FALLBACK_USERS;
}

// 1. Register new Admin / Faculty / Student
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userRole = role && ['admin', 'faculty', 'student'].includes(role) ? role : 'student';
    const dept = department || 'SDES Department of Information Technology';
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`;

    const dbStatus = getDbStatus();
    
    // If MongoDB is available, save to Mongo
    if (dbStatus.connected) {
      try {
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
          return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        const newUser = new User({
          name: name.trim(),
          email: cleanEmail,
          password,
          role: userRole,
          department: dept,
          avatar,
          lastLogin: new Date(),
        });

        await newUser.save();

        const token = generateToken({
          id: newUser._id.toString(),
          email: newUser.email,
          role: newUser.role,
          name: newUser.name,
        });

        return res.status(201).json({
          success: true,
          message: 'Registration successful!',
          token,
          user: sanitizeUser(newUser),
        });
      } catch (mongoErr: any) {
        console.warn('[MongoDB save failed, falling back to resilient local store]:', mongoErr.message);
      }
    }

    // Fallback registration (when MongoDB is offline or unavailable)
    const existingFallback = FALLBACK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingFallback) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const newFallbackUser: FallbackUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role: userRole as any,
      provider: 'local',
      department: dept,
      avatar,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    FALLBACK_USERS.push(newFallbackUser);

    const token = generateToken({
      id: newFallbackUser.id,
      email: newFallbackUser.email,
      role: newFallbackUser.role,
      name: newFallbackUser.name,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful! (Offline Resilient Mode)',
      token,
      user: sanitizeUser(newFallbackUser),
    });
  } catch (error: any) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Server error during registration.' });
  }
});

// 2. Login with Email + Password
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const dbStatus = getDbStatus();

    // If MongoDB is connected, check Mongo first
    if (dbStatus.connected) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user) {
          if (!user.password) {
            return res.status(400).json({
              success: false,
              message: 'This account was created via Google Sign-In. Please click "Sign in with Google".',
            });
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password. Please check and try again.' });
          }

          user.lastLogin = new Date();
          await user.save();

          const token = generateToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
          });

          return res.json({
            success: true,
            message: 'Logged in successfully!',
            token,
            user: sanitizeUser(user),
          });
        }
      } catch (mongoErr: any) {
        console.warn('[MongoDB login query failed, falling back]:', mongoErr.message);
      }
    }

    // Fallback store check (works even when MongoDB Atlas IP is blocked or server is offline)
    const fallbackUser = FALLBACK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!fallbackUser) {
      return res.status(401).json({
        success: false,
        message: 'No registered user found with this email. You can use student@stemlearn.edu / student123 or click Quick Demo.',
      });
    }

    if (fallbackUser.password && fallbackUser.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check and try again.' });
    }

    fallbackUser.lastLogin = new Date().toISOString();

    const token = generateToken({
      id: fallbackUser.id,
      email: fallbackUser.email,
      role: fallbackUser.role,
      name: fallbackUser.name,
    });

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: sanitizeUser(fallbackUser),
    });
  } catch (error: any) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Server error during login.' });
  }
});

// 3. Google Sign-In & Registration
authRouter.post('/google', async (req, res) => {
  try {
    const { credential, email, name, picture, sub, role } = req.body;

    let userEmail = email;
    let userName = name;
    let userAvatar = picture;
    let googleId = sub;

    // If client passes a Google ID JWT token from Google Identity Services
    if (credential && typeof credential === 'string') {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          userEmail = payload.email;
          userName = payload.name;
          userAvatar = payload.picture;
          googleId = payload.sub;
        }
      } catch (err) {
        console.warn('[Google JWT parse error]:', err);
      }
    }

    if (!userEmail) {
      return res.status(400).json({ success: false, message: 'Google authentication did not provide a valid email.' });
    }

    const dbStatus = getDbStatus();
    let user: any = null;

    if (dbStatus.connected) {
      try {
        user = await User.findOne({
          $or: [{ email: userEmail.toLowerCase().trim() }, { googleId }],
        });

        if (!user) {
          // Register new user from Google profile
          const requestedRole = role && ['admin', 'faculty', 'student'].includes(role) ? role : 'student';
          user = new User({
            name: userName || userEmail.split('@')[0],
            email: userEmail.toLowerCase().trim(),
            googleId,
            avatar: userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`,
            role: requestedRole,
            department: 'SDES Department of Information Technology',
            lastLogin: new Date(),
          });
          await user.save();
        } else {
          // Update existing user with Google info & lastLogin
          if (!user.googleId && googleId) user.googleId = googleId;
          if (userAvatar && !user.avatar) user.avatar = userAvatar;
          user.lastLogin = new Date();
          await user.save();
        }

        const token = generateToken({
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
        });

        return res.json({
          success: true,
          message: 'Google authentication successful!',
          token,
          user: sanitizeUser(user),
        });
      } catch (mongoErr: any) {
        console.warn('[MongoDB Google auth failed, falling back to local store]:', mongoErr.message);
      }
    }

    // Fallback store Google authentication
    let fallback = FALLBACK_USERS.find(
      (u) => u.email.toLowerCase() === userEmail.toLowerCase().trim() || (googleId && u.googleId === googleId)
    );

    if (!fallback) {
      fallback = {
        id: `usr-google-${Date.now()}`,
        name: userName || userEmail.split('@')[0],
        email: userEmail.toLowerCase().trim(),
        role: (role && ['admin', 'faculty', 'student'].includes(role) ? role : 'student') as any,
        provider: 'google',
        avatar: userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`,
        department: 'SDES Department of Information Technology',
        googleId,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      FALLBACK_USERS.push(fallback);
    } else {
      if (userAvatar) fallback.avatar = userAvatar;
      if (googleId) fallback.googleId = googleId;
      fallback.lastLogin = new Date().toISOString();
    }

    const token = generateToken({
      id: fallback.id,
      email: fallback.email,
      role: fallback.role,
      name: fallback.name,
    });

    return res.json({
      success: true,
      message: 'Google authentication successful! (Offline Resilient Mode)',
      token,
      user: sanitizeUser(fallback),
    });
  } catch (error: any) {
    console.error('[Google Auth Error]:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Server error during Google auth.' });
  }
});

// 4. Get Current User Profile
authRouter.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const dbStatus = getDbStatus();
    if (dbStatus.connected) {
      try {
        const user = await User.findById(req.user?.id);
        if (user) {
          return res.json({ success: true, user: sanitizeUser(user) });
        }
      } catch {
        // fall through to fallback
      }
    }

    const fallback = FALLBACK_USERS.find((u) => u.id === req.user?.id || u.email === req.user?.email);
    if (fallback) {
      return res.json({ success: true, user: sanitizeUser(fallback) });
    }

    return res.status(404).json({ success: false, message: 'User not found.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || 'Failed to fetch user profile.' });
  }
});

// 5. List All Registered Users (Protected: Admin & Faculty)
authRouter.get('/users', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const dbStatus = getDbStatus();
    if (dbStatus.connected) {
      try {
        const users = await User.find().sort({ createdAt: -1 }).select('-password');
        if (users && users.length > 0) {
          return res.json({
            success: true,
            count: users.length,
            users: users.map(sanitizeUser),
          });
        }
      } catch {
        // fall through to fallback
      }
    }

    return res.json({
      success: true,
      count: FALLBACK_USERS.length,
      users: FALLBACK_USERS.map(sanitizeUser),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || 'Failed to fetch registered users.' });
  }
});

// 6. Update User Role
authRouter.patch('/users/:id/role', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!['admin', 'faculty', 'student'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      message: `User role updated to ${role}.`,
      user: sanitizeUser(updatedUser),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || 'Failed to update user role.' });
  }
});

// 7. Delete Registered User
authRouter.delete('/users/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, message: 'User deleted from MongoDB successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || 'Failed to delete user.' });
  }
});
