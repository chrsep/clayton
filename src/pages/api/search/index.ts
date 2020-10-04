import { getQueryString, newHandler } from "../../../handler"
import { getSpotifyAccessToken } from "../../../redis"
import {
  searchTracks,
  SpotifyApiSearchTrackResponse,
} from "../../../spotify/api"

export interface SearchTracksResponse extends SpotifyApiSearchTrackResponse {}

const search = newHandler(async (req, res) => {
  const q = getQueryString(req, "q")
  const type = getQueryString(req, "type")

  const sessionToken = req.cookies.token
  const accessToken = await getSpotifyAccessToken(sessionToken)

  if (type === "track") {
    if (accessToken) {
      const response: SearchTracksResponse = await searchTracks(accessToken, q)
      res.json(response)
    } else {
      res.status(401).end()
    }
  }

  res.status(400).end("Unsupported search type")
})

export default search
