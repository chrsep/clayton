/* eslint-disable react/no-danger */
import Head from "next/head"
import React, { FC } from "react"
import { Svg } from "react-optimized-image"
import GithubIcon from "../icons/github.svg"
import ChevronRight from "../icons/chevron_right.svg"
import Header from "../components/Header/Header"

const Home: FC = () => (
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
              if (isLoggedIn > -1) {
                window.location.href  = "/app"
              }    
            })()
        `,
        }}
      />
    </Head>

    <Header />

    <h1 className="px-6 leading-tight text-center text-4xl my-12 font-bold md:text-6xl max-w-xl mx-auto">
      Learn Songs You Love, More Easily
    </h1>

    <a href="https://github.com/chrsep/clayton">
      <div className="p-3 rounded bg-white m-3 text-black max-w-2xl md:mx-auto mt-20 hover:shadow-outline">
        <div className="flex items-center font-bold">
          <Svg src={GithubIcon} className="w-5 h-5" />
          <h2 className="ml-3">We are Open Source!</h2>
          <Svg src={ChevronRight} className="w-8 h-8 ml-auto" />
        </div>
      </div>
    </a>
  </div>
)

export default Home
