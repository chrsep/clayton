import { setCookie } from "nookies"
import { v4 as uuidv4 } from "uuid"
import { newHandler } from "../../../handler"
import { requestTokens } from "../../../spotify"
import { createSession } from "../../../redis"

const callback = newHandler(async (req, res) => {
  const {
    query: { code, state },
  } = req

  if (!code || !state) {
    res.status(401).end()
    return
  }

  if (Array.isArray(code) || Array.isArray(state)) {
    res.status(400).end()
    return
  }

  try {
    const tokens = await requestTokens(code)

    const session = uuidv4()
    await createSession(
      session,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expires_in
    )

    setCookie({ res }, "token", session, {
      maxAge: 30 * 24 * 60 * 60,
      sameSite: true,
      httpOnly: true,
    })
    res.redirect("/").end()
  } catch (e) {
    res.status(401).end()
  }
})

export default callback
