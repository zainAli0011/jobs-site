import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { IUser } from '@/models/User';

// JWT configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-for-jwt-token-generation'
);
// Token expiration (default: 7 days)
const JWT_EXPIRES_IN = '7d';

// User information to include in the token
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  [key: string]: unknown; // Add index signature for JWTPayload compatibility
}

// Interface for admin authentication
export interface IAdmin {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate a JWT token
 */
export async function generateToken(payload: TokenPayload): Promise<string> {
  console.log('🔐 [AUTH] Generating JWT token for:', payload.email);
  try {
    const token = await new jose.SignJWT(payload as jose.JWTPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(JWT_SECRET);
    
    console.log('✅ [AUTH] Token generated successfully');
    return token;
  } catch (error) {
    console.error('❌ [AUTH] Error generating token:', error);
    throw error;
  }
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  console.log('🔍 [AUTH] Verifying JWT token');
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    // Cast with type safety in mind
    const tokenPayload = payload as unknown as TokenPayload;
    console.log('✅ [AUTH] Token verified successfully for:', tokenPayload.email);
    return tokenPayload;
  } catch (error) {
    console.error('❌ [AUTH] Error verifying token:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message
      });
    }
    return null;
  }
}

/**
 * Get the current user from the request cookies
 */
export async function getCurrentUser(req?: NextRequest): Promise<TokenPayload | null> {
  console.log('👤 [AUTH] Getting current user from cookies');
  try {
    let token: string | undefined;
    
    // For API routes or middleware
    if (req) {
      token = req.cookies.get('admin_token')?.value;
      console.log('🍪 [AUTH] Token from request cookies:', token ? 'Found' : 'Not found');
    } else {
      // For server components
      const cookieStore = await cookies();
      token = cookieStore.get('admin_token')?.value;
      console.log('🍪 [AUTH] Token from cookie store:', token ? 'Found' : 'Not found');
    }
    
    if (!token) {
      console.log('⚠️ [AUTH] No token found in cookies');
      return null;
    }
    
    const user = await verifyToken(token);
    if (!user) {
      console.log('⚠️ [AUTH] Invalid or expired token');
      return null;
    }
    
    console.log('✅ [AUTH] User found:', user.email, 'Role:', user.role);
    return user;
  } catch (error) {
    console.error('❌ [AUTH] Error getting current user:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return null;
  }
}

/**
 * Check if the user is authenticated and has admin role
 */
export async function isAdmin(req: NextRequest): Promise<boolean> {
  console.log('🔑 [AUTH] Checking if user is admin');
  const user = await getCurrentUser(req);
  const isUserAdmin = user !== null && user.role === 'admin';
  console.log(`${isUserAdmin ? '✅' : '❌'} [AUTH] Is admin:`, isUserAdmin);
  return isUserAdmin;
}

/**
 * Simple admin authentication for the static version
 * This is just for development without a database
 */
export async function authenticateAdmin(email: string, password: string): Promise<string | null> {
  console.log('🔐 [AUTH] Authenticating admin:', email);
  
  // Check static credentials
  if (email === 'admin@jobfinder.com' && password === 'admin123') {
    console.log('✅ [AUTH] Static admin credentials verified');
    
    // Generate token for static admin
    const payload: TokenPayload = {
      id: 'admin-id',
      email: 'admin@jobfinder.com',
      role: 'admin'
    };
    
    try {
      const token = await generateToken(payload);
      console.log('🔑 [AUTH] Admin token generated successfully');
      return token;
    } catch (error) {
      console.error('❌ [AUTH] Error generating admin token:', error);
      return null;
    }
  }
  
  console.log('❌ [AUTH] Invalid admin credentials');
  return null;
}

/**
 * Middleware to protect admin routes
 */
export async function authMiddleware(req: NextRequest) {
  console.log('🛡️ [AUTH] Running auth middleware for:', req.nextUrl.pathname);
  const user = await getCurrentUser(req);
  
  // If no user found or not an admin, redirect to login
  if (!user || user.role !== 'admin') {
    console.log('⚠️ [AUTH] Authentication failed in middleware, redirecting to login');
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }
  
  console.log('✅ [AUTH] User authenticated in middleware');
  // Allow access to the route
  return NextResponse.next();
}