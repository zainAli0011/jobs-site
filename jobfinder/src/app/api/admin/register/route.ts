import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

// This secret key should be set in environment variables in production
const ADMIN_REGISTER_SECRET = process.env.ADMIN_REGISTER_SECRET || 'admin-secret-key';

export async function POST(req: NextRequest) {
  try {
    // Only allow admin registration in development or with the correct secret
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const secretKey = req.headers.get('x-admin-secret');
    
    if (!isDevelopment && secretKey !== ADMIN_REGISTER_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Parse request body
    const { name, email, password } = await req.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create the admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }, { status: 201 });
  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register admin user' },
      { status: 500 }
    );
  }
} 