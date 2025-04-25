import Link from "next/link";
import { Company } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CompanyCardProps {
  company: Company;
  className?: string;
}

export function CompanyCard({ company, className }: CompanyCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border p-4 shadow-sm bg-card hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 rounded-md overflow-hidden w-16 h-16 bg-primary/10 flex items-center justify-center">
          <span className="text-xl font-semibold text-primary">{company.name.charAt(0)}</span>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">
            <Link href={`/companies/${company.id}`} className="hover:text-primary transition-colors">
              {company.name}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">{company.industry}</p>
        </div>
      </div>
      
      <div className="text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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
          <span>{company.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>{company.size}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          <a 
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Website
          </a>
        </div>
      </div>
      
      <div className="mt-auto">
        <p className="text-sm font-medium mb-2">Open Positions: {company.jobCount}</p>
        <Link
          href={`/companies/${company.id}`}
          className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/20"
        >
          View Company
        </Link>
      </div>
    </div>
  );
} 