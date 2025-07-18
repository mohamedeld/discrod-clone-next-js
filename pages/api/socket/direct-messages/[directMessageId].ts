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
    const { directMessageId,conversationId } = req.query;
    const { content } = await req.body;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!conversationId) {
      return res.status(400).json({ message: "conversation Id missing" });
    }
    
    const conversation = await prisma.conversation.findFirst({
      where:{
        id:conversationId as string,
        OR:[
          {
            memberOne:{
              profileId:profile?.id
            }
          },
          {
             memberTwo:{
              profileId:profile?.id
            }
          }
        ]
      },
       include:{
        memberOne:{
          include:{
            profile:{
              include:{
                user:true
              }
            }
          }
        },
        memberTwo:{
          include:{
            profile:{
              include:{
                user:true
              }
            }
          }
        }
      }
    })
    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }
    const member = conversation?.memberOne?.id === profile?.id ? conversation?.memberOne : conversation?.memberTwo;
    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }
    let message = await prisma.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
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
      message = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: '',
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
      message = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
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
    const updateKey= `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey,message);
    
    return res.status(200).json(message);
  } catch (error) {
    console.log("Direct Message id put", error);
    res.status(500).json({
      message: "Internal Error",
    });
  }
}
