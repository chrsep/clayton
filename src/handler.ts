import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
})

/**
 * Create publicly accessible handler with error tracking and logging..
 * */
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

/**
 * Create new handler that requires authentication checks.
 * */
export const newProtectedHandler = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    accessToken: string
  ) => void
): NextApiHandler =>
  newHandler(async (req, res) => {
    const sessionToken = req.cookies.token

    if (!sessionToken) {
      res.status(401).end()
      return
    }

    await handler(req, res, sessionToken)
  })

/**
 * Get query string data.
 * */
export const getQueryString = (req: NextApiRequest, key: string) => {
  const result = req.query[key]

  if (Array.isArray(result)) {
    return result[0]
  }
  return result
}
