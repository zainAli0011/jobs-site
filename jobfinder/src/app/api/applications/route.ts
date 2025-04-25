import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

// GET: Get applications with pagination and filters
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
    const status = url.searchParams.get('status') || '';
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      // Search in first name, last name, and email
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalApplications = await Application.countDocuments(filter);
    const totalPages = Math.ceil(totalApplications / limit);
    
    // Fetch job details for each application
    const applicationData = await Promise.all(
      applications.map(async (app) => {
        const job = await Job.findOne({ id: app.jobId });
        
        return {
          id: app._id.toString(),
          jobId: app.jobId,
          jobTitle: job ? job.title : 'Unknown Job',
          company: job ? job.company : 'Unknown Company',
          fullName: `${app.firstName} ${app.lastName}`,
          email: app.email,
          phone: app.phone,
          status: app.status,
          createdAt: app.createdAt
        };
      })
    );
    
    // Return applications with pagination info
    return NextResponse.json({
      success: true,
      applications: applicationData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalApplications,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
} 