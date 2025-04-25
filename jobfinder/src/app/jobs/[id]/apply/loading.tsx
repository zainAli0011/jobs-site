export default function ApplicationLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-6">
        <div className="animate-pulse h-6 w-40 bg-gray-200 rounded"></div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-7 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Application Form Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="h-7 bg-gray-200 rounded mb-6 w-1/3"></div>
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <div className="h-5 bg-gray-200 rounded mb-4 w-1/4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-100 rounded w-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-100 rounded w-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-100 rounded w-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-100 rounded w-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Resume Upload */}
                <div>
                  <div className="h-5 bg-gray-200 rounded mb-4 w-1/4"></div>
                  <div className="h-24 bg-gray-100 rounded border-2 border-dashed border-gray-200 flex items-center justify-center">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                
                {/* Work Experience */}
                <div>
                  <div className="h-5 bg-gray-200 rounded mb-4 w-1/4"></div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="h-32 bg-gray-100 rounded w-full"></div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="h-12 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 