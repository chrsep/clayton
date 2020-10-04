import Head from "next/head"
import React, { FC } from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import Svg from "react-optimized-image/lib/components/Svg"
import Link from "next/link"
import dayjs, { Dayjs } from "dayjs"
import {
  getAudioAnalysis,
  getAudioFeatures,
  getTrack,
  SpotifyApiGetAudioAnalysisResponse,
  SpotifyApiGetAudioFeaturesResponse,
  SpotifyApiGetTrackResponse,
} from "../../../spotify/api"
import Button from "../../../components/Button/Button"
import CrossIcon from "../../../icons/cross.svg"

enum Modality {
  Minor,
  Major,
}

enum Key {
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "E#",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
  "B#",
}

function convertMilliseconds(milliseconds?: number) {
  if (milliseconds === undefined) return "-"

  const totalSeconds = Math.floor(milliseconds / 1000)
  const totalMinute = Math.floor(totalSeconds / 60)

  const seconds = totalSeconds % 60
  const minutes = totalMinute % 60

  return `${minutes}m ${seconds}s`
}

interface Props {
  track?: SpotifyApiGetTrackResponse
  audioAnalysis?: SpotifyApiGetAudioAnalysisResponse
  audioFeatures?: SpotifyApiGetAudioFeaturesResponse
  lastUpdated: number
}
const Play: FC<Props> = ({
  track,
  audioAnalysis,
  audioFeatures,
  lastUpdated,
}) => {
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
      </div>
      {track && audioAnalysis && audioFeatures && lastUpdated ? (
        <div className="p-3 max-w-6xl mx-auto">
          <TrackPreview
            track={track}
            audioAnalysis={audioAnalysis}
            audioFeatures={audioFeatures}
            lastUpdated={dayjs(lastUpdated)}
          />
        </div>
      ) : (
        <h1 className="px-3 leading-tight text-center text-4xl my-12 font-bold md:text-6xl max-w-2xl mx-auto">
          Loading music data and analysis
        </h1>
      )}
    </div>
  )
}

const TrackPreview: FC<{
  track: SpotifyApiGetTrackResponse
  audioAnalysis: SpotifyApiGetAudioAnalysisResponse
  audioFeatures: SpotifyApiGetAudioFeaturesResponse
  lastUpdated: Dayjs
}> = ({ track, audioAnalysis, audioFeatures, lastUpdated }) => {
  const image = track.album.images.find(({ height }) => height < 100)

  return (
    <div className="max-w-lg">
      <div className="flex items-center mt-6">
        <img alt={`${track.name} album cover`} src={image?.url ?? ""} />
        <div className="ml-3">
          <h1 className="font-bold leading-tight mb-2">{track.name}</h1>
          <h2 className="leading-tight text-sm flex">
            {track.artists.map((artist, artistIdx) => (
              <>
                {artistIdx > 0 && <p className="px-2">•</p>}
                <p key={artist.id}>{artist.name}</p>
              </>
            ))}
          </h2>
        </div>
      </div>

      <p className="text-gray-500 my-3 text-sm">
        Updated on {lastUpdated.format("D MMM YYYY")}
      </p>

      <div className="bg-white text-black rounded p-3 mb-3">
        <h3 className="font-bold text-sm text-indigo-700">Features</h3>
        <div className="flex flex-wrap">
          <FeatureItem name="Key" value={Key[audioFeatures.key] ?? "-"} />
          <FeatureItem
            name="Modality"
            value={Modality[audioFeatures.key] ?? "-"}
          />
          <FeatureItem
            name="Time Signature"
            value={audioFeatures.time_signature ?? "-"}
          />
          <FeatureItem name="Tempo" value={audioFeatures.tempo ?? "-"} />
          <FeatureItem
            name="Duration"
            value={convertMilliseconds(audioFeatures.duration_ms)}
          />
        </div>
      </div>

      <div className="bg-white text-black rounded p-3 mb-3">
        <h3 className="font-bold text-sm text-indigo-700">Analysis</h3>
        <div className="flex flex-wrap">
          <FeatureItem
            name="Bars Count"
            value={audioAnalysis.bars.length ?? "-"}
          />
          <FeatureItem
            name="Section Count"
            value={audioAnalysis.sections.length ?? "-"}
          />
        </div>
      </div>

      <Looper />
    </div>
  )
}

const Looper = () => {
  return (
    <div className="bg-white rounded p-3 flex flex-col items-center">
      <Button>play</Button>
    </div>
  )
}

const FeatureItem: FC<{ name: string; value: string | number }> = ({
  name,
  value,
}) => (
  <p className="w-1/2 mt-1">
    {name} <span className="font-bold">{value}</span>
  </p>
)

export const getStaticProps: GetStaticProps<
  Props,
  { songId: string }
> = async ({ params }) => {
  const result = await Promise.all([
    getTrack(params?.songId ?? ""),
    getAudioAnalysis(params?.songId ?? ""),
    getAudioFeatures(params?.songId ?? ""),
  ])

  return {
    props: {
      track: result[0],
      audioAnalysis: result[1],
      audioFeatures: result[2],
      lastUpdated: Date.now(),
    },
    revalidate: 3600,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true }
}

export default Play
