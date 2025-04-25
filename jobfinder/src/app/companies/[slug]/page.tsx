import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import Company from '@/models/Company';
import Job from '@/models/Job';
import { Company as CompanyType, Job as JobType } from '@/lib/types';

interface PageProps {
  params: {
    slug: string; // This is actually the MongoDB ObjectId
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    await connectToDatabase();
    const company = await Company.findById(params.slug).lean();
    
    if (!company) {
      return {
        title: 'Company Not Found | JobFinder',
        description: 'The requested company could not be found'
      };
    }
    
    return {
      title: `${company.name} - Company Profile | JobFinder`,
      description: `Learn about ${company.name}, view open positions, company information, and more on JobFinder.`
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Company | JobFinder',
      description: 'View company information and open positions'
    };
  }
}

async function getCompanyData(id: string) {
  try {
    await connectToDatabase();
    
    // Get company data
    const company = await Company.findById(id).lean();
    
    if (!company) {
      return { company: null, companyJobs: [], similarCompanies: [] };
    }
    
    // Get jobs from this company
    const companyJobs = await Job.find({ 
      company: company.name,
      active: true 
    }).sort({ postedDate: -1 }).lean();
    
    // Get similar companies (same industry)
    const similarCompanies = await Company.find({ 
      _id: { $ne: id },
      industry: company.industry,
      active: true
    }).limit(4).lean();
    
    return { company, companyJobs, similarCompanies };
  } catch (error) {
    console.error('Error fetching company data:', error);
    return { company: null, companyJobs: [], similarCompanies: [] };
  }
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { company, companyJobs, similarCompanies } = await getCompanyData(params.slug);
  
  if (!company) {
    notFound();
  }
  
  // Fallback for missing image
  const logoSrc = company.logo || '/images/default-company.png';
  
  // Default benefits if not specified
  const defaultBenefits = [
    'Competitive salary',
    'Professional development',
    'Collaborative work environment'
  ];
  
  const companyBenefits = company.benefits || defaultBenefits;
  
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            <Image 
              src={logoSrc}
              alt={`${company.name} logo`}
              fill
              sizes="(max-width: 768px) 100px, 96px"
              className="object-contain p-2"
            />
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{company.location}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>{company.industry}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span>{company.employees} Employees</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span>{company.rating}/5 Rating</span>
              </div>
            </div>
            
            <div className="mt-4">
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
                Visit Website
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {company.name}</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">{company.description}</p>
            </div>
          </section>
          
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Open Positions</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {company.jobOpenings} Open Jobs
              </span>
            </div>
            
            {companyJobs.length > 0 ? (
              <div className="space-y-4">
                {companyJobs.map((job: Job) => (
                  <Link 
                    key={job._id?.toString() || job.id} 
                    href={`/jobs/${job._id?.toString() || job.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {job.location}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {job.type}
                          </span>
                          {job.workplace && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {job.workplace}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-700 font-medium">
                        {job.salary}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No open positions available at this time.</p>
                <p className="mt-2">Check back later or browse other companies.</p>
              </div>
            )}
          </section>
        </div>
        
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Company Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Founded</span>
                <span className="font-medium">
                  {company.foundedYear || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Company Size</span>
                <span className="font-medium">{company.employees} Employees</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Industry</span>
                <span className="font-medium">{company.industry}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">{company.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Open Positions</span>
                <span className="font-medium text-blue-600">{company.jobOpenings}</span>
              </div>
            </div>
          </section>
          
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
            <ul className="space-y-3">
              {companyBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
          
          {similarCompanies.length > 0 && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Companies</h2>
              <div className="space-y-4">
                {similarCompanies.map((similarCompany) => (
                  <Link 
                    key={similarCompany.id} 
                    href={`/companies/${similarCompany.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all"
                  >
                    <div className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden mr-3">
                      <Image 
                        src={similarCompany.logo || '/images/default-company.png'}
                        alt={`${similarCompany.name} logo`}
                        fill
                        sizes="40px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{similarCompany.name}</h3>
                      <p className="text-sm text-gray-600">{similarCompany.jobOpenings} open positions</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
} 