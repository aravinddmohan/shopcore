import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

await redisClient.connect();

export default redisClient;
