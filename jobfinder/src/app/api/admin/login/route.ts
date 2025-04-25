import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authenticateAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  console.log('🔍 [LOGIN API] Login request received');
  
  try {
    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log('📦 [LOGIN API] Request body parsed successfully:', body);
    } catch (parseError) {
      console.error('❌ [LOGIN API] Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body format' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          } 
        }
      );
    }

    const { email, password } = body;
    console.log(`👤 [LOGIN API] Login attempt for email: ${email}`);
    
    // Validate credentials
    if (!email || !password) {
      console.warn('⚠️ [LOGIN API] Missing credentials - email or password not provided');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          } 
        }
      );
    }
    
    // Authenticate admin with jose token
    console.log('🔑 [LOGIN API] Attempting to authenticate admin');
    const token = await authenticateAdmin(email, password);
    
    if (!token) {
      console.warn(`❌ [LOGIN API] Authentication failed for email: ${email}`);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          } 
        }
      );
    }
    
    console.log('✅ [LOGIN API] Authentication successful, generating token');
    
    // Set the JWT token in a cookie
    const cookieStore = cookies();
    
    // Create a secure cookie
    cookieStore.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });
    
    console.log('🍪 [LOGIN API] admin_token cookie set successfully');
    
    // Return the success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Logged in successfully',
        redirectTo: '/admin/dashboard' 
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('💥 [LOGIN API] Unexpected error during login:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    return NextResponse.json(
      { 
        error: 'An error occurred during login',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        } 
      }
    );
  }
} 