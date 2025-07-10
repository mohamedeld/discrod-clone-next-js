import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface IProps{
    params:Promise<{
        serverId:string;
        memberId:string;
    }>
}

const MemberDetailPage = async ({params}:IProps) => {
    const {serverId,memberId} = await params;
    const profile = await currentProfile();
    if(!profile){
        return redirect("/login");
    }
    const currentMember = await prisma.member.findFirst({
        where:{
            serverId:serverId,
            profileId:profile?.id
        },
        include:{
            profile:{
                include:{
                    user:true
                }
            }
        }
    });
    if(!currentMember){
        return redirect("/")
    }
    const conversation = await getOrCreateConversation(currentMember?.id,memberId);
    if(!conversation){
        return redirect(`/servers/${serverId}`);
    }
    const {memberOne,memberTwo} = conversation;

    const otherMember = memberOne?.profileId === profile?.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader imageUrl={otherMember?.profile?.imageUrl} name={otherMember?.profile?.user?.name} serverId={serverId} type="conversation" />
        <ChatMessages 
            member={currentMember}
            name={otherMember?.profile?.user?.name}
            chatId={conversation?.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation?.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
                conversationId:conversation?.id
            }}
        />
        <ChatInput
            name={otherMember?.profile?.user?.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
                conversationId:conversation?.id
            }}
        />
    </div>
  )
}

export default MemberDetailPage