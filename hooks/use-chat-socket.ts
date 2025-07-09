import { Member, Message, Profile, User } from "@/lib/generated/prisma";
import { useSocket } from "@/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey:string;
    updateKey:string;
    queryKey:string;
}

type MessageWithMemberWithProfileWithUser = Message & {
    member:Member & {
        profile :Profile & {
            user:User
        }
    }
}

export const useChatSocket = ({addKey,updateKey,queryKey}:ChatSocketProps)=>{
    const {socket} = useSocket();
    const queryClient = useQueryClient();

    useEffect(()=>{
        if(!socket){
            return;
        }
        socket.on(updateKey,(message:MessageWithMemberWithProfileWithUser)=>{
            queryClient.setQueryData([queryKey],(oldData:any)=>{
                if(!oldData || !oldData?.pages || oldData?.pages?.length === 0){
                    return oldData;
                }
                const newData = oldData?.pages?.map((page:any)=>{
                    return {
                        ...page,
                        items:page?.items?.map((item:MessageWithMemberWithProfileWithUser)=>{
                            if(item?.id === message?.id){
                                return message;
                            }
                            return item;
                        })
                    }
                })
                return {
                    ...oldData,
                    pages:newData
                }
            })
        })

        socket.on(addKey,(message:MessageWithMemberWithProfileWithUser)=>{
            queryClient.setQueryData([queryKey],(oldData:any)=>{
                if(!oldData || !oldData?.pages || oldData?.pages?.length === 0){
                    return  {
                        pages:[{
                            items:[message]
                        }]                        
                    };
                }
                const newData = [...oldData?.pages];
                newData[0] = {
                    ...newData[0],
                    items:[
                        message,
                        ...newData[0]?.items
                    ]
                }
                return {
                    ...oldData,
                    pages:newData
                }
            })
        });
        return ()=>{
            socket.off(addKey);
            socket.off(updateKey);
        }
    },[queryClient,queryKey,updateKey,addKey,socket])
}