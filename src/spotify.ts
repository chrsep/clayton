const { SPOTIFY_CLIENT_ID, SPOTIFY_AUTH_REDIRECT_URI } = process.env

export const generateAuthorizationUrl = (scopes: string) => {
  if (!SPOTIFY_AUTH_REDIRECT_URI) {
    throw new Error(
      "Invalid SPOTIFY_AUTH_REDIRECT_URI, please check your env variables"
    )
  } else if (!SPOTIFY_CLIENT_ID) {
    throw new Error(
      "Invalid SPOTIFY_CLIENT_ID, please check your env variables"
    )
  }

  const redirectUri = encodeURIComponent(SPOTIFY_AUTH_REDIRECT_URI)
  const encodedScopes = encodeURIComponent(scopes)
  return `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${encodedScopes}&redirect_uri=${redirectUri}`
}
