import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import ApplicationForm from './application-form';

interface ApplicationPageParams {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ApplicationPageParams): Promise<Metadata> {
  try {
    const { id } = params;
    await connectToDatabase();
    const job = await Job.findById(id).lean();

    if (!job) {
      return {
        title: 'Job Not Found',
        description: 'The job listing you are looking for does not exist or has been removed.'
      };
    }

    return {
      title: `Apply for ${job.title} at ${job.company.name} | JobFinder`,
      description: `Apply for the ${job.title} position at ${job.company.name}. ${job.description.substring(0, 150)}...`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Apply for Job | JobFinder',
      description: 'Apply for a job position with JobFinder.',
    };
  }
}

// Helper function to fetch job by ID
async function getJobById(id: string) {
  if (!id) return null;
  
  try {
    await connectToDatabase();
    return await Job.findById(id).lean();
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

// Serialize job data to avoid issues with MongoDB objects
function serializeJob(job: any) {
  if (!job || !job._id) return null;
  
  return {
    id: job._id.toString(),
    title: job.title,
    company: job.company.name,
    companyLogo: job.companyLogo || '',
    location: job.location,
    type: job.type,
    salary: job.salary,
    workplace: job.workplace || 'On-site',
    description: job.description,
    requirements: typeof job.requirements === 'string' ? job.requirements.split('\n') : job.requirements,
    benefits: job.benefits ? (typeof job.benefits === 'string' ? job.benefits.split('\n') : job.benefits) : [],
    postedDate: job.postedDate
  };
}

export default async function JobApplicationPage({ params }: ApplicationPageParams) {
  const { id } = params;
  const rawJob = await getJobById(id);

  if (!rawJob) {
    notFound();
  }

  const job = serializeJob(rawJob);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for {job.title}</h1>
          <p className="text-gray-600">Complete the form below to apply for this position at {job.company}.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ApplicationForm job={job} />
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500">Position</h3>
                  <p className="font-medium text-gray-900">{job.title}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500">Company</h3>
                  <p className="font-medium text-gray-900">{job.company}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500">Location</h3>
                  <p className="font-medium text-gray-900">{job.location}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500">Employment Type</h3>
                  <p className="font-medium text-gray-900">{job.type}</p>
                </div>
                
                {job.salary && (
                  <div>
                    <h3 className="text-sm text-gray-500">Salary</h3>
                    <p className="font-medium text-gray-900">
                      {typeof job.salary === 'string' 
                        ? job.salary 
                        : `${job.salary.currency}${job.salary.min?.toLocaleString()} - ${job.salary.currency}${job.salary.max?.toLocaleString()} ${job.salary.period}`}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm text-gray-500">Posted</h3>
                  <p className="font-medium text-gray-900">
                    {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Application Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Review the job description carefully</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Upload an updated resume</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Include a tailored cover letter</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Highlight relevant experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 