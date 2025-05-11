import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Testing direct MongoDB connection...');
    console.log('Using URI:', process.env.MONGODB_URI?.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      'mongodb+srv://[username]:[password]@'
    ));
    
    const connection = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Successfully connected to MongoDB');
    
    if (connection.connection.db) {
      const collections = await connection.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
    }
    
    await mongoose.disconnect();
    console.log('Successfully disconnected');
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    console.error('Connection test failed with details:', {
      message: err.message,
      code: err.code,
      name: err.name,
      stack: err.stack
    });
  } finally {
    process.exit();
  }
}

testConnection();