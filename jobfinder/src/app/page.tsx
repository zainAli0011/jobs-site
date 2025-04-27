import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import { JobCard } from '@/components/job-card';

export const metadata: Metadata = {
  title: 'JobFinder - Find Your Dream Job',
  description: 'Discover thousands of job opportunities across various industries. Find your dream job with JobFinder.',
};

// Added cache control to prevent stale data
export const revalidate = 0; // This ensures the page is not cached and is regenerated on each request

async function getFeaturedJobs() {
  try {
    await connectToDatabase();
    // Explicitly check both active and deleted flags
    return await Job.find({ featured: true, active: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
  } catch (error) {
    console.error('Error fetching featured jobs:', error);
    return [];
  }
}

async function getRecentJobs() {
  try {
    await connectToDatabase();
    // Explicitly check both active and deleted flags
    return await Job.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
  } catch (error) {
    console.error('Error fetching recent jobs:', error);
    return [];
  }
}

export default async function Home() {
  // Using dynamic imports to force fresh data fetching
  const [featuredJobs, recentJobs] = await Promise.all([
    getFeaturedJobs(),
    getRecentJobs()
  ]);

  console.log(`Home page loaded with ${featuredJobs.length} featured jobs and ${recentJobs.length} recent jobs`);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-700 py-20 lg:py-28 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 -mt-24 -mr-24 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-96 w-96 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
        
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Dream Job</span> Today
            </h1>
            <p className="text-lg md:text-xl mb-8 text-indigo-100 leading-relaxed">
              Discover thousands of job opportunities from top companies. Your next career move is just a click away.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link 
                href="/jobs"
                className="px-6 py-3 text-center font-medium rounded-lg bg-white text-indigo-800 hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
              >
                Browse All Jobs
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>5,000+ Jobs Available</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100+ Top Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Remote & Onsite Options</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">5000+</div>
              <p className="text-gray-600">Active Jobs</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">750+</div>
              <p className="text-gray-600">Companies</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">12K+</div>
              <p className="text-gray-600">Job Seekers</p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">98%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Jobs</h2>
              <p className="text-gray-600 mt-2">Handpicked opportunities from top employers</p>
            </div>
            <Link 
              href="/jobs?featured=true"
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All Featured Jobs
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map(job => (
                <JobCard key={job._id ? job._id.toString() : job.id} job={{
                  id: job._id ? job._id.toString() : job.id,
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
                  postedDate: job.postedDate
                }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="mb-4 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 mb-2">No featured jobs available at the moment.</p>
              <p className="text-gray-500">Check back soon or browse all job listings.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Recent Jobs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recent Job Opportunities</h2>
              <p className="text-gray-600 mt-2">Latest positions from our job board</p>
            </div>
            <Link 
              href="/jobs"
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All Jobs
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentJobs.slice(0, 3).map(job => (
                <JobCard key={job._id ? job._id.toString() : job.id} job={{
                  id: job._id ? job._id.toString() : job.id,
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
                  postedDate: job.postedDate
                }} className="h-full" />
              ))}
              
              {recentJobs.length > 3 && (
                <div className="grid col-span-1 md:col-span-2 xl:col-span-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {recentJobs.slice(3).map(job => (
                    <JobCard key={job._id ? job._id.toString() : job.id} job={{
                      id: job._id ? job._id.toString() : job.id,
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
                      postedDate: job.postedDate
                    }} className="h-full" />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="mb-4 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 mb-2">No recent jobs available at the moment.</p>
              <p className="text-gray-500">Check back soon or browse all job listings.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Next Opportunity?</h2>
            <p className="text-lg text-indigo-200 mb-8">Join thousands of job seekers who have found their dream jobs through our platform.</p>
            <div className="flex justify-center">
              <Link 
                href="/jobs"
                className="px-8 py-3 text-center font-medium rounded-lg bg-white text-indigo-900 hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
              >
                Explore Jobs
              </Link>
            </div>
          </div>
    </div>
      </section>
    </main>
  );
}
