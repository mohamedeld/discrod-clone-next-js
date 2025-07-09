"use client";
import {format} from "date-fns";
import { Member, Message, Profile, User } from "@/lib/generated/prisma";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2 } from "lucide-react";
import { Fragment } from "react";
import ChatItem from "./ChatItem";
import { useChatSocket } from "@/hooks/use-chat-socket";

interface IProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

type MessageWithMemberWithProfileWithUser = Message &{
  member:Member & {
    profile: Profile &{
      user:User
    }
  }
}
const dateFormat = "d MMM yyyy, HH:mm";

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  paramKey,
  paramValue,
  type,
}: IProps) => {
  const queryKey= `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const {data,fetchNextPage,hasNextPage,isFetchingNextPage,status} = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  });
  useChatSocket({addKey,updateKey,queryKey});
  if(status === 'pending'){
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
      </div>
    )
  }
  if(status === 'error'){
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Loader2 className="h-7 w-7 text-zinc-500  my-4"/>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Something went wrong</p>
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group,i)=>(
          <Fragment key={i}>
            {group?.items?.map((message:MessageWithMemberWithProfileWithUser)=>(
              <ChatItem id={message?.id} key={message?.id} currentMember={member} content={message?.content} fileUrl={message?.fileUrl} deleted={message?.deleted} timestamp={format(new Date(message?.createdAt),dateFormat)} isUpdated={message?.updatedAt !== message?.createdAt} socketUrl={socketUrl} socketQuery={socketQuery} member={message?.member}/>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
