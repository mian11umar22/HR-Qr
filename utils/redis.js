const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost", // ✅ uses local Redis if no env provided
    port: process.env.REDIS_PORT || 6379, // ✅ standard Redis port
  },
});
    
client.on("error", (err) => console.error("❌ Redis error:", err.message));

(async () => {
  try {
    await client.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.warn("⚠️ Redis connection failed:", err.message);
  }
})();

module.exports = client;
