import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import { nanoid } from 'nanoid';
import { sendNotificationToAllUsers } from '@/lib/notifications';

// GET - Fetch all jobs (with pagination and filters)
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated as admin
    if (!await isAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const active = searchParams.get('active');
    const featured = searchParams.get('featured');

    // Build query
    const query: any = {};

    // Add filters to query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { "company.name": { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (active !== null) {
      query.active = active === 'true';
    }

    if (featured !== null) {
      query.featured = featured === 'true';
    }

    // Count total matching documents for pagination
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Get jobs with pagination
    const jobs = await Job.find(query)
      .sort({ postedDate: -1 }) // Sort by most recent first
      .skip((page - 1) * limit)
      .limit(limit);

    // Return paginated results
    return NextResponse.json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new job
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated as admin
    if (!await isAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Get job data from request
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'company', 'location', 'type', 'description'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Set dates and generate unique ID
    const now = new Date();
    
    // Create a new job document with generated ID if not provided
    const newJob = new Job({
      ...data,
      id: data.id || nanoid(10), // Generate a unique ID if not provided
      status: data.status || 'active',
      active: data.active !== undefined ? data.active : true,
      featured: data.featured || false,
      postedDate: now,
      updatedAt: now
    });

    // Save the job to the database
    await newJob.save();
    console.log('New job created:', newJob);
    
    // Send notification to all users
    await sendNotificationToAllUsers(
      'New Job Posted!', 
      `${newJob.title} at ${newJob.company} is now available`
    );

    // Return success response
    return NextResponse.json({
      message: 'Job created successfully',
      job: newJob
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 