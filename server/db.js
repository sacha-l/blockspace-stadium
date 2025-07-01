import mongoose from 'mongoose';

export async function connectToMongo() {
  // TODO: Set up environment variables for MongoDB connection string @deji
  try {
    await mongoose.connect('mongodb://localhost:27017/hackathon', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ Mongoose connection failed:', error);
  }
}

export default connectToMongo;