"use server";

import { connectToDatabase } from "./db";
import Job from "@/models/Job";
import { revalidatePath } from "next/cache";

export async function getJobs({
  keywords,
  category,
  location,
  page = 1,
  limit = 10,
  sort = "newest",
}: {
  keywords?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  try {
    await connectToDatabase();
    
    // Build query
    const query: any = { active: true };
    
    // Add search filters if provided
    if (keywords) {
      query.$or = [
        { title: { $regex: keywords, $options: "i" } },
        { description: { $regex: keywords, $options: "i" } },
        { company: { $regex: keywords, $options: "i" } },
      ];
    }
    
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }
    
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case "newest":
        sortOptions = { postedDate: -1 };
        break;
      case "oldest":
        sortOptions = { postedDate: 1 };
        break;
      case "salary_high":
        sortOptions = { 
          "salary.max": -1, 
          "salary.min": -1 
        };
        break;
      case "salary_low":
        sortOptions = { 
          "salary.min": 1,
          "salary.max": 1 
        };
        break;
      default:
        sortOptions = { featured: -1, postedDate: -1 };
    }
    
    // Count total jobs matching the query
    const totalJobs = await Job.countDocuments(query);
    
    // Get jobs with pagination and sorting
    const jobs = await Job.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const totalPages = Math.ceil(totalJobs / limit);
    
    return {
      jobs,
      totalJobs,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return {
      jobs: [],
      totalJobs: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

export async function toggleJobStatus(jobId: string) {
  try {
    await connectToDatabase();
    
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }
    
    job.active = !job.active;
    await job.save();
    
    revalidatePath('/admin/jobs');
    revalidatePath('/jobs');
    
    return { success: true, active: job.active };
  } catch (error) {
    console.error("Error toggling job status:", error);
    return { success: false, error: "Failed to update job" };
  }
}

export async function toggleJobFeaturedStatus(jobId: string) {
  try {
    await connectToDatabase();
    
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }
    
    job.featured = !job.featured;
    await job.save();
    
    revalidatePath('/admin/jobs');
    revalidatePath('/jobs');
    revalidatePath('/');
    
    return { success: true, featured: job.featured };
  } catch (error) {
    console.error("Error toggling job featured status:", error);
    return { success: false, error: "Failed to update job" };
  }
}

export async function deleteJob(jobId: string) {
  try {
    await connectToDatabase();
    
    await Job.findByIdAndDelete(jobId);
    
    revalidatePath('/admin/jobs');
    revalidatePath('/jobs');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting job:", error);
    return { success: false, error: "Failed to delete job" };
  }
} 