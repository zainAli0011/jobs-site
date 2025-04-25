"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ApplicationDetails {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetterUrl?: string;
  linkedIn?: string;
  portfolio?: string;
  referral?: string;
  workAuthorization: string;
  relocation: string;
  salaryExpectation?: string;
  startDate?: string;
  heardAbout?: string;
  additionalInfo?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApplicationViewParams {
  params: {
    id: string;
  };
}

export default function ApplicationDetailPage({ params }: ApplicationViewParams) {
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch application details
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/applications/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/admin/applications');
            return;
          }
          throw new Error('Failed to fetch application');
        }
        
        const data = await response.json();
        setApplication(data.application);
        setStatus(data.application.status);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchApplication();
  }, [params.id, router]);

  // Handle status change
  const handleStatusChange = async () => {
    if (!application || status === application.status) return;
    
    try {
      setIsUpdating(true);
      
      const response = await fetch(`/api/applications/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      
      // Update the application in state
      setApplication(prev => {
        if (!prev) return null;
        return { ...prev, status };
      });
      
      setIsUpdating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application status');
      setIsUpdating(false);
    }
  };

  // Handle deletion
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const response = await fetch(`/api/applications/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete application');
      }
      
      // Redirect to applications list
      router.push('/admin/applications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application');
      setIsUpdating(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interviewed':
        return 'bg-purple-100 text-purple-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Application Not Found</h2>
          <p className="mb-4">The application you're looking for doesn't exist or has been deleted.</p>
          <Link
            href="/admin/applications"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Return to Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Link
              href="/admin/applications"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Applications
            </Link>
            <h1 className="text-2xl font-bold mt-2">Application Details</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="interviewed">Interviewed</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <button
              onClick={handleStatusChange}
              disabled={isUpdating || status === application.status}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              Delete Application
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {application.fullName}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Applied for <span className="font-medium">{application.jobTitle}</span> at <span className="font-medium">{application.company}</span>
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(application.status)}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Applied {formatDate(application.createdAt)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a href={`mailto:${application.email}`} className="text-indigo-600 hover:text-indigo-800">
                    {application.email}
                  </a>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a href={`tel:${application.phone}`} className="text-indigo-600 hover:text-indigo-800">
                    {application.phone}
                  </a>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Resume</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a 
                    href={application.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resume
                  </a>
                </dd>
              </div>
              {application.coverLetterUrl && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Cover Letter</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <a 
                      href={application.coverLetterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Cover Letter
                    </a>
                  </dd>
                </div>
              )}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Work Authorization</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {application.workAuthorization === 'citizen' ? 'U.S. Citizen / Permanent Resident' :
                   application.workAuthorization === 'visa' ? 'Visa Holder' : 'Needs Sponsorship'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Relocation</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {application.relocation === 'yes' ? 'Willing to relocate' :
                   application.relocation === 'no' ? 'Not willing to relocate' : 'Prefers remote work'}
                </dd>
              </div>
              {application.salaryExpectation && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Salary Expectation</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {application.salaryExpectation}
                  </dd>
                </div>
              )}
              {application.startDate && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Earliest Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {application.startDate}
                  </dd>
                </div>
              )}
              {application.linkedIn && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <a 
                      href={application.linkedIn} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {application.linkedIn}
                    </a>
                  </dd>
                </div>
              )}
              {application.portfolio && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Portfolio</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <a 
                      href={application.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {application.portfolio}
                    </a>
                  </dd>
                </div>
              )}
              {application.referral && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Referral</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {application.referral}
                  </dd>
                </div>
              )}
              {application.heardAbout && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">How They Heard About Us</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {application.heardAbout}
                  </dd>
                </div>
              )}
              {application.additionalInfo && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Additional Information</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                    {application.additionalInfo}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Link
            href={`/admin/jobs/${application.jobId}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View Job Posting
          </Link>
          
          <div>
            <a
              href={`mailto:${application.email}`}
              className="inline-flex items-center mr-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Candidate
            </a>
            
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 