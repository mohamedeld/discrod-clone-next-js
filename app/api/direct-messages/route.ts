import { currentProfile } from "@/lib/current-profile";
import { DirectMessage } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const MESSAGES_PATCH = 10;

export async function GET(req:Request){
    try{    
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!conversationId){
            return new NextResponse("Conversation Id is missing ",{status:400})
        }
        let messages:DirectMessage[] = [];
        if(cursor){
            messages = await prisma.directMessage.findMany({
                take:MESSAGES_PATCH,
                skip:1,
                cursor:{
                    id:cursor
                },
                where:{
                    conversationId,
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
            messages = await prisma.directMessage.findMany({
                take:MESSAGES_PATCH,
                where:{
                    conversationId
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
        return NextResponse.json({
            items:messages,
            nextCursor
        });
    }catch(error){
        console.log("error direct messages",error);
        return new NextResponse("Internal error",{status:500})
    }
}