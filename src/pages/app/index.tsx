/* eslint-disable react/no-danger */
import React, {
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  useState,
} from "react"
import Head from "next/head"
import { Svg } from "react-optimized-image"
import SearchIcon from "../../icons/search.svg"

const App: FC = () => {
  const [search, setSearch] = useState("")
  return (
    <div>
      <Head>
        <title>Clayton Prototype</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            const cookies = document.cookie.replace(" ", "").split(";")
            const isLoggedIn = cookies.findIndex((item) => item === "loggedIn=1")
            console.log(cookies)
            if (isLoggedIn < 0) {
              window.location.href  = "/api/auth/login"
            }    
        `,
          }}
        />
      </Head>

      <div className="flex items-center p-3 max-w-6xl mx-auto">
        <Searchbar value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {search === "" ? (
        <h1 className="px-6 leading-tight text-center text-4xl my-12 font-bold md:text-6xl max-w-lg mx-auto">
          Welcome, John
        </h1>
      ) : (
        <div>Searching</div>
      )}
    </div>
  )
}

const Searchbar: FC<DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>> = ({ value, ...props }) => (
  <label
    htmlFor="searchbar"
    className={`flex items-center rounded-full px-3 py-2 bg-gray-400 text-black ${
      value ? "w-full" : "w-32"
    } ml-auto focus-within:w-full`}
  >
    <Svg src={SearchIcon} className="w-6 h-6 flex-shrink-0" />
    <input
      id="searchbar"
      className="placeholder-gray-700 bg-transparent flex-shrink w-full pl-2 focus:outline-none"
      placeholder="Search"
      value={value}
      {...props}
    />
  </label>
)

export default App
