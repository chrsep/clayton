import React, { FC } from "react"
import { AppPropsType } from "next/dist/next-server/lib/utils"
import "../global.css"

const MyApp: FC<AppPropsType> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default MyApp
