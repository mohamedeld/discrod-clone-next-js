import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MemberRole } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  try {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
      return res.status(405).json({
        error: "Method is not allowed",
      });
    }
    const session = await getServerSession(req, res, authOptions);
    const profile = await prisma.profile.findUnique({
      where: {
        userId: session?.user?.id,
      },
    });
    const { messageId, serverId, channelId } = req.query;
    const { content } = await req.body;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ message: "Server Id missing" });
    }
    if (!channelId) {
      return res.status(400).json({ message: "Channel Id missing" });
    }
    const server = await prisma.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }
    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    const member = server?.members?.find(
      (member) => member?.profileId === profile?.id
    );
    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }
    let message = await prisma.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    if (!message || message?.deleted) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const isMessageOwner = message?.memberId === member?.id;
    const isAdmin = member?.role === MemberRole.ADMIN;
    const isModerator = member?.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({
        message: "Unathorized",
      });
    }

    if (req?.method === "DELETE") {
      message = await prisma.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
    }
    if (req?.method === "PATCH") {
        if(!isMessageOwner){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
      message = await prisma.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
    }
    const updateKey= `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey,message);
    
    return res.status(200).json(message);
  } catch (error) {
    console.log("Message id put", error);
    res.status(500).json({
      message: "Internal Error",
    });
  }
}
