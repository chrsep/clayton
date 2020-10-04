import React, { createContext, FC, useState } from "react"

export const SpotifyPlayerContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAccessToken: (value: string) => {},
  deviceId: "",
  player: null,
  isLoading: false,
  ready: false,
})

export interface SpotifyPlayerProviderProps {}
const SpotifyPlayerProvider: FC<SpotifyPlayerProviderProps> = ({
  children,
}) => {
  const [player, setPlayer] = useState<any>(null)
  const [deviceId, setDeviceId] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <SpotifyPlayerContext.Provider
      value={{
        isLoading,
        player,
        deviceId,
        ready: deviceId !== "",
        setAccessToken: (token) => {
          setIsLoading(true)
          const spotifySdk = document.createElement("script")
          spotifySdk.type = "text/javascript"
          window.onSpotifyWebPlaybackSDKReady = () => {
            const p = new Spotify.Player({
              name: "Clayton",
              getOAuthToken: (cb: any) => cb(token),
            })

            p.addListener("ready", ({ device_id }: any) =>
              setDeviceId(device_id)
            )

            p.addListener("not_ready", () => setDeviceId(""))

            p.connect()

            setPlayer(p)
            setIsLoading(false)
          }
          // Load the sdk
          spotifySdk.src = "https://sdk.scdn.co/spotify-player.js"
          document.getElementsByTagName("head")[0].appendChild(spotifySdk)
        },
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  )
}

export default SpotifyPlayerProvider
