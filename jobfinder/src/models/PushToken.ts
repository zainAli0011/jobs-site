import mongoose, { Schema, Document } from 'mongoose';

export interface IPushToken extends Document {
  token: string;
  userId?: string;
  device?: string;
  createdAt: Date;
  lastUsed?: Date;
  active: boolean;
}

const PushTokenSchema = new Schema<IPushToken>({
  token: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  userId: { 
    type: String,
    sparse: true
  },
  device: {
    type: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastUsed: {
    type: Date
  },
  active: { 
    type: Boolean, 
    default: true 
  }
});

export default mongoose.models.PushToken || mongoose.model<IPushToken>('PushToken', PushTokenSchema); 