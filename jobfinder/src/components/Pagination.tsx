"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon 
} from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Function to update page in URL
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Determine which page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range: number[] = [];
    
    // Always include first page
    range.push(1);
    
    // Calculate start and end based on current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      range.push(-1); // -1 represents ellipsis
    }
    
    // Add pages in the middle
    for (let i = rangeStart; i <= rangeEnd; i++) {
      range.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      range.push(-2); // -2 represents ellipsis
    }
    
    // Always include last page if more than 1 page
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center">
      <nav className="inline-flex shadow-sm -space-x-px rounded-md" aria-label="Pagination">
        {/* First page button */}
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage <= 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
            currentPage <= 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          } text-sm font-medium`}
        >
          <span className="sr-only">First page</span>
          <ChevronDoubleLeftIcon className="h-4 w-4" aria-hidden="true" />
        </button>
        
        {/* Previous page button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`relative inline-flex items-center px-2 py-2 border ${
            currentPage <= 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          } text-sm font-medium`}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        
        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => {
          // Render ellipsis
          if (pageNumber < 0) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="relative inline-flex items-center px-4 py-2 border bg-white text-gray-700 text-sm font-medium"
              >
                ...
              </span>
            );
          }
          
          // Render page number
          return (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                currentPage === pageNumber
                  ? 'z-10 bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-current={currentPage === pageNumber ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
        
        {/* Next page button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`relative inline-flex items-center px-2 py-2 border ${
            currentPage >= totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          } text-sm font-medium`}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        
        {/* Last page button */}
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage >= totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
            currentPage >= totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          } text-sm font-medium`}
        >
          <span className="sr-only">Last page</span>
          <ChevronDoubleRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
} 