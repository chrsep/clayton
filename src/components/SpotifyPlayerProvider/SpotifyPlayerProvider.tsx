import React, { createContext, FC, useEffect, useState } from "react"
import useGetAccessToken from "../../hooks/useGetAccessToken"

export const SpotifyPlayerContext = createContext<{
  deviceId: string
  isLoading: boolean
  ready: boolean
  load: () => void
  seek: (time: number) => Promise<void>
} | null>(null)

export interface SpotifyPlayerProviderProps {}
const SpotifyPlayerProvider: FC<SpotifyPlayerProviderProps> = ({
  children,
}) => {
  const accessToken = useGetAccessToken()
  const [player, setPlayer] = useState<any>(null)
  const [deviceId, setDeviceId] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldLoad, setShouldLoad] = useState(false)

  const onSdkLoaded = () => {
    const p = new Spotify.Player({
      name: "Clayton",
      getOAuthToken: (cb: any) => cb(accessToken.data?.accessToken),
    })

    p.addListener("ready", ({ device_id }: any) => setDeviceId(device_id))
    p.addListener("not_ready", () => setDeviceId(""))
    p.connect()

    setPlayer(p)
    setIsLoading(false)
  }

  useEffect(() => {
    if (accessToken.data && shouldLoad) {
      window.onSpotifyWebPlaybackSDKReady = onSdkLoaded
      loadSpotifyPlaybackSdk()
    }
  }, [accessToken.data && shouldLoad])

  return (
    <SpotifyPlayerContext.Provider
      value={{
        isLoading,
        deviceId,
        ready: deviceId !== "",
        load: () => {
          setShouldLoad(true)
        },
        seek: async (time: number) => {
          await player.seek(time * 1000)
        },
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  )
}

const loadSpotifyPlaybackSdk = () => {
  const spotifySdk = document.createElement("script")
  spotifySdk.type = "text/javascript"
  spotifySdk.src = "https://sdk.scdn.co/spotify-player.js"
  document.getElementsByTagName("head")[0].appendChild(spotifySdk)
}

export default SpotifyPlayerProvider
