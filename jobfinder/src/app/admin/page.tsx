import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import Company from '@/models/Company';
import Application from '@/models/Application';
import { formatDistanceToNow } from 'date-fns';

async function getDashboardStats() {
  try {
    await connectToDatabase();

    // Get total jobs count
    const totalJobs = await Job.countDocuments({});
    
    // Get active jobs count
    const activeJobs = await Job.countDocuments({ active: true });
    
    // Get companies count
    const totalCompanies = await Company.countDocuments({});
    
    // Get total applications
    const totalApplications = await Application.countDocuments({});
    
    // Get recent jobs (last 5)
    const recentJobs = await Job.find({})
      .sort({ postedDate: -1 })
      .limit(5)
      .lean();
    
    // Get recent applications (last 5)
    const recentApplications = await Application.find({})
      .sort({ applicationDate: -1 })
      .limit(5)
      .populate('jobId', 'title company')
      .lean();

    return {
      totalJobs,
      activeJobs,
      totalCompanies,
      totalApplications,
      recentJobs,
      recentApplications
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalJobs: 0,
      activeJobs: 0,
      totalCompanies: 0,
      totalApplications: 0,
      recentJobs: [],
      recentApplications: []
    };
  }
}

export default async function AdminDashboard() {
  const {
    totalJobs,
    activeJobs,
    totalCompanies,
    totalApplications,
    recentJobs,
    recentApplications
  } = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-indigo-500 text-lg font-medium mb-2">Total Jobs</div>
          <div className="text-3xl font-bold">{totalJobs}</div>
          <div className="text-sm text-gray-600 mt-2">
            {activeJobs} active jobs ({Math.round((activeJobs / totalJobs) * 100) || 0}%)
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-indigo-500 text-lg font-medium mb-2">Active Jobs</div>
          <div className="text-3xl font-bold">{activeJobs}</div>
          <div className="text-sm text-gray-600 mt-2">
            {totalJobs - activeJobs} inactive jobs
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-indigo-500 text-lg font-medium mb-2">Companies</div>
          <div className="text-3xl font-bold">{totalCompanies}</div>
          <div className="text-sm text-gray-600 mt-2">
            {totalJobs > 0 ? Math.round(totalJobs / totalCompanies) || 0 : 0} jobs per company avg.
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-indigo-500 text-lg font-medium mb-2">Applications</div>
          <div className="text-3xl font-bold">{totalApplications}</div>
          <div className="text-sm text-gray-600 mt-2">
            {activeJobs > 0 ? Math.round(totalApplications / activeJobs) || 0 : 0} per active job avg.
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Job Postings</h2>
        <div className="space-y-4">
          {recentJobs.length > 0 ? (
            recentJobs.map((job) => (
              <div key={job._id?.toString()} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="bg-blue-100 text-blue-600 p-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">New job posting: {job.title}</p>
                  <p className="text-sm text-gray-500">
                    Posted by {job.company} • {job.postedDate ? formatDistanceToNow(new Date(job.postedDate), { addSuffix: true }) : 'recently'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent job postings found</p>
          )}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
        <div className="space-y-4">
          {recentApplications.length > 0 ? (
            recentApplications.map((application) => (
              <div key={application._id?.toString()} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="bg-green-100 text-green-600 p-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    New application: {application.firstName} {application.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    For: {application.jobId?.title || 'Unknown job'} • 
                    {application.applicationDate ? formatDistanceToNow(new Date(application.applicationDate), { addSuffix: true }) : 'recently'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent applications found</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col space-y-2">
            <a href="/admin/jobs/create" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Post a New Job
            </a>
            <a href="/admin/jobs" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              View All Jobs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 