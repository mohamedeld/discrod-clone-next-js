"use client";

import { useState } from "react";
import {QueryClientProvider,QueryClient} from "@tanstack/react-query"

interface IProps{
    children:React.ReactNode
}
const QueryProvider = ({children}:IProps) => {
    const [queryClient] = useState(()=> new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  )
}

export default QueryProvider