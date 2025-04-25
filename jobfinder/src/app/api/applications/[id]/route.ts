import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

// GET: Get a specific application by ID
export async function GET(req: NextRequest, { params }: Params) {
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
    
    // Find the application by ID
    const application = await Application.findById(params.id);
    
    // Check if application exists
    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }
    
    // Get job details
    const job = await Job.findOne({ id: application.jobId });
    
    // Format the response
    const applicationData = {
      id: application._id.toString(),
      jobId: application.jobId,
      jobTitle: job ? job.title : 'Unknown Job',
      company: job ? job.company : 'Unknown Company',
      firstName: application.firstName,
      lastName: application.lastName,
      fullName: `${application.firstName} ${application.lastName}`,
      email: application.email,
      phone: application.phone,
      resumeUrl: application.resumeUrl,
      coverLetterUrl: application.coverLetterUrl,
      linkedIn: application.linkedIn,
      portfolio: application.portfolio,
      referral: application.referral,
      workAuthorization: application.workAuthorization,
      relocation: application.relocation,
      salaryExpectation: application.salaryExpectation,
      startDate: application.startDate,
      heardAbout: application.heardAbout,
      additionalInfo: application.additionalInfo,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt
    };
    
    // Return the application data
    return NextResponse.json({
      success: true,
      application: applicationData
    });
  } catch (error) {
    console.error(`Error fetching application ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// PATCH: Update application status
export async function PATCH(req: NextRequest, { params }: Params) {
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
    
    // Validate the status value
    if (updateData.status && !['pending', 'reviewing', 'interviewed', 'hired', 'rejected'].includes(updateData.status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Find and update the application
    const application = await Application.findByIdAndUpdate(
      params.id,
      { status: updateData.status },
      { new: true, runValidators: true }
    );
    
    // Check if application exists
    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }
    
    // Return the updated application
    return NextResponse.json({
      success: true,
      message: 'Application status updated successfully',
      application: {
        id: application._id.toString(),
        status: application.status
      }
    });
  } catch (error) {
    console.error(`Error updating application ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update application status' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an application
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
    
    // Find and delete the application
    const application = await Application.findByIdAndDelete(params.id);
    
    // Check if application exists
    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }
    
    // Return success message
    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting application ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete application' },
      { status: 500 }
    );
  }
} 