interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: "Full Time" | "Part Time" | "Contract" | "Freelance";
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: string;
  } | string; // Allow both object and string format for backward compatibility
  workplace: "Remote" | "On-site" | "Hybrid";
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
}

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  description: string;
  jobOpenings: number;
  rating: number;
  employees: string;
  website: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export type { Job, Company, Category }; 