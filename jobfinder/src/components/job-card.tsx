import Link from "next/link";
import Image from "next/image";
import { Job } from "@/lib/types";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  className?: string;
}

export function JobCard({ job, className }: JobCardProps) {
  // Format salary properly from the object
  const formatSalary = (salary: any) => {
    if (!salary) return "Not specified";
    
    // If salary is already a string, return it directly
    if (typeof salary === 'string') return salary;
    
    // Otherwise, format the salary object
    try {
      const { min, max, currency, period } = salary;
      let formattedSalary = "";
      
      if (min && max) {
        formattedSalary = `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
      } else if (min) {
        formattedSalary = `${currency}${min.toLocaleString()}+`;
      } else if (max) {
        formattedSalary = `Up to ${currency}${max.toLocaleString()}`;
      } else {
        return "Competitive";
      }
      
      // Add period if available
      if (period) {
        formattedSalary += ` ${period}`;
      }
      
      return formattedSalary;
    } catch (error) {
      // Fallback for any parsing errors
      return "Competitive";
    }
  };

  // Calculate days ago for the posted date
  const getPostedTime = (postedDate: Date | string) => {
    if (!postedDate) return "Recently";
    
    const postDate = postedDate instanceof Date ? postedDate : new Date(postedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <div
      className={cn(
        "group rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="hidden sm:flex flex-shrink-0 w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden items-center justify-center">
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={`${job.company} logo`}
              width={56}
              height={56}
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-xl">
              {job.company.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Job Details */}
        <div className="flex-grow">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h3 className="text-lg font-semibold group-hover:text-indigo-600 transition-colors">
              <Link href={`/jobs/${job._id?.toString() || job.id}`}>
                {job.title}
              </Link>
            </h3>
            <div className="text-xs text-gray-500">
              {getPostedTime(job.postedDate)}
            </div>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <span className="mr-3 font-medium">{job.company}</span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {job.location}
            </span>
          </div>
          
          {/* Job tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
              {job.type}
            </span>
            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
              {formatSalary(job.salary)}
            </span>
            {job.workplace && (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                {job.workplace}
              </span>
            )}
          </div>
          
          {/* Job short description - optional */}
          {job.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {job.description}
            </p>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/jobs/${job._id?.toString() || job.id}`}
              className="inline-flex items-center justify-center rounded-md border border-indigo-600 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors"
            >
              View Details
            </Link>
            <Link
              href={`/jobs/${job._id?.toString() || job.id}/apply`}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 