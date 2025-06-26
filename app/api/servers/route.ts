import {v4 as uuidv4} from "uuid"
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MemberRole } from "@/lib/generated/prisma";

export async function POST(req:Request){
    try{
        const {name,imageUrl} = await req.json();
        const profile = await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        const server = await prisma.server.create({
            data:{
                profileId:profile?.id,
                name,
                imageUrl,
                inviteCode:uuidv4(),
                channels:{
                    create:[
                        {name:"general",profileId:profile?.id}
                    ]
                },
                members:{
                    create:[
                        {profileId:profile?.id,role:MemberRole.ADMIN}
                    ]
                }
            }
        })
        return NextResponse.json(server,{status:200});
    }catch(error){
        console.log("servers post",error);
        return new NextResponse("Internal Error",{status:500})
    }
}