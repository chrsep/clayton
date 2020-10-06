import Head from "next/head"
import React, { FC, useContext, useEffect } from "react"
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
import ChevronIcon from "../../../icons/chevron_left.svg"
import usePlaySpotifyUri from "../../../hooks/usePlaySpotifyUri"
import { SpotifyPlayerContext } from "../../../components/SpotifyPlayerProvider/SpotifyPlayerProvider"
import useQueryString from "../../../hooks/useQueryString"

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
  const search = useQueryString("search")

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
          <Link href={`/app${search ? `?search=${search}` : ""}`}>
            <a className="">
              <Button className="text-sm px-2 bg-black border-2">
                <Svg src={ChevronIcon} className="w-6 h-6" />
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
          Loading track data and analysis
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

      <Looper
        track={track}
        audioAnalysis={audioAnalysis}
        audioFeatures={audioFeatures}
      />
    </div>
  )
}

const Looper: FC<{
  track: SpotifyApiGetTrackResponse
  audioAnalysis: SpotifyApiGetAudioAnalysisResponse
  audioFeatures: SpotifyApiGetAudioFeaturesResponse
}> = ({ track, audioAnalysis }) => {
  const [playSpotifyUri] = usePlaySpotifyUri()
  const player = useContext(SpotifyPlayerContext)

  if (!player) {
    return <div>Loading Player</div>
  }

  useEffect(() => {
    player.load()
  }, [])

  return (
    <div className="bg-white rounded p-3 items-center flex flex-col ">
      <div className="flex flex-wrap w-full items-end">
        {audioAnalysis.bars.map(({ start }, idx) => {
          const sectionIdx = audioAnalysis.sections.findIndex(
            (section) => section.start - 1 > start
          )
          return (
            <div key={start} className="w-1/12 mb-2 text-xs">
              {idx % 12 === 0 && <p className="text-black">{start}</p>}
              <Button
                className="w-full h-6 bg-indigo-800 border rounded-none border-black hover:bg-indigo-400"
                onClick={() => {
                  player.seek(start)
                }}
              >
                {sectionIdx}
              </Button>
            </div>
          )
        })}
      </div>
      <Button
        onClick={async () => {
          await playSpotifyUri({
            spotifyUri: track.uri,
            deviceId: player.deviceId,
          })
        }}
        disabled={player.isLoading}
      >
        play
      </Button>
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
  console.log("getStaticProps called")
  const retrievePageData = async (songId: string): Promise<Props> => {
    let count = 0
    let props: Props
    try {
      console.log(`play: fetching data`)
      const result = await Promise.all([
        getTrack(songId),
        getAudioAnalysis(songId),
        getAudioFeatures(songId),
      ])

      props = {
        track: result[0],
        audioAnalysis: result[1],
        audioFeatures: result[2],
        lastUpdated: Date.now(),
      }
    } catch (e) {
      console.log(`play: retry fetching data for the ${count} times`)
      // Prevent infinite loop, only allows for 3x
      count += 1
      if (count > 3) {
        console.log(e)
        throw e
      }

      // Sleep
      await new Promise((r) => setTimeout(r, Math.random() * 1000))
      props = await retrievePageData(songId)
    }
    return props
  }
  console.log("getStaticProps finished")

  const props = await retrievePageData(params?.songId ?? "")

  return {
    props,
    revalidate: 3600,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true }
}

export default Play
