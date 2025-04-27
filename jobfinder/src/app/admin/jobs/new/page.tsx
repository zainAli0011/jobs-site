"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  logo: string;
}

interface JobFormData {
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  type: string;
  category: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  salaryPeriod: string;
  description: string;
  requirements: string;
  benefits: string;
  applicationInstructions: string;
  contactEmail: string;
  status: string;
}

export default function NewJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    isRemote: false,
    type: "full-time",
    category: "software-development",
    experienceLevel: "mid-level",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    salaryPeriod: "yearly",
    description: "",
    requirements: "",
    benefits: "",
    applicationInstructions: "",
    contactEmail: "",
    status: "draft"
  });

  useEffect(() => {
    // Check if user is authenticated as admin
    // This would be replaced with your auth check
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (name === "salaryMin" || name === "salaryMax") {
      // Only allow numbers for salary fields
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Ensure salary field has values
      if (!formData.salaryMin && !formData.salaryMax) {
        throw new Error("Please provide at least one salary value (minimum or maximum)");
      }

      // Format the job data
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        isRemote: formData.isRemote,
        type: formData.type,
        category: formData.category,
        experienceLevel: formData.experienceLevel,
        // Convert salary values to numbers if present
        salary: {
          min: formData.salaryMin ? parseInt(formData.salaryMin) : null,
          max: formData.salaryMax ? parseInt(formData.salaryMax) : null,
          currency: formData.salaryCurrency,
          period: formData.salaryPeriod
        },
        description: formData.description,
        requirements: formData.requirements,
        benefits: formData.benefits,
        applicationInstructions: formData.applicationInstructions,
        contactEmail: formData.contactEmail,
        status: formData.status,
        // Add timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Remove the individual salary fields to prevent duplication
      const { salaryMin, salaryMax, salaryCurrency, salaryPeriod, ...jobDataWithoutSalaryFields } = jobData;

      // Validate required fields as per API expectations
      const requiredFields = ['title', 'company', 'location', 'type', 'salary', 'description'];
      const missingFields = requiredFields.filter(field => !jobDataWithoutSalaryFields[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log('Sending job data to server:', jobDataWithoutSalaryFields);

      // In a real app, this would be an API call
      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobDataWithoutSalaryFields),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create job");
      }

      // Redirect to the jobs list
      router.push("/admin/jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Create New Job Listing</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/admin" className="text-blue-600 hover:underline">
            Dashboard
          </Link>
          <Link href="/admin/jobs" className="text-blue-600 hover:underline">
            Jobs
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company*</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location*</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Type*</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category*</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="software-development">Software Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="customer-service">Customer Service</option>
                <option value="finance">Finance</option>
                <option value="human-resources">Human Resources</option>
                <option value="operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience Level*</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="entry-level">Entry Level</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="executive">Executive</option>
              </select>
            </div>
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleChange}
                className="h-4 w-4 mr-2"
              />
              <label className="text-sm font-medium">Remote Position</label>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Salary Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Salary</label>
              <input
                type="text"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., 50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Maximum Salary</label>
              <input
                type="text"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., 70000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                name="salaryCurrency"
                value={formData.salaryCurrency}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Period</label>
              <select
                name="salaryPeriod"
                value={formData.salaryPeriod}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="hourly">Hourly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Job Details</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Job Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md h-32"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Requirements*</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md h-32"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Benefits</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md h-32"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Application Instructions</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Instructions*</label>
              <textarea
                name="applicationInstructions"
                value={formData.applicationInstructions}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md h-24"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email*</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Publish Settings</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Link 
            href="/admin/jobs" 
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Creating..." : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
} 