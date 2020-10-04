import Head from "next/head"
import React, { FC } from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import Svg from "react-optimized-image/lib/components/Svg"
import Link from "next/link"
import { getTrack, SpotifyApiGetTrackResponse } from "../../../spotify/api"
import Button from "../../../components/Button/Button"
import CrossIcon from "../../../icons/cross.svg"

interface Props {
  track?: SpotifyApiGetTrackResponse
}
const Play: FC<Props> = ({ track }) => {
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
      {track && <TrackPreview track={track} />}
    </div>
  )
}

const TrackPreview: FC<{ track: SpotifyApiGetTrackResponse }> = ({ track }) => {
  const image = track.album.images.find(({ height }) => height < 100)

  return (
    <div className="p-3 max-w-6xl mx-auto">
      <div className="flex items-center">
        <Link href="/app">
          <a className="">
            <Button className="text-sm px-2 bg-black border-2">
              <Svg src={CrossIcon} className="w-6 h-6" />
            </Button>
          </a>
        </Link>
        <h1 className="ml-3 text-center font-bold">Track</h1>
      </div>
      <div className="flex items-center mt-6">
        <img alt={`${track.name} album cover`} src={image?.url ?? ""} />
        <div className="ml-3">
          <h1 className="font-bold leading-tight mb-2">{track.name}</h1>
          <h2 className="leading-tight">
            {track.artists.map((artist, artistIdx) => (
              <>
                {artistIdx > 0 && <p className="px-2">•</p>}
                <p key={artist.id}>{artist.name}</p>
              </>
            ))}
          </h2>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  { songId: string }
> = async ({ params }) => {
  const track = await getTrack(params?.songId ?? "")

  return {
    props: { track },
    revalidate: 3600,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true }
}

export default Play
