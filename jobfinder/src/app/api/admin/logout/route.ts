import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response that will clear the admin token cookie
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Clear the admin token cookie
    response.cookies.delete({
      name: 'admin_token',
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during logout',
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