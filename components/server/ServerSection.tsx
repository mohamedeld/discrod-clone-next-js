"use client";

import { ChannelType, MemberRole } from "@/lib/generated/prisma";
import { ServerWithMembersWithProfiles } from "@/types";
import ActionTooltip from "../ActionTooltip";
import { Plus } from "lucide-react";
import CreateChannelModal from "../modals/CreateChannelModal";

interface IProps{
    label:string;
    role?:MemberRole;
    sectionType:"channels" | "members";
    channelType?:ChannelType;
    server?:ServerWithMembersWithProfiles;
}

const ServerSection = ({label,role,sectionType,channelType,server}:IProps) => {
  return (
    <div className="flex items-center justify-between py-2">
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
        {role !== MemberRole.GUEST && sectionType === "channels" && (
            <ActionTooltip label="Create Channel" side="top">
                <CreateChannelModal server={server} isIcon={true} channelType={channelType}/>
            </ActionTooltip>
        )}
        {role !== MemberRole.ADMIN && sectionType === "members" && (
            <ActionTooltip label="Manage Members" side="top">
                <CreateChannelModal server={server} isIcon={true} />
            </ActionTooltip>
        )}

    </div>
  )
}

export default ServerSection