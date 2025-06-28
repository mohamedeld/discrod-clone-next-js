import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      channelId: string;
    }>;
  }
) {
  try {
    const profile = await currentProfile();
    const {channelId} = await params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams?.get("serverId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Missing server id", { status: 400 });
    }
    if (!channelId) {
      return new NextResponse("Missing channel id", { status: 400 });
    }
    const server = await prisma.server.update({
        where:{
            id:serverId,
            members:{
                some:{
                    profileId:profile?.id,
                    role:{
                        in:[MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                }
            }
        },
        data:{
            channels:{
                delete:{
                    id:channelId,
                    name:{
                        not:'general'
                    }
                }
            }
        }
    })
    return NextResponse.json(server,{status:200})
  } catch (error) {
     console.log("channel delete", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      channelId: string;
    }>;
  }
) {
  try {
    const profile = await currentProfile();
    const {channelId} = await params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams?.get("serverId");
    const {name,type} = await req?.json();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Missing server id", { status: 400 });
    }
    if (!channelId) {
      return new NextResponse("Missing channel id", { status: 400 });
    }
    if(name === "general"){
        return new NextResponse("channel can not be 'general'", { status: 400 });
    }
    const server = await prisma.server.update({
        where:{
            id:serverId,
            members:{
                some:{
                    profileId:profile?.id,
                    role:{
                        in:[MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                }
            }
        },
        data:{
            channels:{
                update:{
                    where:{
                        id:channelId,
                        NOT:{
                            name:"general"
                        }
                    },
                    data:{
                        name,
                        type
                    }
                }
            }
        }
    })
    return NextResponse.json(server,{status:200})
  } catch (error) {
     console.log("channel patch", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
