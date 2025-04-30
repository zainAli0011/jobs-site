import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Subscriber from '@/models/Subscriber';

// GET: Handle unsubscribe via URL (used for email links)
// Example: /api/subscribers/unsubscribe?email=user@example.com
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse query parameters
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email parameter is required' },
        { status: 400 }
      );
    }
    
    // Find subscriber
    const subscriber = await Subscriber.findOne({ email });
    
    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    // Update subscriber status
    subscriber.active = false;
    await subscriber.save();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed'
    });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
} 