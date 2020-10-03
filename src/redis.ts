// import redis from "redis"
//
// const client = redis.createClient({
//   host: process.env.REDIS_HOST,
//   password: process.env.REDIS_PASSWORD,
// })
//
// export const saveSession = async (sessionId: string, userId: string) => {
//   await client.hset(sessionId, userId)
// }
