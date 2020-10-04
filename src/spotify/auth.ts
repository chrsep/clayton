// Spotify authorization helpers
const ACCOUNTS_URI = "https://accounts.spotify.com"

const SCOPES = ["user-read-private", " user-read-email"]

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_AUTH_REDIRECT_URI,
} = process.env

if (!SPOTIFY_AUTH_REDIRECT_URI) {
  throw new Error("SPOTIFY_AUTH_REDIRECT_URI is empty, check your env")
} else if (!SPOTIFY_CLIENT_ID) {
  throw new Error("Invalid SPOTIFY_CLIENT_ID is empty, check your env")
} else if (!SPOTIFY_CLIENT_SECRET) {
  throw new Error("Invalid SPOTIFY_CLIENT_SECRET is empty, check your env ")
}

const generateAuthorizationHeader = () => {
  const value = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64")

  const headers = new Headers()
  headers.append("Authorization", `Basic ${value}`)

  return headers
}

const callSpotifyTokenApi = async <T>(body: URLSearchParams): Promise<T> => {
  const uri = `${ACCOUNTS_URI}/api/token`
  const headers = generateAuthorizationHeader()

  const response = await fetch(uri, { method: "POST", body, headers })

  if (!response.ok) {
    const { error } = await response.json()
    if (error) {
      console.log(error)
    }
    throw new Error(error.message)
  }

  return response.json()
}

export const getUserAuthUri = () => {
  const encodedScopes = encodeURIComponent(SCOPES.join(" "))
  const encodedRedirectUri = encodeURIComponent(SPOTIFY_AUTH_REDIRECT_URI)
  return `${ACCOUNTS_URI}/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${encodedScopes}&redirect_uri=${encodedRedirectUri}`
}

interface SpotifyAuthGetAccessTokenResponse {
  access_token: string
  token_type: "Bearer"
  scope: string
  expires_in: number
  refresh_token: string
}
export const requestAccessToken = async (code: string) => {
  const form = new URLSearchParams()
  form.append("code", code)
  form.append("grant_type", "authorization_code")
  form.append("redirect_uri", SPOTIFY_AUTH_REDIRECT_URI)

  return callSpotifyTokenApi<SpotifyAuthGetAccessTokenResponse>(form)
}

interface SpotifyAuthRefreshTokenResponse {
  access_token: string
  token_type: "Bearer"
  scope: string
  expires_in: number
}
export const requestTokenRefresh = async (refreshToken: string) => {
  const form = new URLSearchParams()
  form.append("refresh_token", refreshToken)
  form.append("grant_type", "refresh_token")

  return callSpotifyTokenApi<SpotifyAuthRefreshTokenResponse>(form)
}

interface SpotifyAuthClientCredentialsResponse {
  access_token: string
  token_type: string
  expires_int: number
}
export const requestClientCredentials = async () => {
  const form = new URLSearchParams()
  form.append("grant_type", "client_credentials")

  return callSpotifyTokenApi<SpotifyAuthClientCredentialsResponse>(form)
}
