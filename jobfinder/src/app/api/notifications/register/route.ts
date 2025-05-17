import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import PushToken from '@/models/PushToken';

// POST: Register a new push notification token
export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse request body
    const data = await req.json();
    const { token, userId, device } = data;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }
    
    // Check if token already exists
    const existingToken = await PushToken.findOne({ token });
    
    if (existingToken) {
      // Update existing token
      existingToken.lastUsed = new Date();
      
      if (userId) {
        existingToken.userId = userId;
      }
      
      if (device) {
        existingToken.device = device;
      }
      
      existingToken.active = true;
      await existingToken.save();
      
      return NextResponse.json({
        success: true,
        message: 'Push token updated',
        token: existingToken
      });
    }
    
    // Create new token
    const newToken = await PushToken.create({
      token,
      userId,
      device,
      createdAt: new Date(),
      lastUsed: new Date(),
      active: true
    });
    
    return NextResponse.json({
      success: true,
      message: 'Push token registered successfully',
      token: newToken
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering push token:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register push token' },
      { status: 500 }
    );
  }
} 