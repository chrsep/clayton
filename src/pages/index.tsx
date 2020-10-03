import Head from "next/head"
import React, { FC } from "react"
import { Svg } from "react-optimized-image"
import GithubIcon from "../icons/github.svg"
import ChevronRight from "../icons/chevron_right.svg"

const Home: FC = () => {
  return (
    <div>
      <Head>
        <title>Clayton Prototype</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="px-3 leading-tight text-center text-4xl my-12 font-bold md:text-6xl max-w-lg mx-auto">
        Learn Songs You Love, faster
      </h1>

      <a href="https://github.com/chrsep/clayton">
        <div className="p-3 rounded bg-gray-300 m-3 text-black max-w-2xl md:mx-auto mt-20">
          <div className="flex items-center font-bold">
            <Svg src={GithubIcon} className="w-5 h-5" />
            <h2 className="ml-3 text-lg">We are Open Source!</h2>
            <Svg src={ChevronRight} className="w-8 h-8 ml-auto" />
          </div>
        </div>
      </a>
    </div>
  )
}

export default Home
