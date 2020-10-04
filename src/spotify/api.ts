import {
  Album,
  Artist,
  Bar,
  Beat,
  ExternalIds,
  ExternalUrls,
  Meta,
  Section,
  Segment,
  Tatum,
  Track,
  Tracks,
} from "./model"
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

export interface SpotifyApiGetAudioAnalysisResponse {
  bars: Bar[]
  beats: Beat[]
  meta: Meta
  sections: Section[]
  segments: Segment[]
  tatums: Tatum[]
  track: Track
}
export const getAudioAnalysis = async (trackId: string) => {
  return callAppAuthorizedSpotifyApi<SpotifyApiGetAudioAnalysisResponse>(
    `/audio-analysis/${trackId}`
  )
}

export interface SpotifyApiGetAudioFeaturesResponse {
  danceability: number
  energy: number
  key: number
  loudness: number
  mode: number
  speechiness: number
  acousticness: number
  instrumentalness: number
  liveness: number
  valence: number
  tempo: number
  type: string
  id: string
  uri: string
  track_href: string
  analysis_url: string
  duration_ms: number
  time_signature: number
}
export const getAudioFeatures = async (trackId: string) => {
  return callAppAuthorizedSpotifyApi<SpotifyApiGetAudioFeaturesResponse>(
    `/audio-features/${trackId}`
  )
}
