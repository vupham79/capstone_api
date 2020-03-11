import redis from "redis";
import { promisify } from "util";

const client = redis.createClient({ port: 6379 });

client.on("error", function(error) {
  console.error(error);
});

export { client };
