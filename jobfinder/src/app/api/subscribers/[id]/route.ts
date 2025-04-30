import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { getCurrentUser } from '@/lib/auth';
import mongoose from 'mongoose';

// GET: Get a specific subscriber (admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if user is authenticated and is an admin
    const user = getCurrentUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid subscriber ID' },
        { status: 400 }
      );
    }
    
    // Find subscriber
    const subscriber = await Subscriber.findById(id);
    
    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    // Return subscriber data
    return NextResponse.json({
      success: true,
      subscriber: {
        id: subscriber._id.toString(),
        email: subscriber.email,
        phone: subscriber.phone,
        subscribeDate: subscriber.subscribeDate,
        active: subscriber.active
      }
    });
  } catch (error) {
    console.error('Error fetching subscriber:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch subscriber' },
      { status: 500 }
    );
  }
}

// PATCH: Update subscriber (admin can update all fields, non-admin can only unsubscribe)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Connect to the database
    await connectToDatabase();
    
    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid subscriber ID' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Get current user
    const user = getCurrentUser(req);
    
    // Find subscriber
    const subscriber = await Subscriber.findById(id);
    
    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    // If user is not admin, they can only unsubscribe
    if (!user || user.role !== 'admin') {
      // Only allow unsubscribe operation without admin
      if (body.active === false) {
        subscriber.active = false;
        await subscriber.save();
        
        return NextResponse.json({
          success: true,
          message: 'Successfully unsubscribed'
        });
      }
      
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Admin can update all fields
    if (body.email) subscriber.email = body.email;
    if (body.phone !== undefined) subscriber.phone = body.phone;
    if (body.active !== undefined) subscriber.active = body.active;
    
    await subscriber.save();
    
    // Return updated subscriber
    return NextResponse.json({
      success: true,
      message: 'Subscriber updated successfully',
      subscriber: {
        id: subscriber._id.toString(),
        email: subscriber.email,
        phone: subscriber.phone,
        subscribeDate: subscriber.subscribeDate,
        active: subscriber.active
      }
    });
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}

// DELETE: Remove subscriber (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if user is authenticated and is an admin
    const user = getCurrentUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid subscriber ID' },
        { status: 400 }
      );
    }
    
    // Find and delete subscriber
    const result = await Subscriber.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
} 