import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import * as Sentry from "@sentry/node"
import { getSpotifyAccessToken, updateSession } from "./redis"
import { requestTokenRefresh } from "./spotify/auth"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
})

export const newHandler = (handler: NextApiHandler): NextApiHandler => async (
  req,
  res
) => {
  try {
    await handler(req, res)
  } catch (e) {
    res.status(500).end()
    console.error(e)
    Sentry.captureException(e)
  }
}

export const newProtectedSpotifyHandler = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    accessToken: string
  ) => void
): NextApiHandler => async (req, res) => {
  try {
    const sessionToken = req.cookies.token
    const accessToken = await getSpotifyAccessToken(sessionToken)

    if (!accessToken) {
      res.status(401).end()
      return
    }

    if (parseInt(accessToken.expiresAt, 10) - Date.now() < 50) {
      const newToken = await requestTokenRefresh(accessToken.refreshToken)
      const updatedToken = await updateSession(
        sessionToken,
        newToken.access_token,
        newToken.expires_in
      )
      accessToken.accessToken = updatedToken.accessToken
      accessToken.expiresAt = updatedToken.expiresAt
    }

    await handler(req, res, accessToken.accessToken)
  } catch (e) {
    res.status(500).end()
    Sentry.captureException(e)
    console.error(e)
  }
}

export const getQueryString = (req: NextApiRequest, key: string) => {
  const result = req.query[key]

  if (Array.isArray(result)) {
    return result[0]
  }
  return result
}
