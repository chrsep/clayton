import React, { DetailedHTMLProps, FC } from "react"

export interface TextProps
  extends DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}
const Text: FC<TextProps> = (props) => <p {...props} />

export default Text
