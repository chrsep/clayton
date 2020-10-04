// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { newHandler } from "../../../handler"
import { getUserAuthUri } from "../../../spotify/auth"

const login = newHandler((req, res) => {
  res.redirect(getUserAuthUri())
})

export default login
