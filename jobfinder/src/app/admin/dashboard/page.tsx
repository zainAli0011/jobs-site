'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Job } from '@/lib/types';

// Dashboard Statistics Card Component
function StatCard({ title, value, icon, bgColor }: { 
  title: string; 
  value: number | string; 
  icon: string;
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 flex flex-col`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <span className="text-white text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

// Recent Job Component
function RecentJobItem({ job }: { job: Job }) {
  return (
    <div className="border-b border-gray-200 py-4 flex justify-between items-center">
      <div>
        <h4 className="font-medium">{job.title}</h4>
        <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
      </div>
      <div className="flex space-x-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          job.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {job.active ? 'active' : 'inactive'}
        </span>
        <Link 
          href={`/admin/jobs/${job._id?.toString() || job.id}/edit`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalCompanies: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth-check', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          router.push('/admin/login');
          return;
        }
        
        const data = await response.json();
        
        if (!data.authenticated) {
          router.push('/admin/login');
          return;
        }
        
        fetchDashboardData();
      } catch (error) {
        console.error("Auth check error:", error);
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      setLoading(true);
      
      // Fetch dashboard statistics
      const statsResponse = await fetch('/api/admin/dashboard/stats', {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!statsResponse.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${statsResponse.status}`);
      }
      
      const statsData = await statsResponse.json();
      
      // Fetch recent jobs
      const jobsResponse = await fetch('/api/admin/jobs?page=1&limit=5', {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!jobsResponse.ok) {
        throw new Error(`Failed to fetch jobs: ${jobsResponse.status}`);
      }
      
      const jobsData = await jobsResponse.json();
      
      setJobs(jobsData.jobs);
      setStats({
        totalJobs: statsData.totalJobs || 0,
        activeJobs: statsData.activeJobs || 0,
        totalCompanies: statsData.totalCompanies || 0,
        totalApplications: statsData.totalApplications || 0
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important to include cookies
      });

      if (response.ok) {
        // Use window.location for a full page reload to clear any cached state
        window.location.href = '/admin/login';
      } else {
        setError('Failed to logout. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              View Site
            </Link>
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 mb-6">
          <Link 
            href="/admin/dashboard" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm"
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/jobs" 
            className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50"
          >
            Jobs
          </Link>
          <Link 
            href="/admin/companies" 
            className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50"
          >
            Companies
          </Link>
          <Link 
            href="/admin/categories" 
            className="px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50"
          >
            Categories
          </Link>
        </div>

        {/* Dashboard Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Jobs" 
              value={stats.totalJobs} 
              icon="📋" 
              bgColor="bg-blue-600" 
            />
            <StatCard 
              title="Active Jobs" 
              value={stats.activeJobs} 
              icon="✓" 
              bgColor="bg-green-600" 
            />
            <StatCard 
              title="Companies" 
              value={stats.totalCompanies} 
              icon="🏢" 
              bgColor="bg-purple-600" 
            />
            <StatCard 
              title="Applications" 
              value={stats.totalApplications} 
              icon="📝" 
              bgColor="bg-orange-600" 
            />
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Jobs</h2>
            <Link 
              href="/admin/jobs/new" 
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md shadow-sm hover:bg-indigo-700"
            >
              Add New Job
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {jobs.length > 0 ? (
              jobs.map(job => (
                <RecentJobItem key={job._id?.toString() || job.id} job={job} />
              ))
            ) : (
              <p className="py-4 text-gray-500">No jobs found</p>
            )}
          </div>
          
          <div className="mt-4 text-right">
            <Link 
              href="/admin/jobs" 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View all jobs →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link 
              href="/admin/jobs/new" 
              className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <span className="text-xl mr-3">📝</span>
              <div>
                <h3 className="font-medium">Add New Job</h3>
                <p className="text-sm text-gray-500">Create a new job listing</p>
              </div>
            </Link>
            
            <Link 
              href="/admin/companies/new" 
              className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <span className="text-xl mr-3">🏢</span>
              <div>
                <h3 className="font-medium">Add New Company</h3>
                <p className="text-sm text-gray-500">Register a new employer</p>
              </div>
            </Link>
            
            <Link 
              href="/admin/categories/new" 
              className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <span className="text-xl mr-3">🏷️</span>
              <div>
                <h3 className="font-medium">Add New Category</h3>
                <p className="text-sm text-gray-500">Create a new job category</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 