import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongodb';
import Rating from '@/models/Rating';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { postId, rating } = body;

    const newRating = await Rating.findOneAndUpdate(
      { postId, userId: session.user.email },
      { rating },
      { upsert: true, new: true }
    );

    return NextResponse.json(newRating);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save rating', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const session = await getServerSession();
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    await dbConnect();
    
    // Get user's rating if logged in
    const userRating = session?.user?.email 
      ? await Rating.findOne({ postId, userId: session.user.email })
      : null;

    // Get average rating for post
    const ratings = await Rating.find({ postId });
    const average = ratings.length > 0
      ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
      : 0;

    return NextResponse.json({ 
      userRating: userRating?.rating || 0,
      average: Math.round(average * 10) / 10,
      count: ratings.length 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rating', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}