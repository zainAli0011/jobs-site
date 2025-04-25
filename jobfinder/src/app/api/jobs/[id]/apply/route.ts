import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import Application from '@/models/Application';
import mongoose from 'mongoose';

interface Params {
  params: {
    id: string;
  };
}

// POST: Submit a job application
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectToDatabase();
    
    const jobId = params.id;
    
    // Find the job by ID
    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // If job is not active, don't allow applications
    if (!job.active) {
      return NextResponse.json(
        { error: 'This job is no longer accepting applications' },
        { status: 400 }
      );
    }

    // Get application data from request
    const applicationData = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'experience'];
    for (const field of requiredFields) {
      if (!applicationData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create a new application document
    const newApplication = new Application({
      ...applicationData,
      jobId: new mongoose.Types.ObjectId(jobId),
      applicationDate: new Date()
    });

    // Save the application to the database
    await newApplication.save();
    
    // Increment the applicants count in the job
    await Job.findByIdAndUpdate(
      jobId,
      { 
        $inc: { applicants: 1 },
        updatedAt: new Date()
      }
    );

    // Return success response
    return NextResponse.json({
      message: 'Application submitted successfully',
      applicationId: newApplication._id,
      jobId
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 