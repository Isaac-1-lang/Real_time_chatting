import express from 'express';
import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo Connected: ${connection.connection.host}`);
  } catch (error) {
     console.error("Failed to connect to the database");
  }
}
export default connectDB;