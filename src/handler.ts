import { NextApiHandler } from "next"
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
})

export const newHandler = (handler: NextApiHandler): NextApiHandler => (
  res,
  req
) => {
  try {
    handler(res, req)
  } catch (e) {
    console.error(e)
    Sentry.captureException(e)
  }
}
