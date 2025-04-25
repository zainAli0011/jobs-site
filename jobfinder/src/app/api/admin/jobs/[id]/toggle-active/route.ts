import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated as admin
    if (!await isAdmin()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    const jobId = params.id;
    
    // Find job by ID
    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Get current status from request body
    const { currentStatus } = await request.json();
    const newStatus = !currentStatus;

    // Update job status
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { 
        active: newStatus,
        updatedAt: new Date()
      },
      { new: true }
    );

    // Return success response
    return NextResponse.json({
      message: 'Job active status updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error updating job active status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 