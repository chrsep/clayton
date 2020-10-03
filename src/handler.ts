import { NextApiHandler } from "next"
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
