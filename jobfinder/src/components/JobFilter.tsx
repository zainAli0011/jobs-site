"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BriefcaseIcon, MapPinIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { categories } from "@/lib/data";

interface FilterOption {
  value: string;
  label: string;
}

const workplaceOptions: FilterOption[] = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
];

export default function JobFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get current filter values from URL
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    minSalary: searchParams.get('minSalary') || '',
    workplace: searchParams.get('workplace') || ''
  });

  // Update URL with filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Only add non-empty filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    // Remove page parameter when filters change
    if (searchParams.has('page')) {
      params.delete('page');
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      q: '',
      location: '',
      category: '',
      type: '',
      minSalary: '',
      workplace: ''
    });
    
    router.push(pathname);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Filter Jobs</h3>
      
      {/* Search/Keywords */}
      <div className="mb-4">
        <label htmlFor="q" className="block text-sm font-medium text-gray-700 mb-1">
          Keywords
        </label>
        <input
          type="text"
          id="q"
          name="q"
          value={filters.q}
          onChange={handleChange}
          placeholder="Job title, skills, or keywords"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Location */}
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="City, state, or remote"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Job Type */}
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Job Type
        </label>
        <select
          id="type"
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
          <option value="Internship">Internship</option>
        </select>
      </div>
      
      {/* Minimum Salary */}
      <div className="mb-4">
        <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">
          Minimum Salary
        </label>
        <select
          id="minSalary"
          name="minSalary"
          value={filters.minSalary}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Any Salary</option>
          <option value="30000">$30,000+</option>
          <option value="50000">$50,000+</option>
          <option value="75000">$75,000+</option>
          <option value="100000">$100,000+</option>
          <option value="150000">$150,000+</option>
        </select>
      </div>
      
      {/* Workplace */}
      <div className="mb-6">
        <label htmlFor="workplace" className="block text-sm font-medium text-gray-700 mb-1">
          Workplace
        </label>
        <select
          id="workplace"
          name="workplace"
          value={filters.workplace}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Workplaces</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Reset All
        </button>
      </div>
    </form>
  );
} 