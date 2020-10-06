/* eslint-disable react/no-danger */
import React, {
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react"
import Head from "next/head"
import { Svg } from "react-optimized-image"
import Link from "next/link"
import { useRouter } from "next/router"
import SearchIcon from "../../icons/search.svg"
import useSearchTrack from "../../hooks/useSearchTrack"
import CrossIcon from "../../icons/cross.svg"
import Button from "../../components/Button/Button"
import useDebounce from "../../hooks/useDebounce"
import useQueryString from "../../hooks/useQueryString"

const App: FC = () => {
  const router = useRouter()
  const defaultSearch = useQueryString("search")
  const [search, setSearch] = useState(defaultSearch)

  useEffect(() => {
    if (defaultSearch && search === undefined) setSearch(defaultSearch)
  }, [defaultSearch, search])

  useEffect(() => {
    if (search !== undefined) {
      router
        .push({
          pathname: "/app",
          query: search === "" ? undefined : { search },
        })
        .catch((e) => {
          throw e
        })
    }
  }, [search])

  return (
    <div className="pt-16">
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

      <Searchbar value={search} onChange={setSearch} />

      {!search && (
        <h1 className="px-6 leading-tight text-center text-4xl my-12 font-bold md:text-6xl max-w-lg mx-auto">
          Welcome, John
        </h1>
      )}
      <SearchMusic query={search ?? ""} />
    </div>
  )
}

const SearchMusic: FC<{ query: string }> = ({ query }) => {
  const debouncedQuery = useDebounce(query, 400)
  const { data, isSuccess, isLoading, refetch, isIdle } = useSearchTrack(
    debouncedQuery
  )

  if (query === "") {
    return <></>
  }

  if (isLoading || isIdle)
    return (
      <h1 className="px-6 leading-tight text-center text-4xl my-12 font-bold md:text-6xl max-w-lg mx-auto">
        searching
      </h1>
    )

  if (isSuccess && data?.tracks.total === 0)
    return (
      <h1 className="px-6 leading-tight text-center text-4xl my-12 font-bold md:text-6xl max-w-lg mx-auto">
        no result found
      </h1>
    )

  if (isSuccess)
    return (
      <div className="flex flex-wrap max-w-6xl mx-auto">
        {data?.tracks.items.map(({ id, name, album, artists }, idx) => {
          const albumThumbnail = album.images.find(({ height }) => height < 100)
          return (
            <Link
              key={id}
              href={`/app/play/[songId]?search=${query}`}
              as={`/app/play/${id}?search=${query}`}
            >
              <a className="p-4 flex items-center w-full md:w-1/2 hover:bg-white hover:text-black truncate">
                <img
                  alt={`${name} album cover`}
                  src={albumThumbnail?.url}
                  className="w-16 h-16 flex-shrink-0"
                  loading={idx < 10 ? "eager" : "lazy"}
                />
                <div className="ml-3">
                  <p className="font-bold">{name}</p>
                  <div className="flex opacity-75">
                    {artists.map((artist, artistIdx) => (
                      <>
                        {artistIdx > 0 && <p className="px-2">•</p>}
                        <p key={artist.id}>{artist.name}</p>
                      </>
                    ))}
                  </div>
                </div>
              </a>
            </Link>
          )
        })}
      </div>
    )
  return (
    <>
      <h1 className="px-6 leading-tight text-center text-4xl mt-12 mb-8 font-bold md:text-6xl max-w-lg mx-auto">
        umm, something went wrong
      </h1>
      <Button onClick={() => refetch} className="mx-auto px-4">
        Try again
      </Button>
    </>
  )
}

interface SearchBarProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "onChange"
  > {
  onChange: (value: string) => void
}
const Searchbar: FC<SearchBarProps> = ({ value, onChange, ...props }) => {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div
      className="flex items-center p-3 max-w-6xl mx-auto fixed top-0 left-0 right-0"
      style={{
        backgroundImage:
          "linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,1))",
      }}
    >
      <Button
        onClick={() => {
          if (ref.current) {
            onChange("")
            ref.current.blur()
          }
        }}
        className={`p-2 mr-2 ${
          value ? "" : "opacity-0"
        } transition-opacity duration-100 bg-black border-2`}
      >
        <Svg src={CrossIcon} className="w-5 h-5 flex-shrink-0" />
      </Button>
      <label
        htmlFor="searchbar"
        className={`flex items-center rounded-full px-3 py-2 bg-white text-black ${
          value ? "w-full" : "w-32"
        } ml-auto focus-within:w-full transition-width duration-200`}
      >
        <Svg src={SearchIcon} className="w-6 h-6 flex-shrink-0" />
        <input
          ref={ref}
          id="searchbar"
          className="placeholder-gray-700 bg-transparent flex-shrink w-full pl-2 focus:outline-none"
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
      </label>
    </div>
  )
}

export default App
