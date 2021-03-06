// Spotify authorization code
// More info https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow
const ACCOUNTS_URI = "https://accounts.spotify.com"

const SCOPES = ["streaming", "user-read-private", " user-read-email"]

// Get and validate env
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

// =================================================================================
//  Authorization Code flow
//  token can be used to get user and personalized data
// =================================================================================
export const getUserAuthorizeRequestUri = () => {
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
export const requestUserAccessToken = async (code: string) => {
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
export const requestRefreshUserAccessToken = async (refreshToken: string) => {
  const form = new URLSearchParams()
  form.append("refresh_token", refreshToken)
  form.append("grant_type", "refresh_token")

  return callSpotifyTokenApi<SpotifyAuthRefreshTokenResponse>(form)
}

// =================================================================
// Client Credentials Flow
// token doesn't have access to user data
// ==================================================================
let token: {
  accessToken: string
  expiresAt: number
}
export const requestAppAccessToken = async () => {
  // Request new token if instance doesn't have one
  if (!token || token.expiresAt - Date.now() < 50) {
    const form = new URLSearchParams()
    form.append("grant_type", "client_credentials")
    const newToken = await callSpotifyTokenApi<{
      access_token: string
      token_type: "Bearer"
      expires_in: number
    }>(form)
    token = {
      accessToken: newToken.access_token,
      expiresAt: Date.now() + newToken.expires_in,
    }
  }

  return token
}

// Helper functions
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
