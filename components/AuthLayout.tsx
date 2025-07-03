"use client";

import { SessionProvider } from "next-auth/react";

interface IProps{
    children:React.ReactNode
}

const AuthLayoutSession = ({children}:IProps) => {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default AuthLayoutSession