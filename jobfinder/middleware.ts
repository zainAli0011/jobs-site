import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth';

// Middleware configuration
export const config = {
  matcher: ['/admin/:path*'],
};

// Middleware handler function
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Allow access to login page
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }
  
  // Protect all other admin routes
  return authMiddleware(req);
} 