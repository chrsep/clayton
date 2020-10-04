const BASE_URL = `https://api.spotify.com/v1`

export const callSpotifyApi = async <T>(
  accessToken: string,
  url: string
): Promise<T> => {
  const uri = `${BASE_URL}${url}`

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
