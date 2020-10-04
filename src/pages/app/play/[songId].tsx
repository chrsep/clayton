import Head from "next/head"
import React, { FC } from "react"
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next"
import { getTrack } from "../../../spotify/api"

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ songId: string }>) => {
  const tracks = await getTrack(params?.songId ?? "")

  return {
    props: { tracks },
    revalidate: 3600,
  }
}

const Play: FC<InferGetStaticPropsType<typeof getStaticProps>> = () => (
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
  </div>
)

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true }
}

export default Play
