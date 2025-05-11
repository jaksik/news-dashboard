import { NextResponse } from 'next/server';
import dbConnect from '@/utils/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    await dbConnect();
    return NextResponse.json({ status: 'Connected successfully to MongoDB' });
  } catch (error: any) {
    console.error('Connection test failed:', error);
    return NextResponse.json(
      { 
        error: 'Connection failed',
        details: error.message,
        code: error.code,
        codeName: error.codeName
      },
      { status: 500 }
    );
  }
}