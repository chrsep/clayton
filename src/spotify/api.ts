import { Album, Artist, ExternalIds, ExternalUrls, Tracks } from "./model"
import {
  callAppAuthorizedSpotifyApi,
  callUserAuthorizedSpotifyApi,
} from "./utils"

export interface SpotifyApiSearchTracksResponse {
  tracks: Tracks
}
export const searchTracks = async (accessToken: string, query: string) => {
  return callUserAuthorizedSpotifyApi<SpotifyApiSearchTracksResponse>(
    accessToken,
    `/search?type=track&q=${query}`
  )
}

export interface SpotifyApiGetTrackResponse {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}
export const getTrack = async (trackId: string) => {
  return callAppAuthorizedSpotifyApi<SpotifyApiGetTrackResponse>(
    `/tracks/${trackId}`
  )
}
