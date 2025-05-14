import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/mongodb';
import Tool from '@/models/Tool';

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
    const tools = await Tool.find(query).sort({ createdAt: -1 });
    
    console.log('API: Found tools:', tools.length);
    return NextResponse.json(tools);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('API: Creating new tool:', body);
    await dbConnect();
    
    const tool = await Tool.create(body);
    console.log('API: Successfully created tool');
    
    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    console.error('API Error creating tool:', error);
    return NextResponse.json(
      { error: 'Failed to create tool', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { toolId, ...updates } = await request.json();
    
    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
    }

    console.log(`API: Updating tool ${toolId}`, updates);
    await dbConnect();
    
    const tool = await Tool.findByIdAndUpdate(
      toolId,
      updates,
      { new: true }
    );

    if (!tool) {
      console.log(`API: Tool ${toolId} not found`);
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    console.log(`API: Successfully updated tool ${toolId}`);
    return NextResponse.json(tool);
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
    const toolId = searchParams.get('toolId');
    
    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
    }

    console.log(`API: Deleting tool ${toolId}`);
    await dbConnect();
    
    const tool = await Tool.findByIdAndDelete(toolId);

    if (!tool) {
      console.log(`API: Tool ${toolId} not found`);
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    console.log(`API: Successfully deleted tool ${toolId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error deleting tool:', error);
    return NextResponse.json(
      { error: 'Failed to delete tool', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}