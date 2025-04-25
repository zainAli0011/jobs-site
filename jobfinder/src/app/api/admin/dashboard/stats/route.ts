import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import Job from '@/models/Job';
import Company from '@/models/Company';
import Application from '@/models/Application';

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

    // Get stats in parallel
    const [totalJobs, activeJobs, totalCompanies, totalApplications] = await Promise.all([
      Job.countDocuments({}),
      Job.countDocuments({ active: true }),
      Company.countDocuments({}),
      Application.countDocuments({})
    ]);

    // Return stats
    return NextResponse.json({
      totalJobs,
      activeJobs,
      totalCompanies,
      totalApplications
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 