import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { connectToDatabase } from "@/lib/db";
import Job from "@/models/Job";

interface SuccessPageParams {
  params: {
    id: string;
  };
}

// Function to get job by ID from database
async function getJobById(id: string) {
  try {
    await connectToDatabase();
    const job = await Job.findById(id).lean();
    return job ? {
      _id: job._id,
      id: job._id.toString(),
      title: job.title,
      company: job.company,
      // Include other job properties as needed
    } : null;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export async function generateMetadata({ params }: SuccessPageParams): Promise<Metadata> {
  const job = await getJobById(params.id);
  
  if (!job) {
    return {
      title: "Application Submitted",
    };
  }
  
  return {
    title: `Application Submitted | ${job.title} | JobFinder`,
    description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
  };
}

export default async function ApplicationSuccessPage({ params }: SuccessPageParams) {
  const job = await getJobById(params.id);
  
  if (!job) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-10">
          <div className="h-24 w-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for applying to the <span className="font-medium text-gray-900">{job.title}</span> position at <span className="font-medium text-gray-900">{job.company}</span>.
          </p>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-8 mb-10 text-left shadow-sm">
          <h2 className="text-xl font-semibold mb-6">What happens next?</h2>
          <ul className="space-y-4 list-disc pl-5">
            <li className="text-base text-gray-700">
              Our team will review your application and assess your qualifications for the role.
            </li>
            <li className="text-base text-gray-700">
              You will receive a confirmation email shortly with details about your application.
            </li>
            <li className="text-base text-gray-700">
              If your profile matches our requirements, a recruiter will contact you within 5-7 business days to schedule an interview.
            </li>
            <li className="text-base text-gray-700">
              You can track the status of your application in your JobFinder account.
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href={`/jobs/${job._id?.toString() || job.id}`}
            className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Return to Job Details
          </Link>
          <Link
            href="/jobs"
            className="inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Browse More Jobs
          </Link>
        </div>
      </div>
    </div>
  );
} 