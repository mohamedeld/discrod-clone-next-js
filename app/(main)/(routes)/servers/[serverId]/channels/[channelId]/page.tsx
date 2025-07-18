import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import MediaRoom from "@/components/MediaRoom";
import { currentProfile } from "@/lib/current-profile";
import { ChannelType } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface IProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
}
const ChannelDetailPage = async ({ params }: IProps) => {
  const { serverId, channelId } = await params;
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });
  const member = await prisma.member.findFirst({
    where: {
      serverId,
      profileId: profile?.id,
    },
  });
  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader serverId={serverId} name={channel?.name} type={"channel"} />

      {channel.type === ChannelType?.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel?.name}
            type="channel"
            apiUrl={"/api/messages"}
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel?.id,
              serverId: channel?.serverId,
            }}
            paramKey="channelId"
            paramValue={channel?.id}
            chatId={channel?.id}
          />
          <ChatInput
            name={channel?.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel?.id,
              serverId: channel?.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          chatId={channel?.id}
          audio={true}
          video={false}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          chatId={channel?.id}
          audio={false}
          video={true}
        />
      )}
    </div>
  );
};

export default ChannelDetailPage;
