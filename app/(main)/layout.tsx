import NavigationSidebar from "@/components/nav/NavigationSidebar"
import { ReactNode } from "react"

interface IProps{
    children:ReactNode
}
const MainLayout = ({children}:IProps) => {
  return (
    <div className="h-full ">
        <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
            <NavigationSidebar/>
        </div>
        <main className="md:pl-[72px] h-full">
            {children}

        </main>
    </div>
  )
}

export default MainLayout