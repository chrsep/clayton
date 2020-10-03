// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiHandler } from "next"
import { generateAuthorizationUrl } from "../../../spotify"

const login: NextApiHandler = (req, res) => {
  const scopes = "user-read-private user-read-email"
  res.redirect(generateAuthorizationUrl(scopes))
}

export default login
