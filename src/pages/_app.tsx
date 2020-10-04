import React, { FC } from "react"
import { AppPropsType } from "next/dist/next-server/lib/utils"
import "../global.css"
import SpotifyPlayerProvider from "../components/SpotifyPlayerProvider/SpotifyPlayerProvider"

const MyApp: FC<AppPropsType> = ({ Component, pageProps }) => {
  return (
    <SpotifyPlayerProvider>
      <Component {...pageProps} />
    </SpotifyPlayerProvider>
  )
}

export default MyApp
