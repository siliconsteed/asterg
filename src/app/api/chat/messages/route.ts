import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import ChatMessage from '@/models/ChatMessage';
import User from '@/models/User';

// Get chat history for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sessionId = searchParams.get('sessionId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find user to verify they exist
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build query
    const query: any = { userId };
    if (sessionId) {
      query.sessionId = sessionId;
    }

    // Get total count for pagination
    const total = await ChatMessage.countDocuments(query);

    // Get messages with pagination
    const messages = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      messages,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Error fetching chat messages' },
      { status: 500 }
    );
  }
}

// Save a new chat message
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, content, isUserMessage, zodiacSign, sessionId, isPaidSession } = body;

    if (!userId || !content || isUserMessage === undefined || !zodiacSign || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new message
    const message = await ChatMessage.create({
      userId,
      content,
      isUserMessage,
      zodiacSign,
      sessionId,
      isPaidSession: isPaidSession || false,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error saving chat message:', error);
    return NextResponse.json(
      { error: 'Error saving chat message' },
      { status: 500 }
    );
  }
}
