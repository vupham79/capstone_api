import redis from "redis";

const client = redis.createClient(process.env.REDIS_URL);

client.on("error", function(error) {
  console.error(error);
});

async function checkTokenExist(token) {
  return new Promise((resolve, reject) => {
    client.get(token, (err, reply) => {
      if (reply) {
        resolve(true);
      } else resolve(false);
    });
  });
}

export { client, checkTokenExist };
