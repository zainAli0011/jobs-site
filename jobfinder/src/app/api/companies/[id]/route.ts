import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Company from '@/models/Company';
import Job from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

// GET: Fetch a specific company by ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Fetch the company by ID
    const company = await Company.findOne({ id: params.id });
    
    // Check if company exists
    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Return the company
    return NextResponse.json({
      success: true,
      company
    });
  } catch (error) {
    console.error(`Error fetching company ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

// PUT: Update a specific company by ID (admin only)
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
    
    // Find and update the company
    const company = await Company.findOneAndUpdate(
      { id: params.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    // Check if company exists
    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Company not found' },
        { status: 404 }
      );
    }
    
    // If company name is updated, update all jobs with this company
    if (updateData.name) {
      await Job.updateMany(
        { companyId: params.id },
        { company: updateData.name }
      );
    }
    
    // Return the updated company
    return NextResponse.json({
      success: true,
      message: 'Company updated successfully',
      company
    });
  } catch (error) {
    console.error(`Error updating company ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update company' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific company by ID (admin only)
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
    
    // Check if company has jobs
    const jobCount = await Job.countDocuments({ companyId: params.id });
    if (jobCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Cannot delete company with active jobs. Please delete or reassign ${jobCount} job(s) first.`
      }, { status: 400 });
    }
    
    // Find and delete the company
    const company = await Company.findOneAndDelete({ id: params.id });
    
    // Check if company exists
    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Return success message
    return NextResponse.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting company ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete company' },
      { status: 500 }
    );
  }
} 