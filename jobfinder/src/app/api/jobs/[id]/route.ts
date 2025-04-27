import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

// GET: Fetch a specific job by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectToDatabase();

    const {id} = await params;
    const jobId = id;
    // Find job by ID
    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Increment view count
    job.views += 1;
    await job.save();

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error getting job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update a specific job by ID (admin only)
export async function PUT(req: NextRequest, { params }: Params) {
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
    const updateData = await req.json();
    
    // Find and update the job
    const job = await Job.findOneAndUpdate(
      { id: params.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    // Check if job exists
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Return the updated job
    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error(`Error updating job ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific job by ID (admin only)
export async function DELETE(req: NextRequest, { params }: Params) {
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
    
    // Find and delete the job
    const job = await Job.findOneAndDelete({ id: params.id });
    
    // Check if job exists
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Return success message
    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting job ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete job' },
      { status: 500 }
    );
  }
} 