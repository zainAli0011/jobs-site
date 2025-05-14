import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';
import { nanoid } from 'nanoid';
import { sendNotificationToAllUsers } from '@/lib/notifications';

// GET: Fetch all jobs with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    const featured = searchParams.get('featured') || '';
    
    // Build query - only show active jobs
    const query: any = { active: true };

    // Add filters to query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      query.type = type;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Count total matching documents for pagination
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Get jobs with pagination
    const jobs = await Job.find(query)
      .sort({ featured: -1, postedDate: -1 }) // Sort by featured first, then by date
      .skip((page - 1) * limit)
      .limit(limit);

    // Increment view count for each job
    for (const job of jobs) {
      await Job.findByIdAndUpdate(job._id, { $inc: { views: 1 } });
    }

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

// POST: Create a new job (admin only)
export async function POST(req: NextRequest) {
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
    
    // Parse request body
    const jobData = await req.json();
    
    // Generate a unique ID for the job
    jobData.id = nanoid();
    
    // Set the current date as posted date if not provided
    if (!jobData.postedDate) {
      const today = new Date();
      jobData.postedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // Create the job
    const job = await Job.create(jobData);
    
    // Send notification to all users
    await sendNotificationToAllUsers(
      'New Job Posted!', 
      `${job.title} at ${job.company} is now available`
    );
    
    // Return the created job
    return NextResponse.json({
      success: true,
      message: 'Job created successfully',
      job
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create job' },
      { status: 500 }
    );
  }
} 