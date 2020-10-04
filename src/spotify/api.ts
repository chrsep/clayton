import { Tracks } from "./model"
import {
  callAppAuthorizedSpotifyApi,
  callUserAuthorizedSpotifyApi,
} from "./utils"

export interface SpotifyApiSearchTrackResponse {
  tracks: Tracks
}
export const searchTracks = async (accessToken: string, query: string) => {
  return callUserAuthorizedSpotifyApi<SpotifyApiSearchTrackResponse>(
    accessToken,
    `/search?type=track&q=${query}`
  )
}

export const getTrack = async (trackId: string) => {
  return callAppAuthorizedSpotifyApi<SpotifyApiSearchTrackResponse>(
    `/tracks/${trackId}`
  )
}
