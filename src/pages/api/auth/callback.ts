import { v4 as uuidv4 } from "uuid"
import { newHandler } from "../../../handler"
import { requestTokens } from "../../../spotify"
import { createSession } from "../../../redis"
import { setSessionCookie } from "../../../auth"

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

    setSessionCookie(res, session)
    res.redirect("/").end()
  } catch (e) {
    res.status(401).end()
  }
})

export default callback
