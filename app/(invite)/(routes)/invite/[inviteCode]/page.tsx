import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface IProps{
    params:Promise<{
        inviteCode:string;
    }>
}
const InvitePage = async ({params}:IProps) => {
    const {inviteCode} = await params;
    const profile = await currentProfile();
    if(!profile){
        return redirect("/");
    }
    if(!inviteCode){
        return redirect("/");
    }

    const existingServer = await prisma.server.findFirst({
        where:{
            inviteCode,
            members:{
                some:{
                    profileId:profile?.id
                }
            }
        }
    })
    if(existingServer){
        return redirect(`/servers/${existingServer?.id}`);
    }
    const server =await prisma.server.update({
        where:{
            inviteCode
        },
        data:{
            members:{
                create:[
                    {
                        profileId:profile?.id
                    }
                ]
            }
        }
    })
    if(server){
        return redirect(`/servers/${server?.id}`)
    }

  return null;
}

export default InvitePage