import { NextRequest, NextResponse } from 'next/server';
import { isAdmin, getCurrentUser } from '@/lib/auth';

/**
 * GET endpoint to check authentication status
 * Returns 200 if authenticated, 401 if not
 */
export async function GET(request: NextRequest) {
  console.log('🔍 [AUTH-CHECK API] Auth check request received');
  
  try {
    // Check if user is authenticated as admin
    if (!await isAdmin()) {
      console.log('❌ [AUTH-CHECK API] User is not authenticated as admin');
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'User is not authenticated as admin'
        },
        { status: 401 }
      );
    }
    
    // Get user data
    const user = await getCurrentUser();
    
    console.log('👤 [AUTH-CHECK API] User data retrieved:', user);
    
    // Return success with user data
    console.log('✅ [AUTH-CHECK API] User is authenticated as admin');
    return NextResponse.json({
      authenticated: true,
      message: 'User is authenticated as admin',
      user
    });
  } catch (error) {
    console.error('💥 [AUTH-CHECK API] Error during auth check:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'Internal server error while checking authentication'
      },
      { status: 500 }
    );
  }
} 