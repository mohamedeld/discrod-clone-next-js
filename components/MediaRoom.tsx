"use client";

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface MediaRoomProps{
    chatId:string;
    video:boolean;
    audio:boolean;
}
const MediaRoom = ({chatId,video,audio}:MediaRoomProps) => {
    const {data:session} = useSession();
    const [token,setToken] = useState("")
    useEffect(()=>{
        if(!session?.user?.name){
            return;
        }
        (async()=>{
            try{
                const res = await fetch(`/api/token?room=${chatId}&username=${session?.user?.name}`);
                const data = await res?.json()
                setToken(data?.token);
            }catch(error){
                toast.error((error as Error)?.message || "Something went wrong")
            }
        })()
    },[session?.user,chatId])
    if(token === ""){
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4'/>
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading...</p>
            </div>
        )
    }
  return (
    <LiveKitRoom data-lk-theme="default" serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} token={token} video={video} connect={true} audio={audio}>
        <VideoConference/>
    </LiveKitRoom>
  )
}

export default MediaRoom