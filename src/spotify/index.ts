import { Tracks } from "./model"

const SPOTIFY_ACCOUNTS_URI = "https://accounts.spotify.com"
const SCOPES = ["user-read-private", " user-read-email"]
const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_AUTH_REDIRECT_URI,
} = process.env

// validate env
if (!SPOTIFY_AUTH_REDIRECT_URI) {
  throw new Error(
    "Invalid SPOTIFY_AUTH_REDIRECT_URI, please check your env variables"
  )
} else if (!SPOTIFY_CLIENT_ID) {
  throw new Error("Invalid SPOTIFY_CLIENT_ID, please check your env variables")
} else if (!SPOTIFY_CLIENT_SECRET) {
  throw new Error(
    "Invalid SPOTIFY_CLIENT_SECRET, please check your env variables"
  )
}

const AUTHORIZATION_HEADER = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString("base64")

export const generateAuthorizationUrl = () => {
  const encodedScopes = encodeURIComponent(SCOPES.join(" "))
  const encodedRedirectUri = encodeURIComponent(SPOTIFY_AUTH_REDIRECT_URI)

  return `${SPOTIFY_ACCOUNTS_URI}/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${encodedScopes}&redirect_uri=${encodedRedirectUri}`
}

interface GetTokenResponse {
  access_token: string
  token_type: "Bearer"
  scope: string
  expires_in: number
  refresh_token: string
}
export const requestTokens = async (
  code: string
): Promise<GetTokenResponse> => {
  const uri = `${SPOTIFY_ACCOUNTS_URI}/api/token`

  const form = new URLSearchParams()
  form.append("code", code)
  form.append("grant_type", "authorization_code")
  form.append("redirect_uri", SPOTIFY_AUTH_REDIRECT_URI ?? "")

  const headers = new Headers()
  headers.append("Authorization", `Basic ${AUTHORIZATION_HEADER}`)

  const response = await fetch(uri, {
    method: "POST",
    body: form,
    headers,
  })

  return response.json()
}

export interface SpotifyApiSearchTrackResponse {
  tracks: Tracks
}
export const searchTracks = async (
  accessToken: string,
  query: string
): Promise<SpotifyApiSearchTrackResponse> => {
  const uri = `https://api.spotify.com/v1/search?type=track&q=${query}`

  const headers = new Headers()
  headers.append("Authorization", `Bearer ${accessToken}`)

  const response = await fetch(uri, {
    headers,
  })

  return response.json()
}
