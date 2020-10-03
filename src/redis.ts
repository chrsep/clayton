import redis from "redis"

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : undefined,
  port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
})

export const createSession = async (
  session: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) => {
  await client.hset(
    session,
    "access_token",
    accessToken,
    "refresh_token",
    refreshToken
  )
  await client.expireat("access_token", expiresIn)
}
