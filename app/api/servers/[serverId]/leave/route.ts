import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      serverId: string;
    }>;
  }
) {
  try {
    const { serverId } = await params;
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("server id missing", { status: 400 });
    }
    const server = await prisma.server.update({
        where:{
            id:serverId,
            profileId:{
                not:profile?.id
            },
            members:{
                some:{
                    profileId:profile?.id
                }
            }
        },
        data:{
            members:{
                deleteMany:{
                    profileId:profile?.id
                }
            }
        }
    })
    return NextResponse.json(server,{status:200});
  } catch (error) {
    console.log("Server id", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
