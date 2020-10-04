export interface ExternalUrls {
  spotify: string
}

export interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface Image {
  height: number
  url: string
  width: number
}

export interface Album {
  album_type: string
  artists: Artist[]
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks?: number
  type: string
  uri: string
}

export interface ExternalIds {
  isrc: string
}

export interface Item {
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

export interface Tracks {
  href: string
  items: Item[]
  limit: number
  next: string
  offset: number
  previous?: any
  total: number
}

export interface Bar {
  start: number
  duration: number
  confidence: number
}

export interface Beat {
  start: number
  duration: number
  confidence: number
}

export interface Meta {
  analyzer_version: string
  platform: string
  detailed_status: string
  status_code: number
  timestamp: number
  analysis_time: number
  input_process: string
}

export interface Section {
  start: number
  duration: number
  confidence: number
  loudness: number
  tempo: number
  tempo_confidence: number
  key: number
  key_confidence: number
  mode: number
  mode_confidence: number
  time_signature: number
  time_signature_confidence: number
}

export interface Segment {
  start: number
  duration: number
  confidence: number
  loudness_start: number
  loudness_max_time: number
  loudness_max: number
  loudness_end: number
  pitches: number[]
  timbre: number[]
}

export interface Tatum {
  start: number
  duration: number
  confidence: number
}

export interface Track {
  duration: number
  sample_md5: string
  offset_seconds: number
  window_seconds: number
  analysis_sample_rate: number
  analysis_channels: number
  end_of_fade_in: number
  start_of_fade_out: number
  loudness: number
  tempo: number
  tempo_confidence: number
  time_signature: number
  time_signature_confidence: number
  key: number
  key_confidence: number
  mode: number
  mode_confidence: number
  codestring: string
  code_version: number
  echoprintstring: string
  echoprint_version: number
  synchstring: string
  synch_version: number
  rhythmstring: string
  rhythm_version: number
}

