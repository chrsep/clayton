import React from "react"
import { Meta, Story } from "@storybook/react"
import Header, { HeaderProps } from "./Header"

export default {
  title: "Header",
  component: Header,
  parameters: {
    componentSubtitle: "Just a simple Header",
  },
} as Meta

const Template: Story<HeaderProps> = (args) => <Header {...args} />

export const Default = Template.bind({})
Default.args = {}
