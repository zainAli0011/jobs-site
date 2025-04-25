'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";

export interface SearchSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function SearchSection({
  title = "Find Your Dream Job Today",
  subtitle,
  className,
}: SearchSectionProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (keyword) params.append("q", keyword);
    if (category) params.append("category", category);
    if (location) params.append("location", location);
    
    // Redirect to jobs page with search parameters
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className={cn("w-full bg-primary py-12 px-4", className)}>
      <div className="container mx-auto flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-card shadow-lg rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-4">
            <div className="flex items-center w-full bg-background border rounded-md px-3 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-muted-foreground"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 py-1 px-3"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="relative w-full md:w-auto">
              <select
                className="appearance-none w-full border rounded-md bg-background px-3 py-2 pr-8 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug || category.name.toLowerCase()}>
                    {category.name}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="relative w-full md:w-auto">
              <select
                className="appearance-none w-full border rounded-md bg-background px-3 py-2 pr-8 text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="new-york">New York</option>
                <option value="san-francisco">San Francisco</option>
                <option value="london">London</option>
                <option value="tokyo">Tokyo</option>
                <option value="remote">Remote</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
} 