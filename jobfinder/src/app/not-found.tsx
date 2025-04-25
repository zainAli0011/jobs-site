import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[500px] py-16 px-4 text-center">
      <div className="mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Go to Home
        </Link>
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center rounded-md border bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-muted/50"
        >
          Browse Jobs
        </Link>
      </div>
      <div className="mt-12">
        <p className="text-sm text-muted-foreground">
          If you believe this is an error, please{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
} 