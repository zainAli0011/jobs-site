"use client";

import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SortDropdownProps {
  currentSort: string;
}

export default function SortDropdown({ currentSort }: SortDropdownProps) {
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'nameAsc', label: 'Title (A-Z)' },
    { value: 'nameDesc', label: 'Title (Z-A)' },
    { value: 'companyAsc', label: 'Company (A-Z)' },
    { value: 'companyDesc', label: 'Company (Z-A)' },
  ];
  
  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Newest';
  
  return (
    <div>
      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 sr-only">
        Sort by
      </label>
      <div className="mt-1 relative">
        <div className="inline-flex items-center">
          <span className="text-sm text-gray-500 mr-2">Sort by:</span>
          <select
            id="sort"
            name="sort"
            className="pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md cursor-pointer"
            defaultValue={currentSort}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set('sort', e.target.value);
              url.searchParams.delete('page'); // Reset to page 1 when sort changes
              window.location.href = url.toString();
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
} 