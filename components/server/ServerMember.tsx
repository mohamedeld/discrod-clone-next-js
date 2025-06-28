"use client";

import { Member, MemberRole, Profile, Server } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import MemberAvatar from "../MemberAvatar";
import { MemberWithProfileAndUser } from "@/types";



interface IProps{
    member:MemberWithProfileAndUser;
    server:Server;
}

const roleIconMap = {
    [MemberRole.GUEST]:null,
    [MemberRole.MODERATOR] : <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500"/>,
    [MemberRole.ADMIN] : <ShieldAlert className="w-4 h-4 ml-2 text-rose-500"/>,
}

const ServerMember = ({member,server}:IProps) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member?.role];

  return (
    <button className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member?.id && "bg-zinc-700/20 dark:bg-zinc-700"
    )}>
        <MemberAvatar src={member?.profile?.imageUrl} className="h-8 w-8"/>
        <p className={cn(
            "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.memberId === member?.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}>{member?.profile?.user?.name}</p>
        {icon}
    </button>
  )
}

export default ServerMember