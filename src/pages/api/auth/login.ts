// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { newHandler } from "../../../handler"
import { getUserAuthorizeRequestUri } from "../../../spotify/auth"

const login = newHandler((req, res) => {
  res.redirect(getUserAuthorizeRequestUri())
})

export default login
