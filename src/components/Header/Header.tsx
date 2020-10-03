import React, { FC } from "react"
import { Svg } from "react-optimized-image"
import Button from "../Button/Button"
import Text from "../Text/Text"
import SpotifyIcon from "../../icons/spotify.svg"

export interface HeaderProps {}
const Header: FC<HeaderProps> = () => (
  <nav className="flex items-center p-4">
    <Text className="text-xl font-bold">Clayton</Text>
    <a className="ml-auto inline-block" href="/api/auth/login">
      <Button>
        <Svg src={SpotifyIcon} className="w-6 h-6 color-white" />
        <span className="px-3">LOG IN</span>
      </Button>
    </a>
  </nav>
)

export default Header
