import mongoose from "mongoose";

// MongoDB configuration
const mongoUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/newDatabase";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Mongoose: MongoDB connected...");
  } catch (err) {
    console.log("Mongoose Error: " + err);
  }
};

