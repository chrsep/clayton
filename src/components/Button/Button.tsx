import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react"

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}
const Button: FC<ButtonProps> = (props) => <button type="button" {...props} />

export default Button
