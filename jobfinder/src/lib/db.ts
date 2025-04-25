import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://admin:admin@ac-r6uq0fn-shard-00-00.meok3te.mongodb.net:27017,ac-r6uq0fn-shard-00-01.meok3te.mongodb.net:27017,ac-r6uq0fn-shard-00-02.meok3te.mongodb.net:27017/jobsite?replicaSet=atlas-ajphwx-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=main';

// Global variable to cache the MongoDB connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    });
  }
 
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}