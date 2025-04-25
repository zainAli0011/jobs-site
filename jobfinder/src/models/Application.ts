import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
  coverLetter?: string;
  heardAbout?: string;
  willingToRelocate: boolean;
  startDate?: string;
  experience: string;
  resumeFilename?: string;
  coverLetterFilename?: string;
  applicationDate: Date;
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  coverLetter: { type: String },
  heardAbout: { type: String },
  willingToRelocate: { type: Boolean, default: false },
  startDate: { type: String },
  experience: { type: String, required: true },
  resumeFilename: { type: String },
  coverLetterFilename: { type: String },
  applicationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'reviewed', 'interviewed', 'rejected', 'hired'], default: 'pending' }
});

// Create or use existing model
export default mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema); 