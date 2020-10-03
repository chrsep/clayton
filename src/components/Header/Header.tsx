import React, { FC } from "react"
import Button from "../Button/Button"
import Text from "../Text/Text"

export interface HeaderProps {}
const Header: FC<HeaderProps> = () => (
  <nav className="flex">
    <Text>Clayton</Text>
    <Button className="ml-auto">Login</Button>
  </nav>
)

export default Header
