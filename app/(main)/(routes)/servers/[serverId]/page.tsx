import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface IProps{
  params:Promise<{
    serverId:string;
  }>
}

const ServerDetailPage = async ({params}:IProps) => {
  const {serverId} = await params;
  const profile = await currentProfile();
  if(!profile){
    return redirect("/login");
  }
  const server =await prisma.server.findUnique({
    where:{
      id:serverId,
      members:{
        some:{
          profileId:profile?.id
        }
      }
    },
    include:{
      channels:{
        where:{
          name:'general'
        },
        orderBy:{
          createdAt:'asc'
        }
      }
    }
  });
  const initialChannel = server?.channels[0];
  if(initialChannel?.name !== "general"){
    return null;
  }
  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`)
}

export default ServerDetailPage