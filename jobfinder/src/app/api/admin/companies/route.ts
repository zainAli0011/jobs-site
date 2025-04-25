import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Company from '@/models/Company';

// GET - Fetch all companies (with pagination and filters)
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const active = searchParams.get('active');

    // Build query
    const query: any = {};

    // Add filters to query
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (active !== null) {
      query.active = active === 'true';
    }

    // Count total matching documents for pagination
    const totalCompanies = await Company.countDocuments(query);
    const totalPages = Math.ceil(totalCompanies / limit);

    // Get companies with pagination
    const companies = await Company.find(query)
      .sort({ name: 1 }) // Sort by name alphabetically
      .skip((page - 1) * limit)
      .limit(limit);

    // Return paginated results
    return NextResponse.json({
      companies,
      pagination: {
        currentPage: page,
        totalPages,
        totalCompanies,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new company
export async function POST(request: NextRequest) {
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

    // Get company data from request
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'industry', 'location'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create a new company document
    const newCompany = new Company({
      ...data,
      jobListings: data.jobListings || 0,
      active: data.active !== undefined ? data.active : true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save the company to the database
    await newCompany.save();
    console.log('New company created:', newCompany);

    // Return success response
    return NextResponse.json({
      message: 'Company created successfully',
      company: newCompany
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 