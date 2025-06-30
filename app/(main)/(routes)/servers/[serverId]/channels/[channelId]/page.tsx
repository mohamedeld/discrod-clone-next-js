import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


interface IProps{
  params:Promise<{
    serverId:string;
    channelId:string;
  }>
}
const ChannelDetailPage = async ({params}:IProps) => {
  const {serverId,channelId} = await params;
  const profile = await currentProfile();
  if(!profile){
    return redirect("/");
  }
  const channel = await prisma.channel.findUnique({
    where:{
      id:channelId
    }
  });
  const member = await prisma.member.findFirst({
    where:{
      serverId,
      profileId:profile?.id
    }
  });
  if(!channel || !member){
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader serverId={serverId} name={channel?.name} type={"channel"}/>
      <div className="flex-1">Future Messages</div>
        <ChatInput
            name={channel?.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
                channelId:channel?.id,
                serverId:channel?.serverId
            }}
        />
    </div>
  )
}

export default ChannelDetailPage