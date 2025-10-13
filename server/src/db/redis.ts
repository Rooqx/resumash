import { REDIS_URI } from "../configs/env.configs";
import { createClient } from "redis";

if (!REDIS_URI || REDIS_URI === "") {
  throw new Error("Please provide REDIS_URI in the environment variables");
}
const redisClient = createClient({
  url: REDIS_URI,
});
export const connectToRedis = async () => {
  try {
    await redisClient.connect();
    const pong = await redisClient.ping();
    if (pong === "Pong") {
      console.log("Redis Connection Successful");
    }
  } catch (error) {
    console.log("Redis connection error", error);
  } finally {
    redisClient.quit();
  }
};
