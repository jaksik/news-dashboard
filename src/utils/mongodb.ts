import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    try {
      console.log('Attempting to connect to MongoDB...');
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('Successfully connected to MongoDB');
        return mongoose;
      });
    } catch (error: any) {
      console.error('MongoDB connection error details:', {
        message: error.message,
        code: error.code,
        codeName: error.codeName,
        name: error.name
      });
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    console.error('Error establishing MongoDB connection:', {
      message: e.message,
      code: e.code,
      codeName: e.codeName,
      name: e.name
    });
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}