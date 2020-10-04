/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="optimized-images-loader" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Spotify: any

interface Window {
  onSpotifyWebPlaybackSDKReady: () => void
  player: any
}
