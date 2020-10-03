// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateAuthorizationUrl } from "../../../spotify"
import { newHandler } from "../../../handler"

const login = newHandler((req, res) => {
  const scopes = ["user-read-private", " user-read-email"]
  res.redirect(generateAuthorizationUrl(scopes))
})

export default login
