'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { connectToDatabase } from "@/lib/db";
import Job from "@/models/Job";

interface Job {
  _id: string;
  id?: string;
  title: string;
  company: {
    name: string;
    logo: string;
  } | string;
  location: string;
  type: string;
  postedDate: string | Date;
  active: boolean;
  featured: boolean;
  applicants: number;
  views: number;
  createdAt: string;
  status: string;
}

function AdminJobsContent() {
  console.log("Rendering AdminJobsPage component"); // Debug log
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load initial filter values from URL
  useEffect(() => {
    console.log("AdminJobsPage: URL params effect running"); // Debug log
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    
    if (featured) {
      setFilterFeatured(featured === 'true');
    }
    
    if (active) {
      setFilterActive(active === 'true');
    }
    
    setSearchTerm(search);
    setCurrentPage(page);
  }, [searchParams]);
  
  // Check authentication and fetch jobs
  useEffect(() => {
    console.log("AdminJobsPage: Auth check effect running"); // Debug log
    const checkAuth = async () => {
      try {
        console.log("Checking authentication for admin jobs page");
        const response = await fetch('/api/admin/auth-check', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log("Auth check response status:", response.status);
        
        if (!response.ok) {
          console.error("Auth check failed, redirecting to login");
          router.push('/admin/login');
          return;
        }
        
        const data = await response.json();
        console.log("Auth check response data:", data);
        
        if (!data.authenticated) {
          console.error("Not authenticated, redirecting to login");
          router.push('/admin/login');
          return;
        }
        
        console.log("Authentication successful, fetching jobs");
        fetchJobs();
      } catch (error) {
        console.error("Auth check error:", error);
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router, currentPage, searchTerm, filterActive, filterFeatured]);
  
  // Fetch jobs using API
  const fetchJobs = async () => {
    try {
      console.log("Fetching jobs from API");
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (filterActive !== null) {
        params.append('active', filterActive.toString());
      }
      
      if (filterFeatured !== null) {
        params.append('featured', filterFeatured.toString());
      }
      
      // Fetch jobs from API
      console.log(`Making API request to: /api/admin/jobs?${params.toString()}`);
      console.log('Filter values:', { searchTerm, filterActive, filterFeatured });
      
      const response = await fetch(`/api/admin/jobs?${params.toString()}`, {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      setJobs(data.jobs);
      setTotalPages(data.pagination.totalPages);
      setTotalJobs(data.pagination.total || data.jobs.length);
      setLoading(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      setLoading(false);
      setIsLoading(false);
    }
  };
  
  // Handle job deletion
  const handleDeleteClick = async (id: string) => {
    setDeleteJobId(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (!deleteJobId) return;
    
    try {
      setIsDeleting(true);
      
      console.log(`Deleting job: ${deleteJobId}`);
      const response = await fetch(`/api/admin/jobs/${deleteJobId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete job: ${response.status} ${response.statusText}`);
      }
      
      // Remove from local state
      setJobs(jobs.filter(job => job._id !== deleteJobId));
      setDeleteJobId(null);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting job:", err);
      setError(err instanceof Error ? err.message : 'Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle search
  const handleFilterSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Update searchTerm and filter values based on form inputs
    setSearchTerm(searchQuery);
    
    // Update active status filter based on statusFilter dropdown
    if (statusFilter === 'active') {
      setFilterActive(true);
    } else if (statusFilter === 'pending' || statusFilter === 'closed') {
      setFilterActive(false);
    } else {
      setFilterActive(null);
    }
    
    // Update featured filter based on featuredFilter dropdown
    if (featuredFilter === 'featured') {
      setFilterFeatured(true);
    } else if (featuredFilter === 'not-featured') {
      setFilterFeatured(false);
    } else {
      setFilterFeatured(null);
    }
    
    setCurrentPage(1);
    fetchJobs();
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Toggle featured status
  const toggleFeaturedStatus = async (job: Job) => {
    try {
      console.log(`Toggling featured status for: ${job._id} from ${job.featured} to ${!job.featured}`);
      
      // First update local state for immediate feedback
      setJobs(jobs.map(j => (j._id === job._id ? { ...j, featured: !j.featured } : j)));
      
      // Then send API request to the toggle-featured endpoint
      const response = await fetch(`/api/admin/jobs/${job._id}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentStatus: job.featured
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update featured status: ${response.status} ${response.statusText}`);
      }
      
      console.log('Job featured status updated successfully');
    } catch (err) {
      console.error("Error updating featured status:", err);
      setError(err instanceof Error ? err.message : 'Failed to update featured status');
      
      // Revert the local state change
      setJobs(jobs.map(j => (j._id === job._id ? { ...j, featured: job.featured } : j)));
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

  console.log("AdminJobsPage render state:", { loading, error, jobCount: jobs.length }); // Debug log

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/jobs/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Job
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search jobs by title, company or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value)}
                >
                  <option value="">All Jobs</option>
                  <option value="featured">Featured</option>
                  <option value="not-featured">Not Featured</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="text-sm text-gray-600 font-medium">
                Found {totalJobs} job{totalJobs !== 1 ? 's' : ''}
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Loading and error states */}
        {isLoading && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 text-center">
            <div className="animate-pulse flex space-x-4 justify-center">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1 max-w-md">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 text-center">
            <div className="text-red-500 font-medium">{error}</div>
            <button 
              onClick={() => fetchJobs()}
              className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Jobs table */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Job Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                    >
                      Company
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Posted Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Featured
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                        No jobs found. Try adjusting your filters or add a new job.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job._id?.toString() || job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{job.title}</div>
                            <div className="text-sm text-gray-500 sm:hidden">
                              {typeof job.company === 'object' ? job.company?.name : job.company || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 sm:hidden">{job.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm text-gray-900 truncate max-w-[150px]">
                            {typeof job.company === 'object' ? job.company?.name : job.company || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-500 truncate max-w-[150px]">{job.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-sm text-gray-500">
                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 
                             job.postedDate ? (
                               typeof job.postedDate === 'string' ? 
                                 isNaN(Date.parse(job.postedDate)) ? 
                                   job.postedDate : 
                                   new Date(job.postedDate).toLocaleDateString('en-US', {
                                     year: 'numeric',
                                     month: 'short',
                                     day: 'numeric'
                                   }) : 
                                 new Date(job.postedDate).toLocaleDateString('en-US', {
                                   year: 'numeric',
                                   month: 'short',
                                   day: 'numeric'
                                 })
                             ) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              job.status === 'active' || job.active
                                ? 'bg-green-100 text-green-800'
                                : job.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : job.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button 
                            onClick={() => toggleFeaturedStatus(job)}
                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            role="switch"
                            aria-checked={job.featured}
                          >
                            <span 
                              aria-hidden="true" 
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                job.featured ? 'translate-x-5 bg-blue-600' : 'translate-x-0 bg-gray-500'
                              }`}
                            />
                            <span 
                              className={`${
                                job.featured ? 'bg-blue-600' : 'bg-gray-200'
                              } absolute inset-0 h-full w-full rounded-full transition-colors duration-200 ease-in-out`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/admin/jobs/${job._id?.toString() || job.id}/edit`}
                              className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                            >
                              Edit
                            </Link>
                            <button
                              className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                              onClick={() => handleDeleteClick(job._id?.toString() || job.id || '')}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                } text-sm font-medium`}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              {/* Show limited page numbers with ellipsis for better mobile UX */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                // Only show current page, first and last page, and pages around current
                const shouldShow = 
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);
                
                // Show ellipsis between gaps
                if (!shouldShow) {
                  // Show ellipsis only once between gaps
                  if (pageNumber === 2 || pageNumber === totalPages - 1) {
                    return (
                      <span key={`ellipsis-${pageNumber}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === pageNumber
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }).filter(Boolean)}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                } text-sm font-medium`}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Job</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">Are you sure you want to delete this job? This action cannot be undone.</p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-white text-gray-700 text-base font-medium rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminJobsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <AdminJobsContent />
    </Suspense>
  );
} 