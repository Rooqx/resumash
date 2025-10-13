import mongoose from "mongoose";
import { MONGO_URI } from "../configs/env.configs";

export const connectToMongo = async () => {
  if (!MONGO_URI || MONGO_URI == "") {
    throw new Error("Please provide MONGO_URI in the environment variables");
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
};
