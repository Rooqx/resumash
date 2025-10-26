import mongoose from "mongoose";
import { MONGO_URI } from "../configs/env.configs";
import { logger } from "../utils/logger";

export const connectToMongo = async () => {
  if (!MONGO_URI || MONGO_URI == "") {
    throw new Error("Please provide MONGO_URI in the environment variables");
  }
  try {
    await mongoose.connect(MONGO_URI);

    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error", error);
    process.exit(0);
  }
};
