import { Metadata } from "next";
import { JobCard } from '@/components/job-card';
import JobFilter from '@/components/JobFilter';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import SortDropdown from '@/components/SortDropdown';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';

// Ensure the page is not cached
export const revalidate = 0;

export const metadata = {
  title: "Jobs | JobFinder",
  description: "Browse thousands of job listings and find your next career move with JobFinder."
};

// Function to fetch jobs from database with filters
async function getJobs(searchParams: Record<string, string>) {
  try {
    console.log('Fetching jobs with filters:', searchParams);
    await connectToDatabase();
    
    // Build query filter - ALWAYS filter for active jobs
    const filter: any = { active: true };
    
    // Search query
    if (searchParams.q) {
      const query = searchParams.q.toLowerCase();
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Location filter
    if (searchParams.location) {
      filter.location = { $regex: searchParams.location, $options: 'i' };
    }
    
    // Category filter
    if (searchParams.category) {
      filter.category = { $regex: `^${searchParams.category}$`, $options: 'i' };
    }
    
    // Job type filter
    if (searchParams.type) {
      filter.type = searchParams.type;
    }
    
    // Workplace filter
    if (searchParams.workplace) {
      filter.workplace = searchParams.workplace;
    }
    
    // Featured filter
    if (searchParams.featured === 'true') {
      filter.featured = true;
    }
    
    // Pagination setup
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const jobsPerPage = 10;
    const skip = (page - 1) * jobsPerPage;
    
    // Sorting options
    let sortOption: any = { createdAt: -1 }; // Default: newest first
    
    const sort = searchParams.sort || 'newest';
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'nameAsc':
        sortOption = { title: 1 };
        break;
      case 'nameDesc':
        sortOption = { title: -1 };
        break;
      case 'companyAsc':
        sortOption = { company: 1 };
        break;
      case 'companyDesc':
        sortOption = { company: -1 };
        break;
    }
    
    // Count total jobs matching filters (for pagination)
    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    
    // Fetch paginated jobs with filters and sorting
    const jobs = await Job.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(jobsPerPage)
      .lean();
    
    // Transform MongoDB documents to a friendlier format
    const formattedJobs = jobs.map(job => ({
      _id: job._id,
      id: job._id.toString(),
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo || '',
      location: job.location,
      type: job.type,
      salary: job.salary,
      workplace: job.workplace || 'On-site',
      description: job.description,
      requirements: typeof job.requirements === 'string' ? job.requirements.split('\n') : job.requirements,
      benefits: job.benefits ? (typeof job.benefits === 'string' ? job.benefits.split('\n') : job.benefits) : [],
      category: job.category,
      postedDate: job.postedDate || job.createdAt
    }));
    
    // Debug log
    console.log(`Found ${totalJobs} active jobs matching filters`);
    
    return {
      jobs: formattedJobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs
      }
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return {
      jobs: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalJobs: 0
      }
    };
  }
}

type SearchParamsProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function JobsPage({ searchParams }: SearchParamsProps) {
  // Convert query parameters to correct format
  const params: Record<string, string> = {};
  
  // Process searchParams (already a plain object, no need for Object.fromEntries)
  for (const [key, value] of Object.entries(searchParams || {})) {     
    params[key] = Array.isArray(value) ? value[0] : (value as string) || '';
  }
  
  // Fetch jobs with filters and pagination
  const { jobs, pagination } = await getJobs(params);
  
  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="mt-2 text-lg text-gray-600">
          Find your dream job from our curated list of opportunities
        </p>
      </div>
      
      {/* Filters and results layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <aside className="md:col-span-1">
          <JobFilter />
        </aside>
        
        {/* Job listings */}
        <div className="md:col-span-3">
          {/* Results header and sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {pagination.totalJobs} {pagination.totalJobs === 1 ? 'job' : 'jobs'} found
              </h2>
            </div>
            
            {pagination.totalJobs > 1 && (
              <div className="mt-2 sm:mt-0 relative">
                <SortDropdown currentSort={params.sort || 'newest'} />
              </div>
            )}
          </div>
          
          {/* Job listings */}
          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((job) => <JobCard key={job._id?.toString() || job.id} job={job} />)
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search filters or browse all available positions.
                </p>
                <Link 
                  href="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View All Jobs
                </Link>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination 
                currentPage={pagination.currentPage} 
                totalPages={pagination.totalPages} 
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}