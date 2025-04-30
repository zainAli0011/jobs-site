import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';

// Schema for validating input
const subscriberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional()
});

// GET: Get subscribers with pagination and filters (admin only)
export async function GET(req: NextRequest) {
  try {
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
    
    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const active = url.searchParams.get('active');
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const filter: any = {};
    
    if (active !== null && active !== undefined) {
      filter.active = active === 'true';
    }
    
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const subscribers = await Subscriber.find(filter)
      .sort({ subscribeDate: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalSubscribers = await Subscriber.countDocuments(filter);
    const totalPages = Math.ceil(totalSubscribers / limit);
    
    // Format subscriber data
    const subscriberData = subscribers.map(sub => ({
      id: sub._id.toString(),
      email: sub.email,
      phone: sub.phone,
      subscribeDate: sub.subscribeDate,
      active: sub.active
    }));
    
    // Return subscribers with pagination info
    return NextResponse.json({
      success: true,
      subscribers: subscriberData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalSubscribers,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// POST: Create a new subscriber
export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse request body
    const body = await req.json();
    
    // Validate input
    const validation = subscriberSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { email, phone } = validation.data;
    
    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    
    if (existingSubscriber) {
      // If the subscriber already exists but is inactive, reactivate them
      if (!existingSubscriber.active) {
        existingSubscriber.active = true;
        existingSubscriber.phone = phone || existingSubscriber.phone;
        await existingSubscriber.save();
        
        return NextResponse.json({
          success: true,
          message: "Subscription successfully reactivated",
          subscriber: {
            id: existingSubscriber._id,
            email: existingSubscriber.email,
            phone: existingSubscriber.phone,
            subscribeDate: existingSubscriber.subscribeDate
          }
        });
      }
      
      // If already active, return conflict response
      return NextResponse.json(
        { success: false, message: "Email is already subscribed" },
        { status: 409 }
      );
    }
    
    // Create new subscriber
    const newSubscriber = await Subscriber.create({
      email,
      phone,
      subscribeDate: new Date(),
      active: true
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: "Subscription successful",
      subscriber: {
        id: newSubscriber._id,
        email: newSubscriber.email,
        phone: newSubscriber.phone,
        subscribeDate: newSubscriber.subscribeDate
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating subscriber:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 