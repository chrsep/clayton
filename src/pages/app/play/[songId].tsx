import Head from "next/head"
import React from "react"
import { useQueryString } from "../../../hooks/useQueryString"

const Play = () => {
  const songId = useQueryString("songId")

  return (
    <div>
      <Head>
        <title>Clayton Prototype</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const cookies = document.cookie.replace(" ", "").split(";")
              const isLoggedIn = cookies.findIndex((item) => item === "loggedIn=1")
              if (isLoggedIn < 0) {
                window.location.href  = "/"
              }    
            })()
        `,
          }}
        />
      </Head>
      {songId}
    </div>
  )
}

export default Play
