import redis from "redis";

const client = redis.createClient(process.env.REDIS_URL);

client.on("error", function(error) {
  console.error(error);
});

export { client };
