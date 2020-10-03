import { NextApiHandler, NextApiRequest } from "next"
import * as Sentry from "@sentry/node"

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

export const getQueryString = (req: NextApiRequest, key: string) => {
  const result = req.query[key]

  if (Array.isArray(result)) {
    return result[0]
  }
  return result
}
