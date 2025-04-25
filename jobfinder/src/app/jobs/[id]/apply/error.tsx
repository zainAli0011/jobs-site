'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorComponentProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ApplicationError({ error, reset }: ErrorComponentProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application form error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Application Error</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-medium">
              {error.message || "Something went wrong while processing your application"}
            </p>
          </div>
          
          <p className="text-gray-600 mb-6">
            We're sorry, but we encountered an error while processing your job application. 
            This could be due to a temporary issue with our system or a problem with the form data.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition duration-200 mx-auto block"
            >
              Try Again
            </button>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <Link href="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">
                Browse All Jobs
              </Link>
              <span className="hidden sm:inline text-gray-400">|</span>
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-gray-500 text-sm">
          <p>If the problem persists, please contact our support team at <a href="mailto:support@jobfinder.com" className="text-blue-600 hover:underline">support@jobfinder.com</a></p>
        </div>
      </div>
    </div>
  );
} 