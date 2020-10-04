import { newProtectedHandler } from "../../../handler"
import { playSpotifyUri } from "../../../spotify/api"

export interface PostPlaySongRequestBody {
  spotifyUri: string
  deviceId: string
}
const play = newProtectedHandler(async (req, res, session) => {
  const requestBody: PostPlaySongRequestBody = JSON.parse(req.body)
  await playSpotifyUri(session, requestBody.spotifyUri, requestBody.deviceId)
  res.status(204).end()
})

export default play
