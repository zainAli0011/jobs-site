import mongoose, { Schema, Document } from 'mongoose';

// Define the Category document interface
export interface ICategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  count: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Category schema
const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String },
  description: { type: String },
  count: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create or use existing model
export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema); 