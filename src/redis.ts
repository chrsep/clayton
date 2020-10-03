import redis from "redis"
import { promisify } from "util"

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : undefined,
  port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
})

const hgetall = promisify(client.hgetall).bind(client)
const hsetAsync = promisify(client.hset).bind(client)
const expireatAsync = promisify(client.expireat).bind(client)

export const createSession = async (
  session: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) => {
  await hsetAsync([
    session,
    "access_token",
    accessToken,
    "refresh_token",
    refreshToken,
  ])
  await expireatAsync(session, Date.now() + expiresIn)
}

export const getSpotifyAccessToken = async (session: string) => {
  const result = await hgetall(session)
  return result.access_token
}

export const getSpotifyRefreshToken = async (session: string) => {
  const result = await hgetall(session)
  return result.refresh_token
}
