'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [debugInfo, setDebugInfo] = useState<{
    errors: string[];
    responses: Array<{type: string; data: any}>;
  }>({
    errors: [],
    responses: []
  });
  const [showDebug, setShowDebug] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        const response = await fetch('/api/admin/auth-check', {
          method: 'GET',
          credentials: 'include', // Important for cookies
          cache: 'no-store', // Don't cache this request
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        // Check if response is OK and is JSON
        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          try {
            const data = await response.json();
            if (data.authenticated) {
              router.push('/admin/dashboard');
              return;
            }
          } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
          }
        }
        setIsCheckingAuth(false);
      } catch (err) {
        console.error('Auth check error:', err);
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Helper to add debug info
  const addDebugError = (error: string) => {
    setDebugInfo(prev => ({
      ...prev,
      errors: [...prev.errors, `${new Date().toISOString()}: ${error}`]
    }));
  };

  const addDebugResponse = (type: string, data: any) => {
    setDebugInfo(prev => ({
      ...prev,
      responses: [...prev.responses, {type, data}]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simple validation
      if (!email || !password) {
        setError('Please enter both email and password');
        addDebugError('Validation failed: Missing email or password');
        setLoading(false);
        return;
      }

      // Log attempt
      console.log('Attempting login with:', email);
      addDebugResponse('login-attempt', { email });

      // Call the login API
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
        cache: 'no-store',
      });

      console.log('Login API response status:', response.status);

      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      try {
        // Try to parse response as JSON first
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // If not JSON, get text
          const text = await response.text();
          console.log('Non-JSON response:', text);
          addDebugResponse('non-json-response', { status: response.status, text });
          
          // Try to parse text as JSON (sometimes Content-Type header is wrong)
          try {
            data = JSON.parse(text);
          } catch (e) {
            // It's really not JSON
            addDebugError(`Response is not JSON: ${text.substring(0, 100)}`);
            throw new Error('Unexpected response format');
          }
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        addDebugError(`Parse error: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        setError('Server returned an invalid response. Please try again.');
        setLoading(false);
        return;
      }
      
      // Log response data for debugging
      console.log('Login API response data:', data);
      addDebugResponse('api-response', { status: response.status, data });
      
      if (!response.ok) {
        // Handle error response
        setError(data?.error || 'Login failed. Please check your credentials and try again.');
        addDebugError(`API error: ${data?.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }
      
      // If login successful
      setLoading(false);
      addDebugResponse('login-success', data);
      
      // Check if we have cookies set
      const cookies = document.cookie;
      console.log('Cookies after login:', cookies);
      addDebugResponse('cookies-after-login', { cookies });
      
      // Force a hard redirect to dashboard to ensure cookies are applied
      window.location.href = '/admin/dashboard';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Login error:', err);
      addDebugError(`Fetch error: ${errorMessage}`);
      setError('An error occurred while connecting to the server. Please try again.');
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the JobFinder admin dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Admin credentials
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-500">
              <div>
                <span className="font-semibold">Email:</span> admin@jobfinder.com
              </div>
              <div>
                <span className="font-semibold">Password:</span> admin123
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Back to JobFinder Home
            </Link>
          </div>
          
          {/* Debug section */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
            
            {showDebug && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information</h3>
                
                {debugInfo.errors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-red-600 mb-1">Errors:</h4>
                    <ul className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                      {debugInfo.errors.map((err, i) => (
                        <li key={i} className="text-red-700 mb-1">{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {debugInfo.responses.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-blue-600 mb-1">API Responses:</h4>
                    <div className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-64">
                      {debugInfo.responses.map((res, i) => (
                        <div key={i} className="mb-2 pb-2 border-b border-gray-200">
                          <div className="font-medium">{res.type}</div>
                          <pre className="whitespace-pre-wrap break-all">
                            {JSON.stringify(res.data, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-2">
                  <h4 className="text-xs font-medium text-blue-600 mb-1">Cookies:</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-16 whitespace-pre-wrap break-all">
                    {document.cookie || "No cookies found"}
                  </pre>
                </div>
                
                <div className="flex justify-center mt-2">
                  <Link 
                    href="/debug/auth" 
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Go to Auth Debug Page
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 