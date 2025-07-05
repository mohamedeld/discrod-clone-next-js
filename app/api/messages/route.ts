import { currentProfile } from "@/lib/current-profile";
import { Message } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const MESSAGES_PATCH = 10;

export async function GET(req:Request){
    try{    
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!channelId){
            return new NextResponse("Channel Id is missing ",{status:400})
        }
        let messages:Message[] = [];
        if(cursor){
            messages = await prisma.message.findMany({
                take:MESSAGES_PATCH,
                skip:1,
                cursor:{
                    id:cursor
                },
                where:{
                    channelId,
                },
                include:{
                    member:{
                        include:{
                            profile:{
                                include:{
                                    user:true
                                }
                            }
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        }else{
            messages = await prisma.message.findMany({
                take:MESSAGES_PATCH,
                where:{
                    channelId
                },
                include:{
                    member:{
                        include:{
                            profile:{
                                include:{
                                    user:true
                                }
                            }
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        }

        let nextCursor = null;
        if(messages?.length === MESSAGES_PATCH){
            nextCursor = messages[MESSAGES_PATCH -1]?.id
        }

    }catch(error){
        console.log("error messages",error);
        return new NextResponse("Internal error",{status:500})
    }
}