export default function JobLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar */}
        <div className="w-full md:w-1/4">
          <div className="h-72 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
        </div>

        {/* Main content */}
        <div className="w-full md:w-2/4">
          {/* Job header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-24"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-32"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-28"></div>
            </div>
          </div>

          {/* Job description */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="h-7 bg-gray-200 animate-pulse rounded w-48 mb-4"></div>
            <div className="space-y-3 mb-6">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5"></div>
            </div>

            <div className="h-7 bg-gray-200 animate-pulse rounded w-48 mb-4 mt-8"></div>
            <div className="space-y-2 mb-6">
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Apply button */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-12 bg-gray-200 animate-pulse rounded-lg w-full"></div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="h-7 bg-gray-200 animate-pulse rounded w-32 mb-4"></div>
            <div className="h-16 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
          </div>
          
          <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  );
} 