import Redis from "ioredis"

let reuseCount = 0
let creationCount = 0
let c: Redis.Redis

const getClient = () => {
  console.log("==========get redis client============")
  console.log(`has been reused ${reuseCount} times`)
  console.log(`has been created ${creationCount} times`)
  console.log("======================================")

  if (c) {
    reuseCount += 1
    console.log("redis: reusing redis client")
    return c
  }

  creationCount += 1
  console.log("redis: new redis instance created")
  c = new Redis({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
      ? process.env.REDIS_PASSWORD
      : undefined,
    port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
    reconnectOnError(error: Error) {
      console.log(error)
      return true
    },
  })

  c.on("connect", () => {
    console.log("redis: redis connection established")
  })

  c.on("ready", () => {
    console.log("redis: is ready")
  })

  c.on("error", () => {
    console.log("redis: error")
  })

  c.on("close", () => {
    console.log("redis: connection closed")
  })

  c.on("reconnecting", () => {
    console.log("redis: reconnecting")
  })

  c.on("end", () => {
    console.log("redis: connection ended")
  })

  return c
}

// =================================================================================
// User's access token, can be used to get user and personalized data
// =================================================================================
export const saveUserTokens = async (
  session: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) => {
  const expireAt = (Date.now() + expiresIn).toString()
  await getClient()
    .multi()
    .hset(session, "access_token", accessToken)
    .hset(session, "refresh_token", refreshToken)
    .hset(session, "expires_at", expireAt)
    .exec()
}

// refresh tokens are valid forever, no need to overwrite it
export const updateUserTokens = async (
  session: string,
  accessToken: string,
  expiresIn: number
) => {
  const expiresAt = (Date.now() + expiresIn).toString()
  await getClient()
    .multi()
    .hset(session, "access_token", accessToken)
    .hset(session, "expires_at", expiresAt)
    .exec()

  return { accessToken, expiresAt }
}

export const getUserTokens = async (session: string) => {
  const result = await getClient().hgetall(session)
  if (result)
    return {
      accessToken: result.access_token,
      expiresAt: result.expires_at,
      refreshToken: result.refresh_token,
    }

  return undefined
}

// ===================================================================
// App's access token, doesn't have access to user data
// ====================================================================
export const upsertAppToken = async (
  accessToken: string,
  expiresIn: number
) => {
  const expiresAt = (Date.now() + expiresIn).toString()
  await getClient()
    .multi()
    .hset("client_credentials", "access_token", accessToken)
    .hset("client_credentials", "expires_at", expiresAt)
    .exec()

  return { accessToken, expiresAt }
}

export const getAppTokens = async () => {
  const result = await getClient().hgetall("client_credentials")
  if (result)
    return { accessToken: result.access_token, expiresAt: result.expires_at }

  return undefined
}
