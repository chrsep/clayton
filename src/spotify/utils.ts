import {
  getAppTokens,
  getUserTokens,
  updateUserTokens,
  upsertAppToken,
} from "../redis"
import { requestAppAccessToken, requestRefreshUserAccessToken } from "./auth"

const BASE_URL = `https://api.spotify.com/v1`

export const callUserAuthorizedSpotifyApi = async <T>(
  session: string,
  url: string
): Promise<T> => {
  const uri = `${BASE_URL}${url}`

  const token = await getUserTokens(session)

  if (!token) {
    throw new Error("unauthorized")
  }

  if (parseInt(token.expiresAt, 10) - Date.now() < 50) {
    const newToken = await requestRefreshUserAccessToken(token.refreshToken)
    const updatedToken = await updateUserTokens(
      session,
      newToken.access_token,
      newToken.expires_in
    )
    token.accessToken = updatedToken.accessToken
    token.expiresAt = updatedToken.expiresAt
  }

  return callSpotifyApi(token.accessToken, uri)
}

export const callAppAuthorizedSpotifyApi = async <T>(
  url: string
): Promise<T> => {
  const uri = `${BASE_URL}${url}`

  const token = await getAppTokens()

  if (parseInt(token.expiresAt, 10) - Date.now() < 50) {
    const newToken = await requestAppAccessToken()
    const updatedToken = await upsertAppToken(
      newToken.access_token,
      newToken.expires_in
    )
    token.accessToken = updatedToken.accessToken
  }

  return callSpotifyApi(token.accessToken, uri)
}

// Helper function
const callSpotifyApi = async (accessToken: string, uri: string) => {
  const headers = new Headers()
  headers.append("Authorization", `Bearer ${accessToken}`)

  const response = await fetch(uri, { headers })

  if (!response.ok) {
    const { error } = await response.json()
    if (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }
  return response.json()
}
