'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function JobError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Job page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-red-500 mb-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-center">Something Went Wrong</h1>
          <p className="text-gray-600 mb-6 text-center">
            We encountered an error while loading this job listing. Please try again later.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              Try Again
            </button>
            
            <Link 
              href="/jobs" 
              className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg text-center transition duration-200"
            >
              Return to Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 