import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Company from '@/models/Company';
import { getCurrentUser } from '@/lib/auth';
import { nanoid } from 'nanoid';

// GET: Fetch all companies with optional filtering
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse query parameters
    const url = new URL(req.url);
    const name = url.searchParams.get('name');
    const industry = url.searchParams.get('industry');
    const location = url.searchParams.get('location');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const featured = url.searchParams.get('featured');
    
    // Build query
    const query: any = {};
    
    if (name) query.name = { $regex: name, $options: 'i' };
    if (industry) query.industry = { $regex: industry, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (featured === 'true') query.featured = true;
    
    // Only show active companies by default
    if (!url.searchParams.has('showInactive')) {
      query.active = true;
    }
    
    // Fetch companies with pagination
    const skip = (page - 1) * limit;
    const companies = await Company.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    // Count total companies matching the query
    const totalCompanies = await Company.countDocuments(query);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCompanies / limit);
    
    // Return companies with pagination info
    return NextResponse.json({
      success: true,
      companies,
      pagination: {
        total: totalCompanies,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST: Create a new company (admin only)
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
    const companyData = await req.json();
    
    // Generate a unique ID for the company
    companyData.id = nanoid();
    
    // Create the company
    const company = await Company.create(companyData);
    
    // Return the created company
    return NextResponse.json({
      success: true,
      message: 'Company created successfully',
      company
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create company' },
      { status: 500 }
    );
  }
} 