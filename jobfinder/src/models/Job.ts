import mongoose, { Schema, Document } from 'mongoose';

// Define the Job document interface
export interface IJob extends Document {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string;
  isRemote?: boolean;
  category: string;
  experienceLevel?: string;
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: string;
  };
  description: string;
  requirements: string;
  benefits?: string;
  applicationInstructions: string;
  contactEmail: string;
  active: boolean;
  featured: boolean;
  postedDate: Date;
  updatedAt: Date;
  applicants: number;
  views: number;
}

// Define the Job schema
const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String },
  location: { type: String, required: true },
  type: { type: String, required: true },
  isRemote: { type: Boolean, default: false },
  category: { type: String, required: true },
  experienceLevel: { type: String },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, required: true },
    period: { type: String, required: true }
  },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  benefits: { type: String },
  applicationInstructions: { type: String, required: true },
  contactEmail: { type: String, required: true },
  active: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  postedDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  applicants: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
});

// Create or use existing model
export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema); 