import { currentProfile } from "@/lib/current-profile";
import { ChannelType, MemberRole } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./ServerSection";
import ServerChannel from "./ServerChannel";
import ServerMember from "./ServerMember";

interface IProps{
    serverId:string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4"/>,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4"/>,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4"/>,
};

const roleIconMap = {
    [MemberRole.GUEST] : null,
    [MemberRole.MODERATOR] : <ShieldCheck className="mr-2 text-indigo-500 h-4 w-4"/>,
    [MemberRole.ADMIN] : <ShieldAlert className="mr-2 text-rose-500 h-4 w-4"/>,
}

const ServerSidebar = async ({serverId}:IProps) => {
    const profile = await currentProfile();
    if(!profile){
        return redirect("/");
    }
    const server = await prisma.server.findUnique({
        where: {
          id: serverId,
        },
        include:{
            channels:{
                orderBy:{
                    createdAt:"asc"
                }
            },
            members:{
                include:{
                    profile:{
                        include:{
                            user:true
                        }
                    }
                },
                orderBy:{
                    role:"asc"
                }
            }
        }
      });
      if (!server) {
        return redirect("/");
      }
      const textChannels = server?.channels?.filter((channel)=> channel?.type === ChannelType.TEXT);
      const audioChannels = server?.channels?.filter((channel)=> channel?.type === ChannelType.AUDIO);
      const videoChannels = server?.channels?.filter((channel)=> channel?.type === ChannelType.VIDEO);

      const members = server?.members?.filter((member)=> member?.profileId !== profile?.id);

      const role = server?.members?.find((member)=> member?.profileId === profile?.id)?.role;


  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
        <ServerHeader
            server={server}
            role={role}
        />
        <ScrollArea className="flex-1 px-3">
            <div className="mt-2">
                <ServerSearch data={[
                    {
                        label:"Text Channels",
                        type:"channel",
                        data:textChannels?.map((channel)=>({
                            id:channel?.id,
                            name:channel?.name,
                            icon:iconMap[channel?.type]
                        }))
                    },
                    {
                        label:"Voice Channels",
                        type:"channel",
                        data:audioChannels?.map((channel)=>({
                            id:channel?.id,
                            name:channel?.name,
                            icon:iconMap[channel?.type]
                        }))
                    },
                    {
                        label:"Video Channels",
                        type:"channel",
                        data:videoChannels?.map((channel)=>({
                            id:channel?.id,
                            name:channel?.name,
                            icon:iconMap[channel?.type]
                        }))
                    },
                    {
                        label:"Members",
                        type:"member",
                        data:members?.map((member)=>({
                            id:member?.id,
                            name:member?.profile?.user?.name,
                            icon:roleIconMap[member?.role]
                        }))
                    }
                ]}/>
            </div>
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
            {!!textChannels?.length && (
                <div className="mb-2">
                    <ServerSection 
                        sectionType="channels"
                        channelType={ChannelType.TEXT}
                        role={role}
                        label="Text Channels"

                    />
                    <div className="space-y-[2px]">
                    {textChannels?.map((channel)=>(
                        <ServerChannel key={channel?.id} role={role} channel={channel} server={server}/>
                    ))}
                    </div>
                </div>
            )}
            {!!audioChannels?.length && (
                <div className="mb-2">
                    <ServerSection 
                        sectionType="channels"
                        channelType={ChannelType.AUDIO}
                        role={role}
                        label="Voice Channels"

                    />
                    <div className="space-y-[2px]">
                    {audioChannels?.map((channel)=>(
                        <ServerChannel key={channel?.id} role={role} channel={channel} server={server}/>
                    ))}
                    </div>
                </div>
            )}
            {!!videoChannels?.length && (
                <div className="mb-2">
                    <ServerSection 
                        sectionType="channels"
                        channelType={ChannelType.VIDEO}
                        role={role}
                        label="Video Channels"

                    />
                    <div className="space-y-[2px]">
                    {videoChannels?.map((channel)=>(
                        <ServerChannel key={channel?.id} role={role} channel={channel} server={server}/>
                    ))}
                    </div>
                </div>
            )}
            {!!members?.length && (
                <div className="mb-2">
                    <ServerSection 
                        sectionType="members"
                        role={role}
                        label="Members"
                        server={server}
                    />
                    <div className="space-y-[2px]">
                    {members?.map((member)=>(
                        <ServerMember key={member?.id} member={member} server={server} />
                    ))}
                    </div>
                </div>
            )}
        </ScrollArea>
    </div>
  )
}

export default ServerSidebar