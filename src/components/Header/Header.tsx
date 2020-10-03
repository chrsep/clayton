import React, { FC } from "react"
import { Svg } from "react-optimized-image"
import Button from "../Button/Button"
import SpotifyIcon from "../../icons/spotify.svg"

export interface HeaderProps {}
const Header: FC<HeaderProps> = () => (
  <nav className="flex items-center p-4">
    <h1 className="text-xl font-bold">Clayton</h1>
    <a className="ml-auto inline-block" href="/api/auth/login">
      <Button>
        <Svg src={SpotifyIcon} className="w-6 h-6 color-white" />
        <span className="px-3">Log In</span>
      </Button>
    </a>
  </nav>
)

export default Header
