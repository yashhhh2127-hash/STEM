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

    const dbStatus = getDbStatus();
    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is not connected. Please check your database server or set MONGODB_URI in .env.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Determine initial role: if first user or explicitly chosen, allow admin/faculty
    const userRole = role && ['admin', 'faculty', 'student'].includes(role) ? role : 'faculty';

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      department: department || 'SDES Department of Information Technology',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
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

    const dbStatus = getDbStatus();
    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is not connected. Please check your database server or set MONGODB_URI in .env.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'No registered user found with this email address.' });
    }

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
    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is not connected. Please verify database connection in .env.',
      });
    }

    let user = await User.findOne({
      $or: [{ email: userEmail.toLowerCase().trim() }, { googleId }],
    });

    if (!user) {
      // Register new user from Google profile
      const requestedRole = role && ['admin', 'faculty', 'student'].includes(role) ? role : 'faculty';
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
  } catch (error: any) {
    console.error('[Google Auth Error]:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Server error during Google auth.' });
  }
});

// 4. Get Current User Profile
authRouter.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in database.' });
    }
    return res.json({ success: true, user: sanitizeUser(user) });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || 'Failed to fetch user profile.' });
  }
});

// 5. List All Registered Users (Protected: Admin & Faculty)
authRouter.get('/users', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    return res.json({
      success: true,
      count: users.length,
      users: users.map(sanitizeUser),
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
