import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URL || "";
    
    if (!mongoURL) {
      throw new Error('MONGODB_URL is not defined');
    }

    await mongoose.connect(mongoURL);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error; // Don't exit, throw error instead for serverless
  }
};

export default connectDB;
