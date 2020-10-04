import { useMutation } from "react-query"
import { postApi } from "../apiHelpers"
import { PostPlaySongRequestBody } from "../pages/api/player/play"

const usePlaySpotifyUri = () => {
  const playSong = postApi<PostPlaySongRequestBody>(`/player/play`)

  return useMutation(playSong)
}

export default usePlaySpotifyUri
