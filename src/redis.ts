import redis from "redis"
import { promisify } from "util"

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : undefined,
  port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
})

const hgetall = promisify(client.hgetall).bind(client)
const hsetAsync = promisify(client.hset).bind(client)

// =================================================================================
// User's access token, can be used to get user and personalized data
// =================================================================================
export const saveSessionToken = async (
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
    "expires_at",
    (Date.now() + expiresIn).toString(),
  ])
}

// refresh tokens are valid forever, no need to overwrite it
export const updateSessionToken = async (
  session: string,
  accessToken: string,
  expiresIn: number
) => {
  const expiresAt = (Date.now() + expiresIn).toString()
  await hsetAsync([
    session,
    "access_token",
    accessToken,
    "expires_at",
    expiresAt,
  ])
  return { accessToken, expiresAt }
}

export const getSessionToken = async (session: string) => {
  const result = await hgetall(session)
  return {
    accessToken: result.access_token,
    expiresAt: result.expires_at,
    refreshToken: result.refresh_token,
  }
}

// ===================================================================
// App's access token, doesn't have access to user data
// ====================================================================
export const upsertAppToken = async (
  accessToken: string,
  expiresIn: number
) => {
  await hsetAsync([
    "client_credentials",
    "access_token",
    accessToken,
    "expires_at",
    (Date.now() + expiresIn).toString(),
  ])
}

export const getClientCredentials = async () => {}
