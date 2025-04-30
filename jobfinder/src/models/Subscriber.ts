import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  phone?: string;
  subscribeDate: Date;
  active: boolean;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String, 
    trim: true
  },
  subscribeDate: { 
    type: Date, 
    default: Date.now 
  },
  active: { 
    type: Boolean, 
    default: true 
  }
});

// Create or use existing model
export default mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema); 