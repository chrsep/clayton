import React, { FC } from "react"
import { AppPropsType } from "next/dist/next-server/lib/utils"
import Header from "../components/Header/Header"
import "../global.css"

const MyApp: FC<AppPropsType> = ({ Component, pageProps }) => {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
