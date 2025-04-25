import Link from "next/link";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("w-full bg-primary-foreground py-12 border-t", className)}>
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-2 px-4">
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-bold">JobFinder</h3>
          <p className="text-sm text-muted-foreground">
            JobFinder connects job seekers with the best job opportunities.
          </p>
          <div className="flex space-x-4 mt-4">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <span className="sr-only">Twitter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                />
              </svg>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <span className="sr-only">Facebook</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                />
              </svg>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <span className="sr-only">LinkedIn</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                />
                <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth={2} />
              </svg>
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <nav className="flex flex-col space-y-2">
            <Link href="/jobs" className="text-sm text-muted-foreground hover:text-primary">
              Browse Jobs
            </Link>
          </nav>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} JobFinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 