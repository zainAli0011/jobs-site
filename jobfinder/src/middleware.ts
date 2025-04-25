import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// List of paths that should be public (no auth required)
const PUBLIC_PATHS = [
  '/admin/login',
  '/api/admin/login',
  '/api/admin/auth-check',
  '/api/admin/logout'
];

// Check if the current path matches any in the PUBLIC_PATHS array
function isPublicPath(path: string): boolean {
  console.log(`🔍 Checking if path is public: ${path}`,PUBLIC_PATHS.includes(path));
  return PUBLIC_PATHS.includes(path);
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log(`⚙️ Middleware processing path: ${path}`);

  // Skip middleware for public paths
  if (isPublicPath(path)) {
    console.log(`✅ Public path detected: ${path} - bypassing auth check`);
    return NextResponse.next();
  }
  
  // Only apply auth check to admin routes
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    console.log(`🛡️ Protected path detected: ${path} - checking auth`);
    
    // Check for the admin token in cookies
    const adminToken = request.cookies.get('admin_token')?.value;
    
    if (!adminToken) {
      console.log(`❌ No token found for: ${path}`);
      
      // For API routes, return JSON with 401 status
      if (path.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // For UI routes, redirect to login page
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Verify the token
      const user = await verifyToken(adminToken);
      
      if (!user || user.role !== 'admin') {
        console.log(`❌ Invalid token or insufficient permissions for: ${path}`);
        
        // For API routes, return JSON with 401 status
        if (path.startsWith('/api/admin')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        // For UI routes, redirect to login page
        const loginUrl = new URL('/admin/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('admin_token');
        return response;
      }
      
      console.log(`✅ Authentication successful for: ${path}`);
      return NextResponse.next();
    } catch (error) {
      console.error(`❌ Authentication error for: ${path}`, error);
      
      // For API routes, return JSON with 401 status
      if (path.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // For UI routes, redirect to login page
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin_token');
      return response;
    }
  }
  
  // For all other routes, proceed normally
  console.log(`✅ Non-admin path: ${path} - no auth required`);
  return NextResponse.next();
}

// Configure which paths this middleware applies to
export const config = {
  matcher: [
    // Match all admin pages and API routes
    '/admin/:path*',
    // '/api/admin/:path*'
  ]
}; 