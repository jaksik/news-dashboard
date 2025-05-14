import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongodb';
import News from '@/models/News';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const active = searchParams.get('active');

    console.log('API: Attempting to connect to database...');
    await dbConnect();
    console.log('API: Successfully connected to database');
    
    // Build query object based on filters
    const query: Record<string, unknown> = {};
    
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (active) query.active = active === 'true';

    console.log('API: Executing query with filters:', JSON.stringify(query, null, 2));
    const news = await News.find(query).sort({ createdAt: -1 });
    
    console.log('API: Found news:', news.length);
    return NextResponse.json(news);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('API: Creating news article:', body);
    await dbConnect();
    
    const news = await News.create(body);
    console.log('API: Successfully created news article');
    
    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('API Error creating news article:', error);
    return NextResponse.json(
      { error: 'Failed to create news article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { newsId, ...updates } = await request.json();
    
    if (!newsId) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 });
    }

    console.log(`API: Updating news article ${newsId}`, updates);
    await dbConnect();
    
    const news = await News.findByIdAndUpdate(
      newsId,
      updates,
      { new: true }
    );

    if (!news) {
      console.log(`API: News article ${newsId} not found`);
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    console.log(`API: Successfully updated news article ${newsId}`);
    return NextResponse.json(news);
  } catch (error) {
    console.error('API Error updating tool:', error);
    return NextResponse.json(
      { error: 'Failed to update tool', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('newsId');
    
    if (!newsId) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 });
    }

    console.log(`API: Deleting news article ${newsId}`);
    await dbConnect();
    
    const news = await News.findByIdAndDelete(newsId);

    if (!news) {
      console.log(`API: News article ${newsId} not found`);
      return NextResponse.json({ error: 'News article not found' }, { status: 404 });
    }

    console.log(`API: Successfully deleted news article ${newsId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error deleting tool:', error);
    return NextResponse.json(
      { error: 'Failed to delete tool', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}