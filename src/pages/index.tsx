import Head from "next/head"
import React, { FC } from "react"

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

      <div className="p-3 rounded bg-gray-300 m-3 text-black max-w-2xl mx-auto">
        We are Open Source!
      </div>
    </div>
  )
}

export default Home
