import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Missing server id", { status: 400 });
    }
    if(name === "general"){
        return new NextResponse("Name can not be 'general'", { status: 400 });
    }
    const server = await prisma.server.update({
        where:{
            id:serverId,
            members:{
                some:{
                    profileId:profile?.id,
                    role:{
                        in:[MemberRole.ADMIN , MemberRole.MODERATOR]
                    }
                }
            },
        },
        data:{
            channels:{
                create:{
                    profileId:profile?.id,
                    name,
                    type
                }
            }
        }
    })
    return NextResponse.json(server,{status:200})
  } catch (error) {
    console.log("channel create", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
