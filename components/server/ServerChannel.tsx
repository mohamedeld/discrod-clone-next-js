"use client";

import { Channel, ChannelType, MemberRole, Server } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../ActionTooltip";
import CreateChannelModal from "../modals/CreateChannelModal";
import { ServerWithMembersWithProfiles } from "@/types";
import DeleteChannelModal from "../modals/DeleteChannelModal";

interface IProps{
    channel:Channel;
    server:Server;
    role?:MemberRole;
}

const iconMap = {
    [ChannelType.TEXT]:Hash,
    [ChannelType.AUDIO]:Mic,
    [ChannelType.VIDEO]:Video,
}

const ServerChannel = ({channel,server,role}:IProps) => {
    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[channel?.type];

  return (
    <button onClick={()=>{}} className={cn(
        "group p-2 rounded-md flex items-cener gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel?.id && "bg-zinc-700/20 dark:bg-zinc-700"
    )}>
        <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400"/>
        <p className={
            cn(
                "line-clamp-1 font-semibold text-xs text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.channelId === channel?.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )
        }>{channel?.name}</p>
        {channel?.name !== "general" && role !== MemberRole.GUEST && (
            <div className="ml-auto flex items-center gap-x-2">
                <ActionTooltip label="Edit">
                    <CreateChannelModal server={server as ServerWithMembersWithProfiles} channel={channel} isUpdate={true} />
                </ActionTooltip>
                <ActionTooltip label="Delete">
                    <DeleteChannelModal server={server} channel={channel}/>
                </ActionTooltip>
            </div>
        )}
        {channel?.name === "general" && (
            <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400"/>
        )}
    </button>
  )
}

export default ServerChannel