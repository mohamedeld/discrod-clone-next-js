"use client";

import {  Video, VideoOff } from "lucide-react";
import ActionTooltip from "../ActionTooltip";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import queryString from "query-string";

const ChatVideoButton = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const isVideo = searchParams?.get("video");
    const Icon = isVideo ? VideoOff : Video;
    const tooltipLabel = isVideo ? "End video call" : "Start video call";

    const onClick = ()=>{
        const url = queryString.stringifyUrl({
            url:pathname || "",
            query:{
                video : isVideo ? undefined : true
            }
        },{skipNull:true})
        router.push(url);
    }
  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
        <button onClick={onClick} className="hover:opacity-75 transition mr-4">
            <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400"/>
        </button>
    </ActionTooltip>
  )
}

export default ChatVideoButton