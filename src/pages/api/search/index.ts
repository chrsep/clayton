import { NextApiResponse } from "next"
import { getQueryString, newProtectedHandler } from "../../../handler"
import {
  searchTracks,
  SpotifyApiSearchTrackResponse,
} from "../../../spotify/api"

export interface SearchTracksResponse extends SpotifyApiSearchTrackResponse {}

const search = newProtectedHandler(
  async (req, res: NextApiResponse<SearchTracksResponse>, session) => {
    const q = getQueryString(req, "q")
    const type = getQueryString(req, "type")

    if (type === "track") {
      try {
        const response = await searchTracks(session, q)
        res.json(response)
      } catch (e) {
        res.status(401).end()
      }
      return
    }

    res.status(400).end("Unsupported search type")
  }
)

export default search
