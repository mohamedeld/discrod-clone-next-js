import { currentProfile } from "@/lib/current-profile"
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NavigationAction from "./NavigationAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./NavigationItem";
import { ModeToggle } from "../ModeToggle";
import AvatarUser from "../AvatarUser";

const NavigationSidebar = async () => {
    const profile = await currentProfile();
    if(!profile){
        return redirect("/");
    }
    const servers = await prisma.server.findMany({
        where:{
            members:{
                some:{
                    profileId:profile?.id
                }
            }
        }
    })
    const user = await prisma.user.findUnique({
        where:{
            id:profile?.userId
        }
    })
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] py-3">
        <NavigationAction/>
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
        <ScrollArea className="flex-1 w-full">
            {servers?.map((server)=>{
                return (
                    <div key={server?.id} className="mt-4">
                        <NavigationItem name={server?.name} id={server?.id} imageUrl={server?.imageUrl}/>
                    </div>
                )
            })}
        </ScrollArea>
        <div className="pb-3 mt-auto flex items-center flex-col gap-4">
            <ModeToggle/>
            <AvatarUser name={user?.name || "No Name"}/>
        </div>
    </div>
  )
}

export default NavigationSidebar