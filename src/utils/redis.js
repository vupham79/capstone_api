import redis from "redis";

const client = redis.createClient(6379);

client.on("error", function(error) {
  console.error(error);
});

export { client };
