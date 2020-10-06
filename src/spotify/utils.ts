import { getUserTokens, updateUserTokens } from "../redis"
import { requestAppAccessToken, requestRefreshUserAccessToken } from "./auth"

const BASE_URL = `https://api.spotify.com/v1`

/**
 * Helper functions to call spotify apis that require
 * user authorization such as user profile and personalization.
 * */
export const callUserAuthorizedSpotifyApi = async <T>(
  session: string,
  url: string,
  options: RequestInit = {}
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

  return callSpotifyApi(token.accessToken, uri, options)
}

/**
 * Helper functions to call spotify apis that doesn't require
 * user authorization such as get tracks data.
 * */
export const callAppAuthorizedSpotifyApi = async <T>(
  url: string
): Promise<T> => {
  const uri = `${BASE_URL}${url}`

  const token = await requestAppAccessToken()

  return callSpotifyApi(token.accessToken, uri)
}

/**
 * Generic function that calls all spotify APIs with error checking and logging.
 * */
const callSpotifyApi = async (
  accessToken: string,
  uri: string,
  options: RequestInit = {}
) => {
  const headers = new Headers()
  headers.append("Authorization", `Bearer ${accessToken}`)

  const response = await fetch(uri, { headers, ...options })

  if (response.status === 204) {
    return undefined
  }

  if (!response.ok) {
    const { error } = await response.json()
    if (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  return response.json()
}
