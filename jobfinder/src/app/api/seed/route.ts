import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Job from '@/models/Job';
import Company from '@/models/Company';
import User from '@/models/User';
import Category from '@/models/Category';
import { jobs as jobsData, companies as companiesData } from '@/lib/data';

// Only allow seeding in development mode
const SEED_SECRET = process.env.SEED_SECRET || 'seed-secret-key';

// Sample data for seeding
const sampleCategories = [
  {
    name: "Technology",
    slug: "technology",
    icon: "laptop-code",
    description: "Software development, IT, data science, and other tech jobs",
    count: 0,
    active: true
  },
  {
    name: "Marketing",
    slug: "marketing",
    icon: "bullhorn",
    description: "Digital marketing, content creation, SEO, and marketing analytics jobs",
    count: 0,
    active: true
  },
  {
    name: "Finance",
    slug: "finance",
    icon: "chart-line",
    description: "Accounting, financial analysis, banking, and investment jobs",
    count: 0,
    active: true
  },
  {
    name: "Design",
    slug: "design",
    icon: "pencil-ruler",
    description: "UX/UI design, graphic design, product design, and creative jobs",
    count: 0,
    active: true
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    icon: "heartbeat",
    description: "Medical, nursing, healthcare administration, and wellness jobs",
    count: 0,
    active: true
  },
  {
    name: "Education",
    slug: "education",
    icon: "graduation-cap",
    description: "Teaching, training, educational technology, and academic jobs",
    count: 0,
    active: true
  },
  {
    name: "Sales",
    slug: "sales",
    icon: "handshake",
    description: "Sales, business development, account management, and retail jobs",
    count: 0,
    active: true
  },
  {
    name: "Customer Service",
    slug: "customer-service",
    icon: "headset",
    description: "Customer support, service representatives, and client success jobs",
    count: 0,
    active: true
  }
];

const sampleCompanies = [
  {
    name: "TechCorp Inc.",
    logo: "https://via.placeholder.com/80",
    industry: "Technology",
    location: "San Francisco, CA",
    description: "TechCorp Inc. is a leading technology company specializing in innovative software solutions.",
    jobListings: 0, // Will be updated when jobs are created
    rating: 4.5,
    employees: "500-1000",
    website: "https://techcorp-example.com",
    active: true
  },
  {
    name: "InnovatePro",
    logo: "https://via.placeholder.com/80",
    industry: "Technology",
    location: "New York, NY",
    description: "InnovatePro creates cutting-edge products that transform how businesses operate.",
    jobListings: 0,
    rating: 4.2,
    employees: "100-500",
    website: "https://innovatepro-example.com",
    active: true
  },
  {
    name: "DesignHub",
    logo: "https://via.placeholder.com/80",
    industry: "Design",
    location: "London, UK",
    description: "DesignHub is a creative agency focused on building beautiful digital experiences.",
    jobListings: 0,
    rating: 4.7,
    employees: "50-100",
    website: "https://designhub-example.com",
    active: true
  }
];

const sampleJobTemplates = [
  {
    title: "Senior Frontend Developer",
    type: "Full Time",
    salary: {
      min: 120000,
      max: 150000,
      currency: "$",
      period: "yearly"
    },
    workplace: "Remote",
    description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building and maintaining user interfaces for our web applications.",
    requirements: "5+ years of experience with JavaScript and modern frameworks\nExpert knowledge of React.js and its ecosystem\nExperience with TypeScript and Next.js\nStrong understanding of responsive design principles\nExperience with modern CSS frameworks like Tailwind",
    benefits: "Competitive salary and equity\nHealth, dental, and vision insurance\nFlexible work schedule\nRemote work options\nProfessional development budget",
    applicationInstructions: "Please submit your resume and portfolio link. We'll contact qualified candidates for an initial phone screening.",
    contactEmail: "careers@example.com",
    active: true,
    featured: true,
    category: "Technology"
  },
  {
    title: "Product Manager",
    type: "Full Time",
    salary: {
      min: 110000,
      max: 140000,
      currency: "$",
      period: "yearly"
    },
    workplace: "On-site",
    description: "We're seeking a Product Manager to drive product strategy and execution. You'll work closely with engineering, design, and marketing teams to deliver exceptional products.",
    requirements: "3+ years of product management experience\nStrong analytical and problem-solving skills\nExperience with agile development methodologies\nExcellent communication and stakeholder management skills\nTechnical background preferred",
    benefits: "Competitive salary\nCompany-sponsored health benefits\n401(k) matching\nProfessional development opportunities\nHybrid work model",
    applicationInstructions: "Submit your resume and a cover letter explaining your approach to product management.",
    contactEmail: "hr@example.com",
    active: true,
    featured: false,
    category: "Product"
  },
  {
    title: "UX/UI Designer",
    type: "Contract",
    salary: {
      min: 80000,
      max: 100000,
      currency: "$",
      period: "yearly"
    },
    workplace: "Hybrid",
    description: "Join our creative team as a UX/UI Designer. You'll create intuitive user experiences and visually appealing interfaces for our digital products.",
    requirements: "Portfolio demonstrating UX/UI design expertise\nExperience with design tools (Figma, Adobe XD)\nUnderstanding of user-centered design principles\nKnowledge of design systems and component libraries\nAbility to translate user research into design decisions",
    benefits: "Competitive contract rate\nFlexible work arrangements\nCreative and collaborative work environment\nOpportunity for contract extension\nProfessional development resources",
    applicationInstructions: "Please submit your portfolio and resume.",
    contactEmail: "design@example.com",
    active: true,
    featured: true,
    category: "Design"
  }
];

export async function GET(req: NextRequest) {
  try {
    // Check if seeding is allowed
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const secretKey = req.headers.get('x-seed-secret');
    
    if (!isDevelopment && secretKey !== SEED_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Seeding is only allowed in development mode or with a valid secret key' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Clear existing data if ?reset=true
    const url = new URL(req.url);
    if (url.searchParams.get('reset') === 'true') {
      await Job.deleteMany({});
      await Company.deleteMany({});
      
      // Do not delete users as they contain admin credentials
    }
    
    // Create admin user if it doesn't exist
    const adminEmail = 'admin@jobfinder.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: 'admin123', // This will be hashed by the pre-save hook
        role: 'admin'
      });
    }
    
    // Insert categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`Inserted ${categories.length} categories`);
    
    // Insert companies
    const companies = await Promise.all(
      sampleCompanies.map(async (company) => {
        // Check if company already exists
        const existingCompany = await Company.findOne({ id: company.id });
        
        if (existingCompany) {
          return existingCompany;
        }
        
        // Create new company
        return await Company.create(company);
      })
    );
    
    // Insert jobs
    const jobsCreated = await Promise.all(
      sampleJobTemplates.map(async (jobTemplate) => {
        // Find company ID or use the first one if not found
        const company = companies.find(c => c.name === jobTemplate.company) || companies[0];
        jobTemplate.companyId = company.id;
        
        // Find matching category
        const category = categories.find(c => c.name === jobTemplate.category) || categories[0];
        
        // Create new job
        return await Job.create({
          ...jobTemplate,
          company: company.name,
          companyLogo: company.logo,
          location: company.location,
          category: category.name,
          postedDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date in the last 30 days
          applicants: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 500)
        });
      })
    );
    
    // Update category counts
    await Promise.all(
      categories.map(async (category) => {
        const count = await Job.countDocuments({ category: category.name });
        await Category.findByIdAndUpdate(category._id, { count });
      })
    );
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        categories: categories.length,
        companies: companies.length,
        jobs: jobsCreated.length,
        adminEmail: 'admin@jobfinder.com',
        adminPassword: 'admin123'
      }
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Clear existing data
    await Job.deleteMany({});
    await Company.deleteMany({});
    await Category.deleteMany({});
    
    console.log('Deleted existing data');
    
    // Insert categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`Inserted ${categories.length} categories`);
    
    // Insert companies
    const companies = await Company.insertMany(sampleCompanies);
    console.log(`Inserted ${companies.length} companies`);
    
    // Create job listings
    const jobs = [];
    
    // Create jobs for each company
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      
      // Number of jobs for this company (1-3)
      const numJobs = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numJobs; j++) {
        // Pick a random job template
        const templateIndex = Math.floor(Math.random() * sampleJobTemplates.length);
        const template = sampleJobTemplates[templateIndex];
        
        // Find matching category
        const category = categories.find(c => c.name === template.category) || categories[0];
        
        // Create job with company details
        const job = {
          ...template,
          company: company.name,
          companyLogo: company.logo,
          location: company.location,
          category: category.name,
          postedDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date in the last 30 days
          applicants: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 500)
        };
        
        jobs.push(job);
        
        // Update category count
        await Category.findByIdAndUpdate(category._id, { $inc: { count: 1 } });
      }
      
      // Update company's job count
      await Company.findByIdAndUpdate(company._id, { 
        jobListings: numJobs
      });
    }
    
    // Insert all jobs
    const insertedJobs = await Job.insertMany(jobs);
    console.log(`Inserted ${insertedJobs.length} jobs`);
    
    return NextResponse.json({
      success: true,
      message: `Database seeded with ${categories.length} categories, ${companies.length} companies, and ${insertedJobs.length} jobs`
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({
      success: false,
      message: 'Error seeding database',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 