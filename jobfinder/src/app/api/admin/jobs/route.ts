import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import { nanoid } from 'nanoid';
import { sendPushNotifications } from '@/lib/notifications';

// GET - Fetch all jobs (with pagination and filters)
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated as admin
    if (!await isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
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
    
    // Initialize query builder
    let jobsQuery = Job.find(query).sort({ postedDate: -1 }); // Sort by most recent first
    
    // Apply pagination only if both page and limit are provided
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const totalPages = Math.ceil(totalJobs / limitNum);
      
      // Apply pagination
      jobsQuery = jobsQuery
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
      
      // Get jobs with pagination
      const jobs = await jobsQuery;
      
      // Return paginated results
      return NextResponse.json({
        jobs,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalJobs,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      });
    } else {
      // Get all jobs without pagination
      const jobs = await jobsQuery;
      
      // Return all results with pagination info (all items on page 1)
      return NextResponse.json({
        jobs,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalJobs,
          hasNext: false,
          hasPrev: false
        }
      });
    }
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
    if (!await isAdmin(request)) {
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
    console.log('🟢 [ADMIN JOBS] New job created:', {
      id: newJob.id,
      title: newJob.title,
      company: newJob.company
    });
    
    // Send push notification to all registered devices
    console.log('🔔 [ADMIN JOBS] Starting notification process for new job:', newJob.title);
    try {
      console.log('📝 [ADMIN JOBS] Preparing notification data for job:', { 
        id: newJob.id, 
        title: newJob.title 
      });
      
      const notificationTitle = `New Job: ${data.title}`;
      const notificationBody = `${data.company} is hiring for ${data.title} in ${data.location}`;
      
      console.log('📤 [ADMIN JOBS] Sending notification with:', { 
        title: notificationTitle, 
        body: notificationBody 
      });
      
      const notificationStart = Date.now();
      console.log('🔍 [ADMIN JOBS] MongoDB _id:', newJob._id.toString(), 'Custom id:', newJob.id);
      const notificationResult = await sendPushNotifications({
        title: notificationTitle,
        body: notificationBody,
        data: {
          jobId: newJob._id.toString(),  // Using MongoDB _id instead of custom id
          type: 'new_job',
          companyName: data.company,
          jobTitle: data.title,
          screen: 'jobApply',
          location: data.location
        }
      });
      const notificationEnd = Date.now();
      
      console.log(`⏱️ [ADMIN JOBS] Total notification process took ${notificationEnd - notificationStart}ms`);
      console.log('✅ [ADMIN JOBS] Push notification result:', {
        success: notificationResult.success,
        sentCount: notificationResult.sent,
        message: notificationResult.message
      });
    } catch (notificationError) {
      // Log error but don't fail the job creation
      console.error('❌ [ADMIN JOBS] Error sending push notifications:', notificationError);
      if (notificationError instanceof Error) {
        console.error('❌ [ADMIN JOBS] Error details:', {
          name: notificationError.name,
          message: notificationError.message,
          stack: notificationError.stack
        });
      }
    }

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