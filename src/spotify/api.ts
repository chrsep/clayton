import { Tracks } from "./model"
import { callSpotifyApi } from "./utils"

export interface SpotifyApiSearchTrackResponse {
  tracks: Tracks
}
export const searchTracks = async (accessToken: string, query: string) => {
  return callSpotifyApi<SpotifyApiSearchTrackResponse>(
    accessToken,
    `/search?type=track&q=${query}`
  )
}
