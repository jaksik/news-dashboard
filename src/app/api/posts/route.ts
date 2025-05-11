import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongodb';
import Post from '@/models/Post';

export async function GET() {
  try {
    console.log('API: Attempting to connect to database...');
    await dbConnect();
    console.log('API: Successfully connected to database');
    
    const posts = await Post.find({}).sort({ datetime: -1 });
    console.log('API: Found posts:', posts.length);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('API Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}