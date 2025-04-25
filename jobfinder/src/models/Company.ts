import mongoose, { Schema, Document } from 'mongoose';

// Define the Company document interface
export interface ICompany extends Document {
  name: string;
  slug: string;
  logo: string;
  industry: string;
  location: string;
  description: string;
  website?: string;
  employees?: string;
  founded?: number;
  benefits?: string[];
  active: boolean;
  jobCount: number;
  lastUpdated: Date;
}

// Define the Company schema
const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  logo: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  website: { type: String },
  employees: { type: String },
  founded: { type: Number },
  benefits: [{ type: String }],
  active: { type: Boolean, default: true },
  jobCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

// Create a text index for searching
CompanySchema.index({ name: 'text', description: 'text', industry: 'text' });

// Create or use existing model
export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema); 