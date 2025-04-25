import Link from 'next/link';

export default function JobNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the job listing you're looking for. It may have been removed, expired, or the URL might be incorrect.
          </p>
          
          <div className="space-y-3">
            <Link href="/jobs" className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200">
              Browse All Jobs
            </Link>
            
            <Link href="/" className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 