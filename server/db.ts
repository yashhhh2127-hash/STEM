import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stem_learn';

let isConnected = false;
let connectionError: string | null = null;

export async function connectDB(): Promise<boolean> {
  if (isConnected) return true;

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    connectionError = null;
    console.log(`[MongoDB] Successfully connected to database: ${mongoose.connection.name} (${mongoose.connection.host})`);

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('[MongoDB] Connection lost');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('[MongoDB] Connection restored');
    });

    return true;
  } catch (error: any) {
    isConnected = false;
    connectionError = error?.message || 'Failed to connect to MongoDB';
    console.warn(`[MongoDB] Connection notice: ${connectionError}`);
    console.warn('[MongoDB] To connect to MongoDB Atlas, set MONGODB_URI in .env');
    return false;
  }
}

export function getDbStatus() {
  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    host: isConnected ? mongoose.connection.host : null,
    dbName: isConnected ? mongoose.connection.name : null,
    error: connectionError,
    uri: MONGODB_URI.replace(/:([^:@]+)@/, ':****@'), // masked for security
  };
}
