import { ReactNode } from "react"

interface IProps{
    children:ReactNode
}
const AuthLayout = ({children}:IProps) => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center h-full">{children}</div>
  )
}

export default AuthLayout