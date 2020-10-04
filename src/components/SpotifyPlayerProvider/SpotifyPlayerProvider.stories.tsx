import React from "react"
import { Meta, Story } from "@storybook/react"
import SpotifyPlayerProvider, {
  SpotifyPlayerProviderProps,
} from "./SpotifyPlayerProvider"

export default {
  title: "SpotifyPlayerProvider",
  component: SpotifyPlayerProvider,
  parameters: {
    componentSubtitle: "Just a simple SpotifyPlayerProvider",
  },
} as Meta

const Template: Story<SpotifyPlayerProviderProps> = (args) => (
  <SpotifyPlayerProvider {...args} />
)

export const Default = Template.bind({})
Default.args = {}
