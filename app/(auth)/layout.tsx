import { ReactNode } from "react"

interface IProps{
    children:ReactNode
}
const AuthLayout = ({children}:IProps) => {
  return (
    <div className="h-full">{children}</div>
  )
}

export default AuthLayout