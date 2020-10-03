import React from "react"
import { Meta, Story } from "@storybook/react"
import Text, { TextProps } from "./Text"

export default {
  title: "Text",
  component: Text,
  parameters: {
    componentSubtitle: "Just a simple Text",
  },
} as Meta

const Template: Story<TextProps> = (args) => <Text {...args} />

export const Default = Template.bind({})
Default.args = {}
