import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    await dbConnect();
    return NextResponse.json({ status: 'Connected successfully to MongoDB' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Connection test failed:', err);
    return NextResponse.json(
      { 
        error: 'Connection failed',
        details: err.message,
        name: err.name
      },
      { status: 500 }
    );
  }
}