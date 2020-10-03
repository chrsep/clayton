import React, { FC } from "react"
import Button from "../Button/Button"
import Text from "../Text/Text"

export interface HeaderProps {}
const Header: FC<HeaderProps> = () => (
  <nav className="flex items-center p-4">
    <Text className="text-xl font-bold">Clayton</Text>
    <Button className="ml-auto">LOG IN</Button>
  </nav>
)

export default Header
