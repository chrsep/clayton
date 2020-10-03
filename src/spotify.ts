import SpotifyWebApi from "spotify-web-api-node"

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_AUTH_REDIRECT_URI,
} = process.env

const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUri: SPOTIFY_AUTH_REDIRECT_URI,
})

export const generateAuthorizationUrl = (scopes: string[]) => {
  if (!SPOTIFY_AUTH_REDIRECT_URI) {
    throw new Error(
      "Invalid SPOTIFY_AUTH_REDIRECT_URI, please check your env variables"
    )
  } else if (!SPOTIFY_CLIENT_ID) {
    throw new Error(
      "Invalid SPOTIFY_CLIENT_ID, please check your env variables"
    )
  }

  return spotifyApi.createAuthorizeURL(scopes, "test")
}
