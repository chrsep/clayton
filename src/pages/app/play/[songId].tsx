import Head from "next/head"
import React, { FC } from "react"
import { GetStaticPaths, InferGetStaticPropsType } from "next"
import { useQueryString } from "../../../hooks/useQueryString"

export const getStaticProps = async () => {
  return {
    props: {
      tracks: "",
    },
    revalidate: 1,
  }
}

const Play: FC<InferGetStaticPropsType<typeof getStaticProps>> = () => {
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

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true }
}

export default Play
