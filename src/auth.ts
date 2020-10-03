import { setCookie } from "nookies"
import { NextApiResponse } from "next"

export const setSessionCookie = (res: NextApiResponse, session: string) => {
  const options = {
    maxAge: 30 * 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
    httpOnly: true,
    path: "/",
    domain: process.env.SITE_URL,
  }
  setCookie({ res }, "token", session, options)
  setCookie({ res }, "loggedIn", "1", {
    ...options,
    httpOnly: false,
  })
}
