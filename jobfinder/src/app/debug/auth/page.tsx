'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DebugAuthPage() {
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [cookies, setCookies] = useState<string>('Checking...');

  useEffect(() => {
    // Get cookies from document.cookie
    setCookies(document.cookie || 'No cookies found');

    // Check auth status
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/auth-check', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      const text = await response.text();
      
      try {
        const data = JSON.parse(text);
        setApiResponse(JSON.stringify(data, null, 2));
        setAuthStatus(data.authenticated ? 'Authenticated' : 'Not authenticated');
      } catch (e) {
        setApiResponse(text);
        setAuthStatus('Error parsing response');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthStatus('Error checking status');
      setApiResponse(String(error));
    } finally {
      setLoading(false);
    }
  };

  const testApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      const text = await response.text();
      
      try {
        const data = JSON.parse(text);
        setApiResponse(JSON.stringify(data, null, 2));
      } catch (e) {
        setApiResponse(text);
      }
    } catch (error) {
      console.error('Test API error:', error);
      setApiResponse(String(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const text = await response.text();
      
      try {
        const data = JSON.parse(text);
        setApiResponse(JSON.stringify(data, null, 2));
        // Update cookies after logout
        setCookies(document.cookie || 'No cookies found');
        // Re-check auth status
        checkAuthStatus();
      } catch (e) {
        setApiResponse(text);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setApiResponse(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Auth Debug Page</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <p className="mb-2">
            <span className="font-medium">Status:</span>{' '}
            <span className={`px-2 py-1 rounded-full text-sm ${
              authStatus === 'Authenticated' 
                ? 'bg-green-100 text-green-800' 
                : authStatus === 'Not authenticated'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {authStatus}
            </span>
          </p>
          
          <p className="mb-4">
            <span className="font-medium">Cookies:</span>{' '}
            <span className="text-sm font-mono bg-gray-100 p-1 rounded">{cookies}</span>
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={checkAuthStatus}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Auth Status'}
            </button>
            
            <button
              onClick={testApi}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test API'}
            </button>
            
            <button
              onClick={logout}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Response</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-80 text-sm">
            {apiResponse || 'No response yet'}
          </pre>
        </div>
        
        <div className="flex space-x-4">
          <Link href="/admin/login" className="text-blue-600 hover:underline">
            Go to Login Page
          </Link>
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline">
            Go to Dashboard
          </Link>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 