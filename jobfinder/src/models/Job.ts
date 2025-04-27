import mongoose, { Schema, Document } from 'mongoose';
import { nanoid } from 'nanoid';

// Define the Job document interface
export interface IJob extends Document {
  id?: string; // Optional ID field for backward compatibility
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
  id: { type: String, unique: true }, // This is causing the duplicate key error
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

// Pre-save hook to ensure ID is set
JobSchema.pre('save', function(next) {
  // If id is not set, generate a unique one
  if (!this.id) {
    this.id = nanoid(10);
  }
  next();
});

// Create or use existing model
export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema); 