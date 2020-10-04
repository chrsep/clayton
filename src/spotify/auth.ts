// Spotify authorization helpers
const ACCOUNTS_URI = "https://accounts.spotify.com"

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

const getAuthorizationHeader = () => {
  return Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
    "base64"
  )
}

export const getUserAuthUri = () => {
  const encodedScopes = encodeURIComponent(SCOPES.join(" "))
  const encodedRedirectUri = encodeURIComponent(SPOTIFY_AUTH_REDIRECT_URI)
  return `${ACCOUNTS_URI}/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${encodedScopes}&redirect_uri=${encodedRedirectUri}`
}

interface SpotifyAuthGetAcccessTokenResponse {
  access_token: string
  token_type: "Bearer"
  scope: string
  expires_in: number
  refresh_token: string
}
export const requestAccessToken = async (code: string) => {
  const uri = `${ACCOUNTS_URI}/api/token`

  const form = new URLSearchParams()
  form.append("code", code)
  form.append("grant_type", "authorization_code")
  form.append("redirect_uri", SPOTIFY_AUTH_REDIRECT_URI)

  const headers = new Headers()
  headers.append("Authorization", `Basic ${getAuthorizationHeader()}`)

  const response = await fetch(uri, {
    method: "POST",
    body: form,
    headers,
  })

  const body: SpotifyAuthGetAcccessTokenResponse = await response.json()
  return body
}
