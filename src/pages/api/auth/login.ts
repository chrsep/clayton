// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateAuthorizationUrl } from "../../../spotify"
import { newHandler } from "../../../handler"

const login = newHandler((req, res) => {
  res.redirect(generateAuthorizationUrl())
})

export default login
