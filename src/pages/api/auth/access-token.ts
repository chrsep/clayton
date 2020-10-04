import { newProtectedHandler } from "../../../handler"
import { getUserTokens } from "../../../redis"

export interface GetAccessTokenResponse {
  accessToken: string
}
const accessToken = newProtectedHandler(async (req, res, session) => {
  const token = await getUserTokens(session)
  if (token?.accessToken) {
    const responseBody: GetAccessTokenResponse = {
      accessToken: token.accessToken,
    }
    res.json(responseBody)
  } else {
    res.status(401).end()
  }
})

export default accessToken
