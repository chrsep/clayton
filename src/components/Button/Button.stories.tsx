import React from "react"
import { Meta, Story } from "@storybook/react"
import Button, { ButtonProps } from "./Button"

export default {
  title: "Button",
  component: Button,
  parameters: {
    componentSubtitle: "Just a simple Button",
  },
} as Meta

const Template: Story<ButtonProps & { text: string }> = (args) => (
  <Button {...args}>{args.text}</Button>
)

export const Default = Template.bind({})
Default.args = {
  text: "Log In",
}
