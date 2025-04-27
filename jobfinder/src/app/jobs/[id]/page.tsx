import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import { Metadata } from "next";

// Ensure the page is not cached
export const revalidate = 0;

interface JobDetailParams {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: JobDetailParams): Promise<Metadata> {
  try {
    await connectToDatabase();
    const job = await Job.findById(params.id).lean();
    
    if (!job || !job.active) {
      return {
        title: "Job Not Found | JobFinder",
        description: "The job listing you're looking for could not be found.",
      };
    }
    
    return {
      title: `${job.title} at ${job.company} | JobFinder`,
      description: job.description || `${job.title} job opportunity at ${job.company}`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Job Details | JobFinder",
      description: "View job details and apply for this position.",
    };
  }
}

async function getJobById(id: string) {
  try {
    await connectToDatabase();
    // Only return the job if it exists and is active
    return await Job.findOne({ _id: id, active: true }).lean();
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export default async function JobDetailPage({ params }: JobDetailParams) {
  const job = await getJobById(params.id);
  
  // If job doesn't exist or is not active, show 404
  if (!job) {
    return notFound();
  }
  
  console.log(`Job detail page loaded for job ID: ${params.id}, title: ${job.title}`);
  
  // Parse requirements and benefits if they're stored as strings
  const requirements = typeof job.requirements === 'string' 
    ? job.requirements.split('\n') 
    : job.requirements;
    
  const benefits = job.benefits && typeof job.benefits === 'string' 
    ? job.benefits.split('\n') 
    : (job.benefits || []);
  
  // Format salary display
  const salaryDisplay = typeof job.salary === 'string' 
    ? job.salary 
    : `${job.salary.currency}${job.salary.min?.toLocaleString()} - ${job.salary.currency}${job.salary.max?.toLocaleString()} ${job.salary.period}`;
  
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Job Header */}
      <div className="rounded-lg border bg-card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 rounded-md overflow-hidden w-20 h-20 bg-gray-100 flex items-center justify-center">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={`${job.company} logo`}
                width={80}
                height={80}
                className="object-contain"
              />
            ) : (
              <div className="text-3xl font-bold text-indigo-600">
                {job.company.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{job.company}</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
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
                {job.type}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {salaryDisplay}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Posted on {new Date(job.postedDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <Link
              href={`/jobs/${job._id?.toString() || job.id}/apply`}
              className="w-full md:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8">
          {/* Job Description */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="text-base leading-relaxed mb-6">{job.description}</p>
            
            <h3 className="text-lg font-medium mb-3">Requirements</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              {requirements.map((requirement: string, index: number) => (
                <li key={index} className="text-base leading-relaxed">
                  {requirement}
                </li>
              ))}
            </ul>
            
            {benefits.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-3">Benefits</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {benefits.map((benefit: string, index: number) => (
                    <li key={index} className="text-base leading-relaxed">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          
          {/* Application Instructions */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">How to Apply</h2>
            <p className="text-base leading-relaxed mb-4">
              To apply for this position, please click the "Apply Now" button and fill out the application form.
              Make sure to include your resume and a cover letter explaining why you're a good fit for this role.
            </p>
            <div className="mt-6">
              <Link
                href={`/jobs/${job._id?.toString() || job.id}/apply`}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Apply for this Position
              </Link>
            </div>
            <p className="text-base leading-relaxed mt-4">
              If you have any questions about the application process, please contact our recruitment team at
              <a href="mailto:jobs@example.com" className="text-primary ml-1 hover:underline">
                jobs@example.com
              </a>
              .
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Ad space */}
          <div className="rounded-lg border bg-card p-4 sticky top-6">
            <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
            <div className="bg-muted w-full h-72 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Ad Space</p>
            </div>
          </div>
          
          {/* Similar Jobs */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold mb-4">Similar Jobs</h3>
            <div className="space-y-4">
              <div className="text-center py-6">
                <p className="text-muted-foreground">Loading similar jobs...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 