import { initialProfile } from "@/lib/initial-profile"
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const SetupPage = async () => {
    const profile = await initialProfile();

    const server =await prisma.server.findFirst({
        where:{
            members:{
                some:{
                    profileId:profile?.id
                }
            }
        }
    })
    if(server){
        return redirect(`/servers/${server?.id}`)
    }
    
  return (
    <div>SetupPage</div>
  )
}

export default SetupPage