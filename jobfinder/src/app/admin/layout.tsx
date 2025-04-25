import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - JobFinder',
  description: 'Manage your job listings, categories, and applications.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow-md md:min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-blue-600">JobFinder</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-1">
              <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Management
              </p>
              
              <Link 
                href="/admin" 
                className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                  />
                </svg>
                Dashboard
              </Link>
              
              <Link 
                href="/admin/jobs" 
                className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                Manage Jobs
              </Link>
            </div>
            
            <div className="mt-8">
              <Link 
                href="/" 
                className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 17l-5-5m0 0l5-5m-5 5h12" 
                  />
                </svg>
                Return to Site
              </Link>
            </div>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6 md:p-8 w-full">{children}</main>
        </div>
      </div>
    </div>
  );
} 