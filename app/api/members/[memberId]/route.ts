import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      memberId: string;
    }>;
  }
) {
    try{
        const {memberId} = await params;
    const profile = await currentProfile();
    const {searchParams} = new URL(req.url)
    const serverId = searchParams.get("serverId");
    
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Missing server id", { status: 400 });
    }
    if (!memberId) {
      return new NextResponse("Missing member id", { status: 400 });
    }

    const server = await prisma.server.update({
        where:{
            id:serverId,
            profileId:profile?.id
        },
        data:{
            members:{
                deleteMany:{
                    id:memberId,
                    profileId:{
                        not:profile?.id
                    }
                }
            }
        },
        include:{
            members:{
                include:{
                    profile:{
                        include:{
                            user:true
                        }
                    }
                },
                orderBy:{
                    role:"asc"
                }
            }
        }
    })
    return NextResponse.json(server,{status:200})
    }catch(error){
        console.log("Member id delete", error);
    return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      memberId: string;
    }>;
  }
) {
  try {
    const {memberId} = await params;
    const profile = await currentProfile();
    const {searchParams} = new URL(req.url)
    const {role} = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Missing server id", { status: 400 });
    }
    if (!memberId) {
      return new NextResponse("Missing member id", { status: 400 });
    }

    const server = await prisma.server.update({
        where:{
            id:serverId,
            profileId:profile?.id
        },
        data:{
            members:{
                update:{
                    where:{
                        id:memberId,
                        profileId:{
                            not:profile?.id
                        }
                    },
                    data:{
                        role
                    }
                }
            }
        },
        include:{
            members:{
                include:{
                    profile:{
                        include:{
                            user:true
                        }
                    }
                },
                orderBy:{
                    role:"asc"
                }
            }
        }
    })
    
    return NextResponse.json(server,{status:200})

  } catch (error) {
    console.log("Member id", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

