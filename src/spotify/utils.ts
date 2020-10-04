import {
  getAppTokens,
  getUserTokens,
  updateUserTokens,
  upsertAppToken,
} from "../redis"
import { requestAppAccessToken, requestRefreshUserAccessToken } from "./auth"

const BASE_URL = `https://api.spotify.com/v1`

/**
 * Helper functions to call spotify apis that require
 * user authorization such as user profile and personalization.
 * */
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

/**
 * Helper functions to call spotify apis that doesn't require
 * user authorization such as get tracks data.
 * */
export const callAppAuthorizedSpotifyApi = async <T>(
  url: string
): Promise<T> => {
  const uri = `${BASE_URL}${url}`

  let token = await getAppTokens()

  if (!token || parseInt(token.expiresAt, 10) - Date.now() < 50) {
    const newToken = await requestAppAccessToken()
    token = await upsertAppToken(newToken.access_token, newToken.expires_in)
  }

  return callSpotifyApi(token.accessToken, uri)
}

/**
 * Generic function that calls all spotify APIs with error checking and logging.
 * */
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
