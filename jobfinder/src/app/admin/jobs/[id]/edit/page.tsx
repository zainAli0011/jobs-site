'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
export default function EditJob() {
  const params = useParams();
  const jobId = params.id as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    category: '',
    experience: '',
    salary: {
      min: '',
      max: '',
      currency: 'USD',
      period: 'year'
    },
    description: '',
    requirements: '',
    benefits: '',
    applicationInstructions: '',
    contactEmail: '',
    isRemote: false,
    status: 'active'
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        const data = await response.json();
        console.log('Job data loaded:', data.job);
        
        // Normalize the experienceLevel/experience field
        if (data.job.experienceLevel && !data.job.experience) {
          data.job.experience = data.job.experienceLevel;
        } else if (data.job.experience && !data.job.experienceLevel) {
          data.job.experienceLevel = data.job.experience;
        }
        
        setFormData(data.job);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching job:', error);
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to update job');
      }
      router.push(`/admin/jobs`);
    } catch (error) {
      console.error('Error updating job:', error);
      alert(`Failed to update job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render skeleton loader for input fields
  const renderFieldLoader = () => (
    <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>
  );
  
  // Function to render skeleton loader for textareas
  const renderTextareaLoader = (height = 'h-32') => (
    <div className={`w-full ${height} bg-gray-200 animate-pulse rounded-md`}></div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Job</h1>
        <Link 
          href="/admin/jobs" 
          className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          Back to Jobs
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                <>
                  {Array(6).fill(0).map((_, index) => (
                    <div key={index}>
                      <div className="h-5 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                      {renderFieldLoader()}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="isRemote"
                          checked={formData.isRemote}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">This is a remote position</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="temporary">Temporary</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a category</option>
                      <option value="technology">Technology</option>
                      <option value="marketing">Marketing</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="design">Design</option>
                      <option value="education">Education</option>
                      <option value="customer-service">Customer Service</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience || formData.experienceLevel || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select experience level</option>
                      <option value="entry-level">Entry Level</option>
                      <option value="mid-level">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive Level</option>
                      <option value="entry">Entry Level (Legacy)</option>
                      <option value="mid">Mid Level (Legacy)</option>
                      <option value="senior">Senior Level (Legacy)</option>
                      <option value="executive">Executive Level (Legacy)</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Salary Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Salary Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                <>
                  {Array(4).fill(0).map((_, index) => (
                    <div key={index}>
                      <div className="h-5 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                      {renderFieldLoader()}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="salary.min" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Salary
                    </label>
                    <input
                      type="number"
                      id="salary.min"
                      name="salary.min"
                      value={formData.salary.min}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="salary.max" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Salary
                    </label>
                    <input
                      type="number"
                      id="salary.max"
                      name="salary.max"
                      value={formData.salary.max}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="salary.currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      id="salary.currency"
                      name="salary.currency"
                      value={formData.salary.currency}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="salary.period" className="block text-sm font-medium text-gray-700 mb-1">
                      Period
                    </label>
                    <select
                      id="salary.period"
                      name="salary.period"
                      value={formData.salary.period}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="year">Per Year</option>
                      <option value="month">Per Month</option>
                      <option value="week">Per Week</option>
                      <option value="hour">Per Hour</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Job Details Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Job Details</h2>
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <div>
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                    {renderTextareaLoader('h-40')}
                  </div>
                  <div>
                    <div className="h-5 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                    {renderTextareaLoader('h-32')}
                  </div>
                  <div>
                    <div className="h-5 w-36 bg-gray-200 animate-pulse rounded mb-2"></div>
                    {renderTextareaLoader('h-32')}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={6}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      required
                      rows={4}
                      value={formData.requirements}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                      Benefits and Perks
                    </label>
                    <textarea
                      id="benefits"
                      name="benefits"
                      rows={4}
                      value={formData.benefits}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Application Instructions Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Instructions</h2>
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <div>
                    <div className="h-5 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                    {renderTextareaLoader('h-24')}
                  </div>
                  <div>
                    <div className="h-5 w-48 bg-gray-200 animate-pulse rounded mb-2"></div>
                    {renderFieldLoader()}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="applicationInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                      How to Apply
                    </label>
                    <textarea
                      id="applicationInstructions"
                      name="applicationInstructions"
                      rows={3}
                      value={formData.applicationInstructions}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email for Applications
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Publish Settings Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Publish Settings</h2>
            <div>
              {isLoading ? (
                <div>
                  <div className="h-5 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="w-full md:w-1/3 h-10 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              ) : (
                <>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="active">Published</option>
                    <option value="paused">Paused</option>
                    <option value="expired">Expired</option>
                  </select>
                </>
              )}
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/jobs"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Update Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 