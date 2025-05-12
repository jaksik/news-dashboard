import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongodb';
import Post from '@/models/Post';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('searchTerm');
    const dateRange = searchParams.get('dateRange');
    const filterOptions = searchParams.get('filterOptions');
    const usedFilter = searchParams.get('used');
    const limit = searchParams.get('limit');

    console.log('API: Attempting to connect to database...');
    await dbConnect();
    console.log('API: Successfully connected to database');
    
    // If filterOptions is true, return just the filter options
    if (filterOptions === 'true') {
      const searchTerms = await Post.distinct('searchTerm');
      return NextResponse.json({
        searchTerms
      });
    }
    
    // Build query object based on filters
    const query: Record<string, unknown> = {};
    
    if (searchTerm) query.searchTerm = searchTerm;
    if (usedFilter) query.used = usedFilter === 'used';
    
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      switch (dateRange) {
        case 'today':
          query.datetime = {
            $gte: new Date(now.setHours(0, 0, 0, 0)),
            $lte: new Date(now.setHours(23, 59, 59, 999))
          };
          break;
        case 'week':
          query.datetime = {
            $gte: new Date(now.setDate(now.getDate() - 7))
          };
          break;
        case 'month':
          query.datetime = {
            $gte: new Date(now.setMonth(now.getMonth() - 1))
          };
          break;
      }
    }

    console.log('API: Executing query with filters:', JSON.stringify(query, null, 2));
    let postsQuery = Post.find(query).sort({ datetime: -1 });

    // Apply limit if provided
    if (limit) {
      postsQuery = postsQuery.limit(parseInt(limit));
    }

    const posts = await postsQuery;
    console.log('API: Found posts:', posts.length);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { postId, used } = await request.json();
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    console.log(`API: Updating post ${postId} with used=${used}`);
    await dbConnect();
    
    const post = await Post.findByIdAndUpdate(
      postId,
      { used },
      { new: true }
    );

    if (!post) {
      console.log(`API: Post ${postId} not found`);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    console.log(`API: Successfully updated post ${postId}`);
    return NextResponse.json(post);
  } catch (error) {
    console.error('API Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}