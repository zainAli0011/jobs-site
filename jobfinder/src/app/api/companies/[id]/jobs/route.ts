import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import Company from '@/models/Company';

interface Params {
  params: {
    id: string;
  };
}

// GET: Fetch all jobs for a specific company
export async function GET(req: NextRequest, { params }: Params) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Check if company exists
    const company = await Company.findOne({ id: params.id });
    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Company not found' },
        { status: 404 }
      );
    }
    
    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    
    // Build query
    const query = { companyId: params.id, active: true };
    
    // Fetch jobs with pagination
    const skip = (page - 1) * limit;
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Count total jobs matching the query
    const totalJobs = await Job.countDocuments(query);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalJobs / limit);
    
    // Return jobs with pagination info
    return NextResponse.json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
        logo: company.logo
      },
      jobs,
      pagination: {
        total: totalJobs,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error(`Error fetching jobs for company ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 