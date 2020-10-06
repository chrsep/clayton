import Redis from "ioredis"

let c: Redis.Redis
const MAX_CONNECTIONS = 30
const CONNECTION_THRESHOLD = 80 // %

const getRedis = () => {
  if (!c) {
    c = new Redis({
      host: process.env.REDIS_HOST,
      lazyConnect: true,
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
  }

  return c
}

const getClients = async () => {
  const result: string = await c.client("list")

  return result
    .split("\n") // split by line
    .filter((text) => text) // removes empty value
    .map((client) => {
      // turn array of "key=value" string into "{key: value}" object
      const attributes = client.split(" ")
      const clientObject: any = {}
      attributes.forEach((attribute) => {
        const [key, value] = attribute.split("=")
        clientObject[key] = value
      })
      return clientObject
    })
    .sort((a, b) => b.idle - a.idle)
}

const cleanup = async () => {
  const clients = await getClients()

  const maxClientCount = (MAX_CONNECTIONS * CONNECTION_THRESHOLD) / 100
  console.log(`Max client: ${maxClientCount}`)
  console.log(`Client connected: ${clients.length}`)
  if (clients.length > maxClientCount) {
    const clientsToKill = clients.length - maxClientCount

    const killCommands: Promise<void>[] = []
    for (let i = 0; i < clientsToKill; i += 1) {
      killCommands.push(c.client("kill", ["id", clients[i].id]))
    }

    const result = await Promise.all(killCommands)
    console.log(`==========The Killing of The Clients=========`)
    console.log(`killed ${result.length} clients`)
    console.log(`killed ${result} clients`)
    console.log(`=============================================`)
  }
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
  await getRedis()
    .multi()
    .hset(session, "access_token", accessToken)
    .hset(session, "refresh_token", refreshToken)
    .hset(session, "expires_at", expireAt)
    .exec()

  await cleanup()
}

// refresh tokens are valid forever, no need to overwrite it
export const updateUserTokens = async (
  session: string,
  accessToken: string,
  expiresIn: number
) => {
  const expiresAt = (Date.now() + expiresIn).toString()
  await getRedis()
    .multi()
    .hset(session, "access_token", accessToken)
    .hset(session, "expires_at", expiresAt)
    .exec()

  await cleanup()
  return { accessToken, expiresAt }
}

export const getUserTokens = async (session: string) => {
  const result = await getRedis().hgetall(session)
  if (result) {
    await cleanup()
    return {
      accessToken: result.access_token,
      expiresAt: result.expires_at,
      refreshToken: result.refresh_token,
    }
  }

  await cleanup()
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
  await getRedis()
    .multi()
    .hset("client_credentials", "access_token", accessToken)
    .hset("client_credentials", "expires_at", expiresAt)
    .exec()

  await cleanup()

  return { accessToken, expiresAt }
}

export const getAppTokens = async () => {
  const result = await getRedis().hgetall("client_credentials")
  if (result) {
    await cleanup()
    return { accessToken: result.access_token, expiresAt: result.expires_at }
  }

  await cleanup()
  return undefined
}
