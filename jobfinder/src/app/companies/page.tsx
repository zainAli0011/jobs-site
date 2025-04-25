import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { connectToDatabase } from '@/lib/db';
import Company from '@/models/Company';

export const metadata: Metadata = {
  title: 'Companies Hiring | JobFinder',
  description: 'Browse companies that are actively hiring. Find your next career opportunity with top employers.',
};

async function getCompanies() {
  try {
    await connectToDatabase();
    return await Company.find({ active: true })
      .sort({ jobListings: -1 })
      .lean();
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

export default async function CompaniesPage() {
  const companies = await getCompanies();
  
  // Featured companies (top 4)
  const featuredCompanies = companies.slice(0, 4);
  
  // Remaining companies
  const remainingCompanies = companies.slice(4);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-8 mb-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Companies Hiring Now</h1>
          <p className="text-lg opacity-90 mb-6">
            Discover {companies.length} companies with open positions
          </p>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white/95 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      {/* Featured Companies */}
      <section className="mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Companies</h2>
          <p className="text-gray-600">Top employers with multiple positions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCompanies.map((company) => (
            <Link
              key={company._id.toString()}
              href={`/companies/${company._id}`}
              className="block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
            >
              <div className="h-28 bg-gray-100 flex items-center justify-center p-4">
                {company.logo ? (
                  <Image 
                    src={company.logo} 
                    alt={`${company.name} logo`}
                    width={120}
                    height={40}
                    className="max-h-16 object-contain"
                  />
                ) : (
                  <div className="text-xl font-bold text-gray-400">{company.name}</div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                <div className="text-sm text-gray-500 mb-3">{company.industry} • {company.location}</div>
                
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                    {company.jobListings || 0} open {company.jobListings === 1 ? 'job' : 'jobs'}
                  </span>
                  
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(company.jobListings || 0, 3))].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                        {i + 1}
                      </div>
                    ))}
                    {(company.jobListings || 0) > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                        +{(company.jobListings || 0) - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* All Companies */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Companies</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200">
              Most Jobs
            </button>
            <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">
              A-Z
            </button>
            <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100">
              Recent
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {remainingCompanies.map((company) => (
            <Link 
              key={company._id.toString()}
              href={`/companies/${company._id}`}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 mr-3 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {company.logo ? (
                  <Image 
                    src={company.logo} 
                    alt={`${company.name} logo`}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-lg font-bold text-gray-400">{company.name.charAt(0)}</div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-500">
                  {company.jobListings || 0} {company.jobListings === 1 ? 'job' : 'jobs'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Company Benefits Section */}
      <section className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Why List Your Company on JobFinder?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join hundreds of companies who trust JobFinder to connect with qualified candidates
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Reach Qualified Candidates</h3>
            <p className="text-gray-600">
              Connect with thousands of qualified professionals actively looking for their next opportunity.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Streamlined Hiring</h3>
            <p className="text-gray-600">
              Our platform optimizes the recruitment process, saving you time and resources.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Enhanced Brand Visibility</h3>
            <p className="text-gray-600">
              Showcase your company culture and values to attract candidates who align with your mission.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/employers"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            List Your Company
          </Link>
        </div>
      </section>
    </main>
  );
} 