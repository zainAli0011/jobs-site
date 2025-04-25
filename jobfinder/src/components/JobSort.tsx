"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface JobSortProps {
  currentSort: string;
}

export default function JobSort({ currentSort }: JobSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "highest-salary", label: "Highest Salary" },
    { value: "lowest-salary", label: "Lowest Salary" },
  ];

  const currentOption = sortOptions.find(option => option.value === currentSort) || sortOptions[0];

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        className="flex items-center justify-between w-48 px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentOption.label}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-48 mt-1 bg-white border rounded-md shadow-lg">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                option.value === currentSort ? "bg-gray-100" : ""
              }`}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 