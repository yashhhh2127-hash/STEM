import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  role: 'admin' | 'faculty' | 'student';
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
      default: 'faculty',
    },
    department: {
      type: String,
      default: 'Information Technology, SDES Palghar',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving
// eslint-disable-next-line func-names
UserSchema.pre('save', async function (next: any) {
  if (!this.isModified('password') || !(this as any).password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    (this as any).password = await bcrypt.hash((this as any).password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
