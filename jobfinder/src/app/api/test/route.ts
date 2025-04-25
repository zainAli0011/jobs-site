import { NextResponse } from 'next/server';

/**
 * GET endpoint to test API responses
 * Always returns a JSON response
 */
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      message: 'API is working correctly',
      time: new Date().toISOString()
    },
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
} 