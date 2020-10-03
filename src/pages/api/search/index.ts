import { getQueryString, newHandler } from "../../../handler"
import { getSpotifyAccessToken } from "../../../redis"
import { searchTracks } from "../../../spotify"

const search = newHandler(async (req, res) => {
  const sessionToken = req.cookies.token
  const q = getQueryString(req, "q")
  const type = getQueryString(req, "type")

  if (type === "track") {
    const accessToken = await getSpotifyAccessToken(sessionToken)
    if (accessToken) {
      const searchResult = await searchTracks(accessToken, q)
      res.json(searchResult)
    } else {
      res.status(401).end()
    }
  }
  res.status(400).end("Only track search is supported")
})

export default search
